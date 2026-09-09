import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flags.restcountries.com",
        pathname: "/v5/svg/**",
      },
    ],
  },
};

export default nextConfig;