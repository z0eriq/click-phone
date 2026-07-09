import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "المدونة",
  description: "أحدث الأخبار والمراجعات - كليك فون",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let posts: Array<{
    id: string;
    title: string;
    titleAr: string | null;
    slug: string;
    excerpt: string | null;
    excerptAr: string | null;
    image: string | null;
    publishedAt: Date | null;
  }> = [];

  try {
    posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    // DB not connected
  }

  return (
    <div className="container py-12">
      <h1 className="section-title mb-8">المدونة</h1>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500 py-20">لا توجد مقالات حالياً</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <article className="overflow-hidden rounded-2xl border transition-all hover:shadow-xl dark:border-gray-800">
                {post.image && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.titleAr || post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="mb-2 text-lg font-bold group-hover:text-brand-600">
                    {post.titleAr || post.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {post.excerptAr || post.excerpt}
                  </p>
                  {post.publishedAt && (
                    <time className="mt-3 block text-xs text-gray-400">
                      {new Date(post.publishedAt).toLocaleDateString("ar-JO")}
                    </time>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
