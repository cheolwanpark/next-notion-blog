'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export type Theme = 'light' | 'dark'

/**
 * Server Action to toggle theme between light and dark mode
 * Uses cookies for SSR compatibility and persistent storage
 */
export async function toggleTheme(prevState: any, formData: FormData) {
  try {
    const cookieStore = await cookies()
    const currentTheme = cookieStore.get('theme')?.value as Theme || 'light'
    const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark'
    
    // Set cookie with 1 year expiration
    cookieStore.set('theme', newTheme, {
      path: '/',
      maxAge: 31536000, // 1 year
      httpOnly: false, // Allow client-side access for instant feedback
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    
    // Revalidate all pages to update the theme
    revalidatePath('/', 'layout')
    
    return {
      theme: newTheme,
      success: true,
      error: null,
    }
  } catch (error) {
    console.error('Theme toggle error:', error)
    return {
      theme: 'light',
      success: false,
      error: 'Failed to toggle theme',
    }
  }
}

/**
 * Server Action to set specific theme
 */
export async function setTheme(theme: Theme) {
  try {
    const cookieStore = await cookies()
    
    cookieStore.set('theme', theme, {
      path: '/',
      maxAge: 31536000, // 1 year
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    
    revalidatePath('/', 'layout')
    
    return {
      theme,
      success: true,
      error: null,
    }
  } catch (error) {
    console.error('Set theme error:', error)
    return {
      theme: 'light',
      success: false,
      error: 'Failed to set theme',
    }
  }
}

/**
 * Get current theme from cookies
 */
export async function getCurrentTheme(): Promise<Theme> {
  try {
    const cookieStore = await cookies()
    return (cookieStore.get('theme')?.value as Theme) || 'light'
  } catch (error) {
    console.error('Get theme error:', error)
    return 'light'
  }
}