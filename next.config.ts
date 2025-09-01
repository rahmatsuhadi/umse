import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{
      hostname: "images.unsplash.com",
    }, {
      hostname: "sleman-mart.test",
    },
    {
      hostname: 'smart.host1.uno'
    },{
      hostname: 'avatars.laravel.cloud'
    }
    ],
  },
};

export default nextConfig;
