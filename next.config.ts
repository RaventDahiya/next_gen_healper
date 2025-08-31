import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "localhost",
      "imgs.search.brave.com",
      "images.unsplash.com",
      "cdn.pixabay.com",
      "images.pexels.com",
      "upload.wikimedia.org",
      "via.placeholder.com",
      "i.imgur.com",
      "cdn.jsdelivr.net",
      "raw.githubusercontent.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
