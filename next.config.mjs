/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "grupohseq.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "sfo2.digitaloceanspaces.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "grupohseq.sfo2.digitaloceanspaces.com",
        pathname: "**",
      },
      
    ],
  },
};

export default nextConfig;
