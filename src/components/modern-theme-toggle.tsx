'use client'

import { useOptimistic, startTransition, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createElement } from 'react'
import { BsFillBrightnessHighFill, BsFillMoonFill } from 'react-icons/bs'
import { toggleTheme, type Theme } from '@/app/actions/theme'
import styles from '@/styles/navigation.module.scss'

interface ThemeState {
  theme: Theme
  success: boolean
  error: string | null
}

interface ThemeToggleButtonProps {
  currentTheme: Theme
}

function ThemeToggleButton({ currentTheme }: ThemeToggleButtonProps) {
  const { pending } = useFormStatus()
  const isDark = currentTheme === 'dark'
  const icon = isDark ? BsFillBrightnessHighFill : BsFillMoonFill
  
  return (
    <button
      type="submit"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={styles.button}
      data-nopico
      disabled={pending}
      style={{ 
        opacity: pending ? 0.7 : 1,
        cursor: pending ? 'wait' : 'pointer'
      }}
    >
      {createElement(icon)}
    </button>
  )
}

export function ModernThemeToggle({ initialTheme }: { initialTheme: Theme }) {
  // Form state with server action
  const [state, formAction] = useActionState(toggleTheme, {
    theme: initialTheme,
    success: true,
    error: null,
  })

  // Optimistic updates for instant visual feedback
  const [optimisticTheme, setOptimisticTheme] = useOptimistic(
    state.theme as Theme,
    (currentTheme: Theme) => currentTheme === 'dark' ? 'light' : 'dark'
  )

  // Handle form submission with optimistic updates
  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      // Optimistically update the theme for instant feedback
      setOptimisticTheme(state.theme)
      
      // Apply theme immediately to body for instant visual change
      const newTheme = state.theme === 'dark' ? 'light' : 'dark'
      document.body.setAttribute('data-theme', newTheme)
      
      // Update localStorage for consistency
      localStorage.setItem('mode', newTheme)
      
      // Submit to server action
      formAction(formData)
    })
  }

  return (
    <form action={handleSubmit}>
      <ThemeToggleButton currentTheme={optimisticTheme} />
      {state.error && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          right: 0, 
          color: 'var(--del-color)', 
          fontSize: '0.8rem',
          whiteSpace: 'nowrap'
        }}>
          {state.error}
        </div>
      )}
    </form>
  )
}