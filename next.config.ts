import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep static export for production builds, but avoid strict
  // generateStaticParams checks in dev when content files change.
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
