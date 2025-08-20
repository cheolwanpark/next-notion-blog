'use client'

import { useCallback, useEffect, useState } from 'react'
import { BsFillBrightnessHighFill, BsFillMoonFill } from 'react-icons/bs'
import styles from '@/styles/navigation.module.scss'

export type Theme = 'light' | 'dark'

interface SimpleThemeToggleProps {
  className?: string
}

/**
 * Simple, fast theme toggle with instant feedback
 * No server actions, no forms, no delays - just instant theme switching
 */
export function SimpleThemeToggle({ className }: SimpleThemeToggleProps) {
  const [theme, setTheme] = useState<Theme | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Get initial theme from DOM on mount
  useEffect(() => {
    const htmlTheme = document.documentElement.getAttribute('data-theme') as Theme
    setTheme(htmlTheme || 'light')
  }, [])

  const toggleTheme = useCallback(() => {
    if (isTransitioning) return // Prevent spam clicking

    setIsTransitioning(true)
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    
    // Update state immediately
    setTheme(newTheme)
    
    // Apply theme to DOM immediately
    document.documentElement.setAttribute('data-theme', newTheme)
    
    // Store in localStorage for persistence
    localStorage.setItem('mode', newTheme)
    
    // Reset transition flag after a brief delay
    setTimeout(() => setIsTransitioning(false), 200)
  }, [theme, isTransitioning])

  // Handle keyboard interaction
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleTheme()
    }
  }, [toggleTheme])

  if (theme === null) {
    // Render nothing during hydration to prevent mismatch
    return null
  }

  const isDark = theme === 'dark'
  const Icon = isDark ? BsFillBrightnessHighFill : BsFillMoonFill

  return (
    <button
      type="button"
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`${styles.button} ${className || ''}`.trim()}
      data-nopico
      style={{ 
        opacity: isTransitioning ? 0.8 : 1,
        transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        cursor: 'pointer'
      }}
    >
      <Icon />
    </button>
  )
}