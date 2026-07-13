import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { getAuthFromRequest, isAdmin } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/api-utils";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
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

export async function POST(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session || !isAdmin(session.role)) return apiError("Unauthorized", 401);

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return apiError("No file uploaded", 400);
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return apiError("Only JPG, PNG, WEBP, GIF images are allowed", 400);
    }

    if (file.size > MAX_BYTES) {
      return apiError("Image must be 5MB or smaller", 400);
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = safeExt(file.type, file.name);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Production on Vercel: use Blob so files persist
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`products/${filename}`, bytes, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
      });
      return apiResponse({ url: blob.url });
    }

    // Local / non-Vercel: save under public/uploads
    if (process.env.VERCEL === "1") {
      return apiError(
        "BLOB_READ_WRITE_TOKEN is required for uploads on Vercel",
        500
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), bytes);

    return apiResponse({ url: `/uploads/products/${filename}` });
  } catch (error) {
    console.error("Upload failed:", error);
    return apiError("Failed to upload image", 500);
  }
}
