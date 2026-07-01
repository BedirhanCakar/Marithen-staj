export type Theme = 'light' | 'dark'

const THEME_KEY = 'theme'

export function getThemeFromStorage(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') {
    return saved
  }
  return 'dark'
}

export function setThemeToStorage(theme: Theme): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_KEY, theme)
  }
}
