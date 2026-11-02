import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // OBLIGATORIU: Generează HTML/CSS/JS pur în folderul /out
  trailingSlash: true, // Recomandat pentru SEO și rutare curată pe Cloudflare Pages
  images: {
    unoptimized: true, // Necesar pentru static export fără server de optimizare imagini
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
