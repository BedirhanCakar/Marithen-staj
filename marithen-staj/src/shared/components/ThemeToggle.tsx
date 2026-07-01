'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting until component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-slate-800/20 dark:bg-slate-800/40 border border-slate-200/30 dark:border-slate-700/30 animate-pulse" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 shadow-sm cursor-pointer transition-all duration-300 hover:scale-[1.05]"
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5">
        <span className={`absolute inset-0 transform transition-all duration-300 ${
          theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
        }`}>
          <Sun className="w-5 h-5 text-amber-500 fill-amber-500/20" />
        </span>
        <span className={`absolute inset-0 transform transition-all duration-300 ${
          theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        }`}>
          <Moon className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
        </span>
      </div>
    </button>
  )
}
