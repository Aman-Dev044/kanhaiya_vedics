"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ThemeMode } from "@/lib/types";

export const THEME_STORAGE_KEY = "kv-theme";

type ThemeContextValue = {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (t: ThemeMode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const systemPrefersDark = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

function apply(mode: ThemeMode) {
  const dark = mode === "dark" || (mode === "system" && systemPrefersDark());
  const root = document.documentElement;
  // Suppress transitions for the instant of the switch so every element flips together.
  root.classList.add("theme-switching");
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
  requestAnimationFrame(() => root.classList.remove("theme-switching"));
  return dark ? "dark" : "light";
}

/**
 * Inline script rendered in <head> so the correct theme is applied before first paint
 * (no flash). `defaultMode` comes from the admin-configurable site settings.
 */
export function ThemeScript({ defaultMode }: { defaultMode: ThemeMode }) {
  const code = `(function(){try{var m=localStorage.getItem('${THEME_STORAGE_KEY}')||'${defaultMode}';var d=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d)r.classList.add('dark');r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export function ThemeProvider({
  defaultMode,
  children,
}: {
  defaultMode: ThemeMode;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultMode);
  const [resolvedTheme, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    let stored: ThemeMode | null = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    } catch {}
    const initial = stored || defaultMode;
    setThemeState(initial);
    setResolved(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, [defaultMode]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolved(apply("system"));
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((t: ThemeMode) => {
    setThemeState(t);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, t);
    } catch {}
    setResolved(apply(t));
  }, []);

  const toggle = useCallback(
    () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    [resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
