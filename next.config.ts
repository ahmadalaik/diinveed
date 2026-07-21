import type { NextConfig } from "next";

const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  serverExternalPackages: ["better-auth", "@better-auth/core"],
  images: {
    remotePatterns: [
      ...(r2Url
        ? [
            {
              protocol: "https" as const,
              hostname: new URL(r2Url).hostname,
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
      {
        protocol: "https",
        hostname: "transparenttextures.com",
        pathname: "/patterns/**",
      },
    ],
  },
};

export default nextConfig;
