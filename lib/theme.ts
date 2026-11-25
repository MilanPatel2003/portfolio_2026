/** Toggles light/dark theme immediately on document root and persists the choice. */
export function toggleDarkLightTheme() {
  const root = document.documentElement;
  const next = root.classList.contains("dark") ? "light" : "dark";
  root.classList.toggle("dark", next === "dark");
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* Ignore storage access errors */
  }
}
