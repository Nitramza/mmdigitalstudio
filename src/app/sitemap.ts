import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://digitalstudio.example",
      lastModified: new Date("2026-11-22"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
