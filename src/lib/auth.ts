import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import prisma from "./prisma";
import type { UserRole } from "@prisma/client";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "click-phone-default-secret"
);

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      avatar: true,
      role: true,
      isActive: true,
      isBanned: true,
      twoFactorEnabled: true,
      createdAt: true,
    },
  });

  if (!user || !user.isActive || user.isBanned) return null;
  return user;
}

export async function getAuthFromRequest(
  request: NextRequest
): Promise<JWTPayload | null> {
  const token =
    request.cookies.get("auth-token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return verifyToken(token);
}

export function isAdmin(role: UserRole): boolean {
  return role === "ADMIN" || role === "MANAGER";
}

export function hasPermission(role: UserRole, action: string): boolean {
  const permissions: Record<UserRole, string[]> = {
    ADMIN: ["*"],
    MANAGER: ["products", "orders", "customers", "content", "dashboard"],
    STAFF: ["orders", "products.read"],
    CUSTOMER: [],
  };

  const rolePerms = permissions[role];
  if (rolePerms.includes("*")) return true;
  return rolePerms.some(
    (p) => p === action || action.startsWith(p.replace(".read", ""))
  );
}

export async function logActivity(
  userId: string | null,
  action: string,
  entity?: string,
  entityId?: string,
  details?: string,
  request?: NextRequest
) {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      details,
      ipAddress: request?.headers.get("x-forwarded-for") || undefined,
      userAgent: request?.headers.get("user-agent") || undefined,
    },
  });
}
