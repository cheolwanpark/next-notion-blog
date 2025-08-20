'use client'

import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

interface DarkModeContextType {
  isDarkMode: boolean | null
  theme: Theme | null
  setMode: (darkMode: boolean) => void
  toggleTheme: () => void
}

const DarkModeContext = createContext<DarkModeContextType>({
  isDarkMode: false,
  theme: null,
  setMode: () => {},
  toggleTheme: () => {},
})

export const useDarkMode = () => useContext(DarkModeContext)

interface DarkModeProviderProps {
  children: React.ReactNode
}

/**
 * Simplified DarkModeProvider that works exclusively with localStorage 
 * and html element data-theme attribute for consistent theming
 */
export const DarkModeProvider = ({ children }: DarkModeProviderProps) => {
  const [isDarkMode, _setMode] = useState<boolean | null>(null)

  const setMode = (val: boolean) => {
    _setMode(val)
    const theme: Theme = val ? "dark" : "light"
    
    // Apply theme to html element consistently
    document.documentElement.setAttribute("data-theme", theme)
    
    // Store in localStorage for persistence
    localStorage.setItem("mode", theme)
  }

  const toggleTheme = () => {
    setMode(isDarkMode !== true)
  }

  useLayoutEffect(() => {
    // Get initial theme from html element (set by preventFlash script)
    const htmlTheme = document.documentElement.getAttribute("data-theme") as Theme
    const isHtmlDarkTheme = htmlTheme === "dark"
    _setMode(isHtmlDarkTheme)
  }, [])

  useEffect(() => {
    // Listen for system theme changes only if no explicit preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (event: MediaQueryListEvent) => {
      // Only auto-switch if no explicit preference is stored
      const storedMode = localStorage.getItem("mode")
      if (!storedMode) {
        setMode(event.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const theme: Theme | null = isDarkMode === null ? null : (isDarkMode ? 'dark' : 'light')

  return (
    <DarkModeContext.Provider value={{ isDarkMode, theme, setMode, toggleTheme }}>
      {children}
    </DarkModeContext.Provider>
  )
}