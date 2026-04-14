"use client";

import { useSwitchTheme } from "@/app/hooks/useSwitchTheme";

export default function ThemeApplier({ children }: { children: React.ReactNode }) {
  useSwitchTheme();
  return <>{children}</>;
}
