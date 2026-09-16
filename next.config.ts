import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The visual assets are already exported in web-ready formats. Keeping them
  // direct avoids an extra optimization hop for the large editorial banners.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
