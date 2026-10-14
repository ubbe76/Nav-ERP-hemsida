"use client";

import { Ghost, Moon, Sun, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { THEMES, THEME_STORAGE_KEY, isThemeId, type ThemeId } from "@/lib/themes";
import styles from "./ThemeToggle.module.css";

const ICONS: Record<ThemeId, LucideIcon> = { light: Sun, dark: Moon, dracula: Ghost };

export function ThemeToggle() {
  // null until mounted: the boot script chose the theme before hydration and
  // the server can't know which one.
  const [theme, setTheme] = useState<ThemeId | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(isThemeId(current) ? current : "light");
  }, []);

  function select(next: ThemeId) {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage blocked — the choice still holds for this page view.
    }
  }

  return (
    <div className={styles.toggle} role="group" aria-label="Färgtema">
      {THEMES.map((t) => {
        const Icon = ICONS[t.id];
        return (
          <button
            key={t.id}
            type="button"
            className={styles.option}
            aria-pressed={theme === t.id}
            aria-label={t.label}
            title={t.label}
            onClick={() => select(t.id)}
          >
            <Icon size={16} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
