"use client";

import { useEffect } from "react";
import { useTheme } from "@/components/ui/ThemeContext";

export function useSwitchTheme() {
  const { computedTheme } = useTheme();

  useEffect(() => {
    // Remove existing theme classes from documentElement
    document.documentElement.classList.remove("light");
    document.documentElement.classList.remove("dark");

    // Apply the theme class to documentElement (HTML tag)
    if (computedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [computedTheme]);
}
