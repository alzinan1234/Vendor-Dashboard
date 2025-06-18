/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["via.placeholder.com", "placehold.co"], // Add the domain for external images
  },
};

module.exports = nextConfig;
