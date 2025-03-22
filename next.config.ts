import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'private-user-images.githubusercontent.com',
      'spotifycdn.com',
      'image-cdn-ak.spotifycdn.com',
      'image-cdn-fa.spotifycdn.com',
      'i.scdn.co',
      'mosaic.scdn.co',
    ],
  },
};

export default nextConfig;
