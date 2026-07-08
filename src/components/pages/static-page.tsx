"use client";

import { useLocaleStore } from "@/store";

interface StaticPageProps {
  content: {
    ar: { title: string; body: string };
    en: { title: string; body: string };
  };
}

export function StaticPage({ content }: StaticPageProps) {
  const { locale } = useLocaleStore();
  const page = content[locale];

  return (
    <div className="container py-12">
      <h1 className="section-title mb-8">{page.title}</h1>
      <div
        className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-brand-600"
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </div>
  );
}
