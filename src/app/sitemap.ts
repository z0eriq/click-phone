import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const pages = [
    "",
    "/about",
    "/shop",
    "/offers",
    "/latest-phones",
    "/accessories",
    "/maintenance",
    "/blog",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "" ? "daily" : "weekly",
    priority: page === "" ? 1 : 0.8,
  }));
}
