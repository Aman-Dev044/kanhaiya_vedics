"use client";

import { createContext, useContext } from "react";
import type { SiteSettings } from "@/lib/types";
import { defaultSettings } from "@/lib/fallback";

const SettingsContext = createContext<SiteSettings>(defaultSettings);

export function SettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
