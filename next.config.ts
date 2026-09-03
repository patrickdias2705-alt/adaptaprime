import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Brand assets are already web-sized and are served directly so local and
  // Cloudflare previews do not depend on an image-binding being present.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
