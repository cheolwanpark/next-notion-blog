const { siteConfig } = require("./site.config");
const { withPlaiceholder } = require("@plaiceholder/next");
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    minimumCacheTTL: siteConfig.revalidateTime,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
  experimental: {
    optimizeCss: true,
  },
};

module.exports = withPlaiceholder(nextConfig);
