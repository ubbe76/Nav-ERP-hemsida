import type { NextConfig } from "next";

// BASE_PATH is set when the site is served from a sub-path, e.g. GitHub project
// pages (<user>.github.io/<repo>/). NEXT_PUBLIC_BASE_PATH exposes it to
// lib/site.ts withBase() for URLs Next doesn't rewrite itself (raw HTML, <img>).
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  // Hosts the dev server may be reached through, as in the app (dev/apps/web).
  // Next.js blocks /_next/* dev resources from unlisted hosts, which silently
  // kills all client-side JS — the theme switcher and mobile menu go dead.
  allowedDevOrigins: ["dev.cibbe.org", "192.168.1.215"],
  images: { unoptimized: true },
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
