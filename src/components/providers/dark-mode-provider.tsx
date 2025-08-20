'use client'

import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'

interface DarkModeContextType {
  isDarkMode: boolean | null
  setMode: (darkMode: boolean) => void
}

const DarkModeContext = createContext<DarkModeContextType>({
  isDarkMode: false,
  setMode: () => {},
})

export const useDarkMode = () => useContext(DarkModeContext)

interface DarkModeProviderProps {
  children: React.ReactNode
}

export function DarkModeProvider({ children }: DarkModeProviderProps) {
  const [isDarkMode, _setMode] = useState<boolean | null>(null)

  const setMode = (val: boolean) => {
    _setMode(val)
    const theme = val ? "dark" : "light"
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("mode", theme)
  }

  useLayoutEffect(() => {
    // Get initial theme from html attribute (set by script in layout)
    const htmlTheme = document.documentElement.getAttribute("data-theme")
    const isHtmlDarkTheme = htmlTheme === "dark"
    _setMode(isHtmlDarkTheme)
  }, [])

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (event: MediaQueryListEvent) => {
      // Only auto-switch if no explicit preference is stored
      if (!localStorage.getItem("mode")) {
        setMode(event.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}