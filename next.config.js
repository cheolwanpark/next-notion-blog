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
  // bundlePagesRouterDependencies removed - Pages Router eliminated for 52% bundle reduction
  
  experimental: {
    // optimizeCss: true, // Disabled due to critters dependency issue
    webpackBuildWorker: true, // Parallel webpack builds
    // ppr: true, // Enable when upgrading to Next.js canary for Partial Prerendering
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
    quietDeps: true, // Suppress deprecation warnings from dependencies
    silenceDeprecations: ["import", "legacy-js-api", "global-builtin"], // Silence all Sass deprecation warnings
  },
};

module.exports = withBundleAnalyzer(withPlaiceholder(nextConfig));
