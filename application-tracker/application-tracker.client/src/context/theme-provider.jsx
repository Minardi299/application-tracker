import { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext({
  theme: "system",
  setTheme: () => null,
  preset: null,
  setPreset: () => null,
});

export function ThemeProvider({ children, defaultTheme = "system", defaultPreset = null, storageKey = "vite-ui-theme" }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem(`${storageKey}-mode`) || defaultTheme);
  const [preset, setPresetState] = useState(() => {
    const raw = localStorage.getItem(`${storageKey}-preset`);
    return raw ? JSON.parse(raw) : defaultPreset;
  });

  const setTheme = (newTheme) => {
    localStorage.setItem(`${storageKey}-mode`, newTheme);
    setThemeState(newTheme);
  };

  const setPreset = (newPreset) => {
    localStorage.setItem(`${storageKey}-preset`, JSON.stringify(newPreset));
    setPresetState(newPreset);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    const resolved = theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : theme;

    root.classList.add(resolved);

    const styles = preset?.styles?.[resolved];
    if (styles) {
      Object.entries(styles).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  }, [theme, preset]);

  const value = { theme, setTheme, preset, setPreset };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}


export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
