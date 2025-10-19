/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "via.placeholder.com", 
      "placehold.co",
      "advertiser-capacity-beam-teachers.trycloudflare.com",
      "donation-furthermore-shame-quiz.trycloudflare.com",
      "gratis-month-versus-packard.trycloudflare.com",
      "twist-steps-ideal-antonio.trycloudflare.com",
      "job-remark-departmental-civic.trycloudflare.com",
      "stevens-maximum-rides-executed.trycloudflare.com",
      "things-programming-discovered-actually.trycloudflare.com"
      , "rugby-affecting-kit-youth.trycloudflare.com"
    ],
    // Allow any subdomain of trycloudflare.com (covers many dynamic preview hosts)
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**.trycloudflare.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.trycloudflare.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;