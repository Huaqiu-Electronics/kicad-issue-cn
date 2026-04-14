"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

type Theme = "light" | "dark" | "auto";
type ComputedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  computedTheme: ComputedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark" || saved === "auto") {
        return saved;
      }
    }
    return "auto";
  });

  const [systemTheme, setSystemTheme] = useState<ComputedTheme>("light");

  // Detect system theme + listen for changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const updateSystemTheme = () => {
      setSystemTheme(media.matches ? "dark" : "light");
    };

    updateSystemTheme();

    media.addEventListener("change", updateSystemTheme);
    return () => media.removeEventListener("change", updateSystemTheme);
  }, []);

  // computed theme
  const computedTheme: ComputedTheme = theme === "auto" ? systemTheme : theme;

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      localStorage.setItem("theme", newTheme);
    },
    []
  );

  return (
    <ThemeContext.Provider value={{ theme, computedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
