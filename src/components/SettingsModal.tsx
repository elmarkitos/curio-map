import React, { useEffect, useState } from 'react'
import { X, Sun, Moon, Laptop } from 'lucide-react'

export type Theme = 'light' | 'dark' | 'system'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

const THEME_STORAGE_KEY = 'curiomap_theme'

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved
  }
  return 'system'
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = theme === 'dark' || (theme === 'system' && systemPrefersDark)

  root.classList.toggle('dark', isDark)
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)

    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme('system')

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const themeOptions: { id: Theme; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Claro', icon: <Sun className="w-4 h-4" /> },
    { id: 'dark', label: 'Oscuro', icon: <Moon className="w-4 h-4" /> },
    { id: 'system', label: 'Sistema', icon: <Laptop className="w-4 h-4" /> },
  ]

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 text-neutral-900 dark:text-neutral-100 animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 id="settings-modal-title" className="text-lg font-semibold tracking-tight">
              Ajustes
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Personaliza tu experiencia en CurioMap
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ajustes"
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-3">
          <label className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            Apariencia
          </label>

          <div className="grid grid-cols-3 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800/70 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60">
            {themeOptions.map((option) => {
              const isSelected = theme === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTheme(option.id)}
                  aria-pressed={isSelected}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  <span className="mb-1.5">{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-xs text-neutral-400 dark:text-neutral-500">
          <span>CurioMap v0.1.0</span>
          <span>Open Source</span>
        </div>
      </div>
    </div>
  )
}