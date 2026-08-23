import type { NextConfig } from "next";

/**
 * En-têtes de sécurité (§57).
 * CSP volontairement stricte : Stripe est le seul tiers autorisé.
 * 'unsafe-inline' sur style-src est nécessaire pour Next.js (styles inline hydratation).
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  // 'unsafe-eval' uniquement hors production (React Refresh)
  `script-src 'self' 'unsafe-inline' https://js.stripe.com${
    process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"
  }`,
  "connect-src 'self' https://api.stripe.com https://*.public.blob.vercel-storage.com",
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self)",
          },
        ],
      },
      {
        // §104 : aucune réponse applicative ne doit être mise en cache partagé.
        source: "/(app|admin)/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default nextConfig;
