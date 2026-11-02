import type { NextConfig } from "next";

const config: NextConfig = {
  serverExternalPackages: ["mysql2"],
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    // agrotechnica.site -> www.agrotechnica.site (evita dividir SEO)
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "agrotechnica.site" }],
        destination: "https://www.agrotechnica.site/:path*",
        permanent: true,
      },
    ];
  },
};
export default config;
