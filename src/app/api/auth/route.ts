import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import {
  hashPassword,
  createToken,
  verifyPassword,
  logActivity,
} from "@/lib/auth";
import { apiResponse, apiError, rateLimit } from "@/lib/api-utils";
import { cookies } from "next/headers";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 20, 60000);
  if (limited) return limited;

  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === "register") {
      const parsed = registerSchema.safeParse(data);
      if (!parsed.success) return apiError("Invalid input", 400);

      const existing = await prisma.user.findUnique({
        where: { email: parsed.data.email },
      });
      if (existing) return apiError("Email already registered", 409);

      const hashed = await hashPassword(parsed.data.password);
      const user = await prisma.user.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          password: hashed,
          phone: parsed.data.phone,
          role: "CUSTOMER",
        },
      });

      const token = await createToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      const cookieStore = await cookies();
      cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      await logActivity(user.id, "REGISTER", "User", user.id, undefined, request);

      return apiResponse({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    if (action === "login") {
      const parsed = loginSchema.safeParse(data);
      if (!parsed.success) return apiError("Invalid input", 400);

      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email },
      });

      if (!user) return apiError("Invalid credentials", 401);
      if (!user.isActive) return apiError("Account is deactivated", 403);
      if (user.isBanned) return apiError("Account is banned", 403);

      const valid = await verifyPassword(parsed.data.password, user.password);
      if (!valid) return apiError("Invalid credentials", 401);

      const token = await createToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      const cookieStore = await cookies();
      cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      await logActivity(user.id, "LOGIN", "User", user.id, undefined, request);

      return apiResponse({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    if (action === "logout") {
      const cookieStore = await cookies();
      cookieStore.delete("auth-token");
      return apiResponse({ success: true });
    }

    return apiError("Invalid action", 400);
  } catch (error) {
    console.error("Auth error:", error);
    return apiError("Internal server error", 500);
  }
}

export async function GET() {
  try {
    const { getCurrentUser } = await import("@/lib/auth");
    const user = await getCurrentUser();
    if (!user) return apiError("Not authenticated", 401);
    return apiResponse({ user });
  } catch {
    return apiError("Internal server error", 500);
  }
}
