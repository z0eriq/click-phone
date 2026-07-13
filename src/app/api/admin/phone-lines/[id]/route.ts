import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getAuthFromRequest, isAdmin } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/api-utils";

const updateSchema = z.object({
  number: z.string().min(7).max(20).optional(),
  operator: z.enum(["zain", "orange", "umniah"]).optional(),
  price: z.number().positive().optional(),
  comparePrice: z.number().positive().optional().nullable(),
  title: z.string().optional().nullable(),
  titleAr: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isOnSale: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  startsAt: z.string().datetime().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
});

function parseDate(value: string | null | undefined) {
  if (value === undefined) return undefined;
  return value ? new Date(value) : null;
}

function serialize(line: {
  price: { toString(): string } | number;
  comparePrice: { toString(): string } | number | null;
  [key: string]: unknown;
}) {
  return {
    ...line,
    price: Number(line.price),
    comparePrice: line.comparePrice != null ? Number(line.comparePrice) : null,
  };
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

    const { startsAt, expiresAt, number, ...data } = parsed.data;

    if (number) {
      const dup = await prisma.phoneLine.findFirst({
        where: { number, NOT: { id } },
      });
      if (dup) return apiError("Number already exists", 409);
    }

    const line = await prisma.phoneLine.update({
      where: { id },
      data: {
        ...data,
        ...(number !== undefined && { number }),
        ...(startsAt !== undefined && { startsAt: parseDate(startsAt) }),
        ...(expiresAt !== undefined && { expiresAt: parseDate(expiresAt) }),
      },
    });
    return apiResponse({ line: serialize(line) });
  } catch {
    return apiError("Failed to update phone line", 500);
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
    await prisma.phoneLine.delete({ where: { id } });
    return apiResponse({ success: true });
  } catch {
    return apiError("Failed to delete phone line", 500);
  }
}
