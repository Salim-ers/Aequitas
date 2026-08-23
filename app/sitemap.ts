import type { MetadataRoute } from "next";
import { appUrl } from "@/src/lib/env";

const ROUTES = [
  "",
  "/fonctionnalites",
  "/facturation-electronique",
  "/tarifs",
  "/securite",
  "/conformite",
  "/developers",
  "/contact",
  "/mentions-legales",
  "/confidentialite",
  "/cgu",
  "/cgv",
  "/cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((route) => ({
    url: appUrl(route),
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
