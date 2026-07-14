import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { put } from "@vercel/blob";
import { getAuthFromRequest, isAdmin } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/api-utils";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB upload limit
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function safeExt(mime: string, originalName: string) {
  const fromMime: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  if (fromMime[mime]) return fromMime[mime];
  const ext = path.extname(originalName).replace(".", "").toLowerCase();
  return ext || "jpg";
}

/** Compress image for storage when Blob is unavailable. */
async function optimizeImage(bytes: Buffer) {
  return sharp(bytes)
    .rotate()
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
}

async function uploadToCloudinary(bytes: Buffer, filename: string) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) return null;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = "click-phone/products";
  const publicId = filename.replace(/\.[^.]+$/, "");

  // signature = sha1 of sorted params: folder, public_id, timestamp + api_secret
  const { createHash } = await import("crypto");
  const toSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${secret}`;
  const signature = createHash("sha1").update(toSign).digest("hex");

  const form = new FormData();
  form.append("file", `data:image/webp;base64,${bytes.toString("base64")}`);
  form.append("api_key", key);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("public_id", publicId);
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("Cloudinary upload failed:", err);
    return null;
  }
  const data = (await res.json()) as { secure_url?: string };
  return data.secure_url || null;
}

export async function POST(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session || !isAdmin(session.role)) return apiError("Unauthorized", 401);

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return apiError("لم يتم اختيار ملف", 400);
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return apiError("يُسمح فقط بصور JPG و PNG و WEBP و GIF", 400);
    }

    if (file.size > MAX_BYTES) {
      return apiError("حجم الصورة يجب أن يكون 5 ميجابايت أو أقل", 400);
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const optimized = await optimizeImage(bytes);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

    // 1) Vercel Blob (best for production)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`products/${filename}`, optimized, {
        access: "public",
        contentType: "image/webp",
        addRandomSuffix: false,
      });
      return apiResponse({ url: blob.url });
    }

    // 2) Cloudinary (optional alternative)
    const cloudinaryUrl = await uploadToCloudinary(optimized, filename);
    if (cloudinaryUrl) {
      return apiResponse({ url: cloudinaryUrl });
    }

    // 3) Local disk (development / non-Vercel)
    if (process.env.VERCEL !== "1") {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), optimized);
      return apiResponse({ url: `/uploads/products/${filename}` });
    }

    // 4) Vercel without Blob/Cloudinary: store optimized data URL in DB
    // Keeps uploads working until Blob storage is connected.
    const dataUrl = `data:image/webp;base64,${optimized.toString("base64")}`;
    if (dataUrl.length > 1_200_000) {
      return apiError("الصورة كبيرة جداً بعد الضغط — جرّب صورة أصغر", 400);
    }
    return apiResponse({ url: dataUrl });
  } catch (error) {
    console.error("Upload failed:", error);
    return apiError("فشل رفع الصورة", 500);
  }
}
