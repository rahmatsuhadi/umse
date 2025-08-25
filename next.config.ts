import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{
      hostname: "images.unsplash.com",
    },{
      hostname: "sleman-mart.test",
    },
  {
    hostname: 'smart.host1.uno'
  }
  ],
  },
};

export default nextConfig;
