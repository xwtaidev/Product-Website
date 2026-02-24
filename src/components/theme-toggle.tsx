"use client";

import { useEffect } from "react";

type Theme = "light" | "dark";

const storageKey = "theme-preference";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
}

function resolveInitialTheme(): Theme {
  const storedTheme = window.localStorage.getItem(storageKey);
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  const datasetTheme = document.documentElement.dataset.theme;
  if (datasetTheme === "dark" || datasetTheme === "light") {
    return datasetTheme;
  }

  return getSystemTheme();
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  useEffect(() => {
    const initialTheme = resolveInitialTheme();
    applyTheme(initialTheme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (event: MediaQueryListEvent) => {
      const storedTheme = window.localStorage.getItem(storageKey);
      if (storedTheme === "dark" || storedTheme === "light") {
        return;
      }

      const nextTheme: Theme = event.matches ? "dark" : "light";
      applyTheme(nextTheme);
    };

    media.addEventListener("change", handleMediaChange);
    return () => {
      media.removeEventListener("change", handleMediaChange);
    };
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme: Theme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
  };

  return (
    <button
      type="button"
      aria-label="切换深浅色主题"
      title="切换深浅色主题"
      onClick={toggleTheme}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white/80 text-zinc-700 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:border-zinc-500 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:text-zinc-50 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 dark:hidden" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20.2 14.9A8.8 8.8 0 1 1 9.1 3.8a7.3 7.3 0 0 0 11.1 11.1Z" />
      </svg>
      <svg viewBox="0 0 24 24" className="hidden h-4 w-4 dark:block" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.2v2.6M12 19.2v2.6M4.22 4.22l1.84 1.84M17.94 17.94l1.84 1.84M2.2 12h2.6M19.2 12h2.6M4.22 19.78l1.84-1.84M17.94 6.06l1.84-1.84" />
      </svg>
    </button>
  );
}
