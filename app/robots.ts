import type { MetadataRoute } from "next";
import { appUrl } from "@/src/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // §66 / §104 — l'espace applicatif n'est jamais indexé.
        disallow: ["/api/", "/dashboard", "/admin", "/onboarding", "/abonnement"],
      },
    ],
    sitemap: appUrl("/sitemap.xml"),
  };
}
