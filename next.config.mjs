/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    qualities: [25, 50, 60, 70, 75, 80, 85, 90, 100],
    remotePatterns: [
      {
        hostname: "i.ibb.co",
        protocol: "https",
      },
      {
        hostname: "i.ibb.co.com",
        protocol: "https",
      },
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
      },
      {
        hostname: "encrypted-tbn0.gstatic.com",
        protocol: "https",
      },
      {
        hostname: "www.singulart.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
