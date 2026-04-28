import { useEffect, useState } from 'react'
import styles from './ThemeToggle.module.css'

const STORAGE_KEY = 'ds-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0-5a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm0 17a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zM4.22 4.22a1 1 0 011.42 0l1.41 1.42a1 1 0 11-1.41 1.41L4.22 5.64a1 1 0 010-1.42zm12.73 12.73a1 1 0 011.41 0l1.42 1.41a1 1 0 11-1.42 1.42l-1.41-1.42a1 1 0 010-1.41zM2 12a1 1 0 011-1h2a1 1 0 110 2H3a1 1 0 01-1-1zm17 0a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zM4.22 19.78a1 1 0 010-1.42l1.42-1.41a1 1 0 111.41 1.41l-1.41 1.42a1 1 0 01-1.42 0zm12.73-12.73a1 1 0 010-1.41l1.41-1.42a1 1 0 111.42 1.42l-1.42 1.41a1 1 0 01-1.41 0z"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.64 13a1 1 0 00-1.05-.14 8 8 0 01-3.37.73 8.15 8.15 0 01-8.14-8.1 8.59 8.59 0 01.25-2A1 1 0 008 2.36 10.14 10.14 0 1022 14.05a1 1 0 00-.36-1.05z"/>
    </svg>
  )
}

export function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className={styles.icon}>{isDark ? <SunIcon /> : <MoonIcon />}</span>
      <span className={styles.label}>{isDark ? 'Light mode' : 'Dark mode'}</span>
    </button>
  )
}
