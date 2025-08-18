const { siteConfig } = require("./site.config");
const { withPlaiceholder } = require("@plaiceholder/next");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
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
        hostname: "**",
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
};

module.exports = withBundleAnalyzer(withPlaiceholder(nextConfig));
