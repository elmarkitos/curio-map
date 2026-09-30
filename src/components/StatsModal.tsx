// src/components/StatsModal.tsx
import React, { useEffect, useMemo } from 'react'
import { X, Award, MapPin, CheckCircle2, Clock } from 'lucide-react'
import type { Category, Marker } from '../types'

interface StatsModalProps {
  isOpen: boolean
  onClose: () => void
  markers: Marker[]
}

const CATEGORY_CONFIG: Record<
  Category,
  { label: string; emoji: string; color: string; barBg: string }
> = {
  book: { label: 'Libros', emoji: '📖', color: 'text-emerald-500', barBg: 'bg-emerald-500' },
  movie: { label: 'Películas', emoji: '🎬', color: 'text-rose-500', barBg: 'bg-rose-500' },
  art: { label: 'Arte', emoji: '🎨', color: 'text-violet-500', barBg: 'bg-violet-500' },
  history: { label: 'Historia', emoji: '🏛️', color: 'text-amber-500', barBg: 'bg-amber-500' },
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, markers }) => {
  // Cerrar con tecla Escape
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const stats = useMemo(() => {
    const total = markers.length

    // Conteo por categoría
    const categories: Record<Category, number> = {
      book: 0,
      movie: 0,
      art: 0,
      history: 0,
    }

    let seenCount = 0
    let pendingCount = 0
    let ratingSum = 0
    let ratedCount = 0
    const countriesSet = new Set<string>()

    markers.forEach((m) => {
      // Categorías
      if (categories[m.category] !== undefined) {
        categories[m.category]++
      }

      // Estado
      if (m.status === 'seen') {
        seenCount++
      } else {
        pendingCount++
      }

      // Rating
      if (typeof m.rating === 'number' && !Number.isNaN(m.rating)) {
        ratingSum += m.rating
        ratedCount++
      }

      // País (último fragmento tras la última coma)
      if (m.locationName) {
        const parts = m.locationName.split(',')
        const country = parts[parts.length - 1]?.trim()
        if (country) {
          countriesSet.add(country.toLowerCase())
        }
      }
    })

    const avgRating = ratedCount > 0 ? (ratingSum / ratedCount).toFixed(1) : null
    const uniqueCountries = countriesSet.size

    return {
      total,
      categories,
      seenCount,
      pendingCount,
      avgRating,
      uniqueCountries,
    }
  }, [markers])

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 text-neutral-900 dark:text-neutral-100 animate-in zoom-in-95 duration-200"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Estadísticas</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Resumen de tu colección cultural
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar estadísticas"
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tarjetas de métricas principales */}
        <div className="grid grid-cols-3 gap-2.5 my-5">
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/60 dark:border-neutral-800 flex flex-col items-center text-center">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Total</span>
            <span className="text-xl font-bold mt-0.5">{stats.total}</span>
          </div>

          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/60 dark:border-neutral-800 flex flex-col items-center text-center">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-500" /> Nota
            </span>
            <span className="text-xl font-bold mt-0.5">
              {stats.avgRating !== null ? stats.avgRating : '—'}
            </span>
          </div>

          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/60 dark:border-neutral-800 flex flex-col items-center text-center">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-neutral-400" /> Países
            </span>
            <span className="text-xl font-bold mt-0.5">{stats.uniqueCountries}</span>
          </div>
        </div>

        {/* Progreso por Categoría */}
        <div className="space-y-3 pt-1 pb-4">
          <h3 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Por Categoría
          </h3>
          <div className="space-y-2.5">
            {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => {
              const cfg = CATEGORY_CONFIG[cat]
              const count = stats.categories[cat]
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span>{cfg.emoji}</span>
                      <span>{cfg.label}</span>
                    </span>
                    <span className="text-neutral-500 font-mono">
                      {count} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${cfg.barBg}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Vistos frente a Pendientes */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-around text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-neutral-600 dark:text-neutral-400">Vistos:</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {stats.seenCount}
            </span>
          </div>

          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-neutral-600 dark:text-neutral-400">Pendientes:</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {stats.pendingCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}