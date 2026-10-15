"use client";

import { useSettings } from "@/components/providers/SettingsProvider";

export function AnnouncementBar() {
  const { announcement } = useSettings();
  if (!announcement.enabled || !announcement.text) return null;
  const parts = announcement.text.split("·").map((s) => s.trim()).filter(Boolean);
  const row = [...parts, ...parts, ...parts];

  return (
    <div className="relative overflow-hidden bg-[#1f3d1c] py-2 text-[0.78rem] font-medium tracking-wide text-[#f5ebcf] dark:bg-[#14210f]">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap hover:[animation-play-state:paused]">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            {t}
            <span className="text-[#e2bf6c]" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
