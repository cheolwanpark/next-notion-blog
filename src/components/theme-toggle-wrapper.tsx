'use client'

import { useDarkMode } from "@/components/providers";
import { ModernThemeToggle } from "@/components/modern-theme-toggle";

export const ThemeToggleWrapper = () => {
  const { isDarkMode } = useDarkMode();
  
  return <ModernThemeToggle initialTheme={isDarkMode === true ? 'dark' : 'light'} />;
};