import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/data";

export const alt = "Kanhaiya Vedics — Raw Farm Milk & Vedic Bilona Ghee";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const { brand, hero } = await getSettings();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #fbf8f1 0%, #e7eed9 60%, #f5ebcf 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="84" height="52" viewBox="0 0 84 52">
            <path d="M40 46 C14 44 2 30 0 10 C22 10 38 24 40 46 Z" fill="#3f5f1f" />
            <path d="M44 46 C46 20 60 4 84 0 C82 26 66 44 44 46 Z" fill="#5d8a2a" />
          </svg>
          <div style={{ display: "flex", fontSize: 44, color: "#1f3d1c", fontWeight: 700 }}>{brand.name}</div>
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 84, lineHeight: 1.05, color: "#1f3d1c", fontWeight: 700, maxWidth: 950 }}>
          {hero.title}
        </div>
        <div style={{ display: "flex", marginTop: 32, fontSize: 30, color: "#5f6857", maxWidth: 900 }}>
          Raw farm milk & Vedic bilona ghee from desi indigenous cows
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            alignSelf: "flex-start",
            background: "#4a6b23",
            color: "#fbf8f1",
            fontSize: 28,
            padding: "12px 30px",
            borderRadius: 14,
          }}
        >
          {brand.tagline}
        </div>
      </div>
    ),
    size,
  );
}
