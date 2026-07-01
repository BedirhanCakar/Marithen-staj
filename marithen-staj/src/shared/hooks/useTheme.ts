import { useEffect, useState } from 'react'
import { getThemeFromStorage, setThemeToStorage, type Theme } from '../lib/utils/theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Avoid SSR hydration issues by checking for window first
    if (typeof window !== 'undefined') {
      return getThemeFromStorage()
    }
    return 'dark'
  })

  useEffect(() => {
    // Initialize theme on client side mount
    setTheme(getThemeFromStorage())
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    setThemeToStorage(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return { theme, toggleTheme }
}
