import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AlpinistiUtilitari.ro",
    short_name: "Alpinisti Utilitari",
    description:
      "Cereri pentru servicii de alpinism utilitar și lucrări la înălțime în România.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0063f7",
    lang: "ro-RO",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
