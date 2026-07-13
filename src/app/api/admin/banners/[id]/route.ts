import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getAuthFromRequest, isAdmin } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/api-utils";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  titleAr: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  subtitleAr: z.string().optional().nullable(),
  image: z.string().url().optional(),
  link: z.string().optional().nullable(),
  position: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  startsAt: z.string().datetime().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
});

function parseDate(value: string | null | undefined) {
  if (value === undefined) return undefined;
  return value ? new Date(value) : null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthFromRequest(request);
  if (!session || !isAdmin(session.role)) return apiError("Unauthorized", 401);

  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return apiError("Invalid data", 400);

    const { startsAt, expiresAt, ...data } = parsed.data;
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...data,
        ...(startsAt !== undefined && { startsAt: parseDate(startsAt) }),
        ...(expiresAt !== undefined && { expiresAt: parseDate(expiresAt) }),
      },
    });
    return apiResponse({ banner });
  } catch {
    return apiError("Failed to update banner", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthFromRequest(request);
  if (!session || !isAdmin(session.role)) return apiError("Unauthorized", 401);

  const { id } = await params;
  try {
    await prisma.banner.delete({ where: { id } });
    return apiResponse({ success: true });
  } catch {
    return apiError("Failed to delete banner", 500);
  }
}
