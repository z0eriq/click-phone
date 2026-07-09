import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  try {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post || !post.isPublished) notFound();

    return (
      <div className="container py-12">
        <Link href="/blog" className="mb-6 inline-block text-sm text-brand-600 hover:underline">
          ← العودة للمدونة
        </Link>
        <h1 className="section-title mb-4">{post.titleAr || post.title}</h1>
        {post.publishedAt && (
          <time className="mb-8 block text-sm text-gray-500">
            {new Date(post.publishedAt).toLocaleDateString("ar-JO")}
          </time>
        )}
        <div
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.contentAr || post.content }}
        />
      </div>
    );
  } catch {
    notFound();
  }
}
