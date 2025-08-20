'use client'

import { SimpleThemeToggle } from "@/components/simple-theme-toggle";

/**
 * Simple wrapper for the theme toggle - no complex state management needed
 * The SimpleThemeToggle handles everything internally for instant toggling
 */
export const ThemeToggleWrapper = () => {
  return <SimpleThemeToggle />;
};