'use client'

export function getSettingsKey() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user?.id ? `userSettings_${user.id}` : 'userSettings'
  } catch {
    return 'userSettings'
  }
}

export function getTheme() {
  try {
    const saved = localStorage.getItem(getSettingsKey())
    const theme = saved ? JSON.parse(saved)?.appearance?.theme : 'light'
    if (theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme || 'light'
  } catch {
    return 'light'
  }
}
