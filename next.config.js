/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/wp-content/:path*',
        destination: 'http://localhost/tiles-trader/wp-content/:path*',
      },
      {
        source: '/wp-includes/:path*',
        destination: 'http://localhost/tiles-trader/wp-includes/:path*',
      },
    ];
  },
};

module.exports = nextConfig;