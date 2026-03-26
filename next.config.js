/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "images.unsplash.com",
      "tjuiidqqwmjlfnncyxtq.supabase.co",
      "ochgscezcaoirauicuxc.supabase.co",
      "tjuiidqqwmjlfnncyxtq.supabase.co",
    ],
  },

  async rewrites() {
    return [
      {
        source: "/pricings",
        destination: "/pricings.html",
      },
      {
        source: "/comming-soon",
        destination: "/comming.html",
      },
      {
        source: "/privacy",
        destination: "/priva.html",
      },
      {
        source: "/about",
        destination: "/about.html",
      },
      {
        source: "/terms",
        destination: "/terms.html",
      },
      {
        source: "/contact",
        destination: "/contact.html",
      },
      {
        source: "/",
        destination: "/index.html",
      },
    ];
  },
};

module.exports = nextConfig;