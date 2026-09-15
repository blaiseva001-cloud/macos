import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // ── Pin Turbopack to this repo root (silences the lockfile warning) ──
  turbopack: {
    root: path.resolve(__dirname),
  },

  reactStrictMode: true,

  // ── Image optimization ───────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1440, 1920, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384, 512],
  },

  // ── Long-lived immutable cache for public assets + security headers ──
  async headers() {
    return [
      {
        source: "/favicon_io/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*\\.(webp|png|jpg|jpeg|gif|svg|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*\\.(woff|woff2|ttf|otf|eot)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*\\.(mp4|webm|mov)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800" },
        ],
      },
      {
        source: "/:path*\\.(json|geojson)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  // ── Bundle tree-shaking for heavy icon/animation libs ───────────────
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  compress: true,
  poweredByHeader: false,

  // NOTE: `eslint` key removed — Next 16 no longer supports it in config.
  // NOTE: `typescript.ignoreBuildErrors` also removed — we want strict builds.
  //       If you need to skip, use `tsc --noEmit` separately.
};

export default nextConfig;
