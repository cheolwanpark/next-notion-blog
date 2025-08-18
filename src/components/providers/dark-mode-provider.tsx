'use client'

import { createContext, useContext, useEffect, useState } from 'react'

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
    document.body.setAttribute("data-theme", theme)
    document.cookie = `theme=${theme}; path=/; max-age=31536000` // 1 year
    localStorage.setItem("mode", theme)
  }

  useEffect(() => {
    // Get initial theme from body attribute (set by script in layout)
    const bodyTheme = document.body.getAttribute("data-theme")
    const isBodyDarkTheme = bodyTheme !== null && bodyTheme === "dark"
    _setMode(isBodyDarkTheme)

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