// Same three themes, labels and storage key as the app (dev/apps/web/lib/themes.ts),
// so a visitor's choice reads the same on both. Unlike the app, the site
// follows the OS light/dark setting until the visitor picks a theme.
export const THEMES = [
  { id: "light", label: "Ljust" },
  { id: "dark", label: "Mörkt" },
  { id: "dracula", label: "Dracula" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const THEME_STORAGE_KEY = "nav-erp-theme";

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}

// Inlined into <head> so the theme is applied before first paint. Always sets
// data-theme, so theme-specific CSS (screenshots) has a single switch.
// localStorage can throw (private mode, blocked site data), hence the try.
export const themeBootScript = `(function(){var t=null;try{t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)})}catch(e){}if(${JSON.stringify(THEMES.map((t) => t.id))}.indexOf(t)<0){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)})();`;
