/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "via.placeholder.com", 
      "placehold.co",
      "advertiser-capacity-beam-teachers.trycloudflare.com"
    ],
  },
};

module.exports = nextConfig;