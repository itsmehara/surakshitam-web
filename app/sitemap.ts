import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { products } from "@/lib/catalog";
import { articles } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/shop",
    "/our-story",
    "/ingredients",
    "/learn",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/product/${p.slug}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${base}/learn/${a.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...articleRoutes];
}
