"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/contexts/theme-context";

export function ThemeToggle({ className = "", iconSize = 18 }: { className?: string; iconSize?: number }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      onClick={toggleTheme}
      className={`grid h-10 w-10 place-items-center rounded-full border border-[var(--color-stroke)] bg-[var(--color-surface)] text-[var(--color-muted)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)] ${className}`}
    >
      {theme === "light" ? <Moon size={iconSize} /> : <Sun size={iconSize} />}
    </button>
  );
}
