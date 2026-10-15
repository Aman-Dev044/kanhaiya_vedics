import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/data";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { brand } = await getSettings();
  return {
    name: brand.name,
    short_name: brand.name.split(" ")[0],
    description: brand.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8f1",
    theme_color: "#1f3d1c",
    categories: ["food", "shopping"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
