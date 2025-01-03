/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Remove deprecated options
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 