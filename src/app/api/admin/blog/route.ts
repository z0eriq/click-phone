import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthFromRequest, isAdmin } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session || !isAdmin(session.role)) return apiError("Unauthorized", 401);

  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    return apiResponse({ posts });
  } catch {
    return apiError("Failed to fetch posts", 500);
  }
}
