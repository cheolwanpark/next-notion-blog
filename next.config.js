const { siteConfig } = require("./site.config");
const { withPlaiceholder } = require("@plaiceholder/next");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Bundle optimizations for better performance
  bundlePagesRouterDependencies: true, // Auto-bundle all dependencies
  
  experimental: {
    // optimizeCss: true, // Disabled due to critters dependency issue
    webpackBuildWorker: true, // Parallel webpack builds
  },
  
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
