/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["placehold.jp"], // ← ここに追加！
    remotePatterns: [
      { protocol: 'https', hostname: 'images.microcms-assets.io' }, // これを追加
    ],
  },
};

export default nextConfig;
