// src/components/FilterBar.tsx
import React from 'react'
import { Search, X } from 'lucide-react'
import type { Category, Filters, Status } from '../types'

interface FilterBarProps {
  filters: Filters
  onChange: (f: Filters) => void
}

const CATEGORY_CHIPS: { id: Category; label: string; emoji: string }[] = [
  { id: 'book', label: 'Libros', emoji: '📖' },
  { id: 'movie', label: 'Cine', emoji: '🎬' },
  { id: 'art', label: 'Arte', emoji: '🎨' },
  { id: 'history', label: 'Historia', emoji: '🏛️' },
]

const STATUS_OPTIONS: { id: Status | 'all'; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'seen', label: 'Vistos' },
  { id: 'pending', label: 'Pendientes' },
]

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, query: e.target.value })
  }

  const handleClearQuery = () => {
    onChange({ ...filters, query: '' })
  }

  const handleToggleCategory = (cat: Category) => {
    const isSelected = filters.categories.includes(cat)
    const nextCategories = isSelected
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat]

    onChange({ ...filters, categories: nextCategories })
  }

  const handleStatusChange = (status: Status | 'all') => {
    onChange({ ...filters, status })
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap w-full justify-center">
      {/* Buscador de texto */}
      <div className="relative flex items-center min-w-[140px] sm:w-48 md:w-56 flex-1 sm:flex-initial">
        <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
        <input
          type="text"
          value={filters.query}
          onChange={handleQueryChange}
          placeholder="Buscar..."
          className="w-full text-xs bg-neutral-100/80 dark:bg-neutral-800/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 rounded-lg pl-8 pr-7 py-1.5 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all"
        />
        {filters.query && (
          <button
            type="button"
            onClick={handleClearQuery}
            aria-label="Limpiar búsqueda"
            className="absolute right-2 p-0.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-full cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="hidden sm:block h-4 w-px bg-neutral-200 dark:bg-neutral-800 shrink-0" />

      {/* Chips de Categorías (Multi-selección) */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
        {CATEGORY_CHIPS.map((chip) => {
          const isSelected = filters.categories.includes(chip.id)
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => handleToggleCategory(chip.id)}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer border select-none ${
                isSelected
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-2xs'
                  : 'bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <span>{chip.emoji}</span>
              <span className="hidden md:inline">{chip.label}</span>
            </button>
          )
        })}
      </div>

      <div className="hidden sm:block h-4 w-px bg-neutral-200 dark:bg-neutral-800 shrink-0" />

      {/* Selector Visto / Pendiente / Todos (Segmented control) */}
      <div className="inline-flex items-center p-0.5 rounded-lg bg-neutral-100/80 dark:bg-neutral-800/80 border border-neutral-200/50 dark:border-neutral-700/50 shrink-0">
        {STATUS_OPTIONS.map((opt) => {
          const isSelected = filters.status === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleStatusChange(opt.id)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}