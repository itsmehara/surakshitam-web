import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // `/rider` carries a customer's address and phone — never index it.
      disallow: ["/account", "/cart", "/search", "/checkout", "/order", "/track-order", "/rider"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
