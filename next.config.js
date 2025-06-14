/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "readdy.ai",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
