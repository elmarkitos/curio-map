// src/components/MarkerDetailCard.tsx
import React, { useState } from 'react'
import type { Category, Marker, Status } from '../types'

interface MarkerDetailCardProps {
  marker: Marker | null
  onClose: () => void
  onNotesChange: (id: string, notes: string) => void
  onStatusChange: (id: string, status: Status) => void
  onDelete: (id: string) => void
}

const CATEGORY_META: Record<
  Category,
  { label: string; emoji: string; gradient: string; tagBg: string; textCol: string }
> = {
  book: {
    label: 'Libro',
    emoji: '📖',
    gradient: 'from-emerald-500/25 via-emerald-600/10 to-transparent',
    tagBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    textCol: 'text-emerald-700 dark:text-emerald-300',
  },
  movie: {
    label: 'Película',
    emoji: '🎬',
    gradient: 'from-rose-500/25 via-rose-600/10 to-transparent',
    tagBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
    textCol: 'text-rose-700 dark:text-rose-300',
  },
  art: {
    label: 'Arte',
    emoji: '🎨',
    gradient: 'from-violet-500/25 via-violet-600/10 to-transparent',
    tagBg: 'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800',
    textCol: 'text-violet-700 dark:text-violet-300',
  },
  history: {
    label: 'Historia',
    emoji: '🏛️',
    gradient: 'from-amber-500/25 via-amber-600/10 to-transparent',
    tagBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    textCol: 'text-amber-700 dark:text-amber-300',
  },
}

export const MarkerDetailCard: React.FC<MarkerDetailCardProps> = ({
  marker,
  onClose,
  onNotesChange,
  onStatusChange,
  onDelete,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  if (!marker) return null

  const meta = CATEGORY_META[marker.category] ?? {
    label: marker.category,
    emoji: '📍',
    gradient: 'from-neutral-500/25 via-neutral-600/10 to-transparent',
    tagBg: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700',
    textCol: 'text-neutral-700 dark:text-neutral-300',
  }

  const isSeen = marker.status === 'seen'

  const handleToggleStatus = () => {
    onStatusChange(marker.id, isSeen ? 'pending' : 'seen')
  }

  const handleDeleteClick = () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true)
      return
    }
    onDelete(marker.id)
    setShowConfirmDelete(false)
  }

  return (
    <>
      {/* Fondo oscuro para móvil/backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-neutral-950/30 backdrop-blur-xs z-40 md:hidden transition-opacity"
      />

      {/* Panel contenedor: Bottom Sheet en móvil, Sidebar deslizante desde la derecha en Desktop */}
      <aside className="fixed bottom-0 inset-x-0 max-h-[85vh] md:max-h-none md:inset-y-0 md:right-0 md:left-auto md:w-[420px] z-50 flex flex-col bg-white dark:bg-neutral-900 shadow-2xl border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 rounded-t-2xl md:rounded-none animate-in slide-in-from-bottom md:slide-in-from-right duration-300 ease-out transition-transform overflow-hidden">
        {/* Cabecera visual (Imagen o Degradado de relleno) */}
        <div className="relative h-48 sm:h-52 w-full shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-950">
          {marker.imageUrl ? (
            <img
              src={marker.imageUrl}
              alt={marker.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-linear-to-b ${meta.gradient} flex flex-col items-center justify-center`}
            >
              <span className="text-6xl drop-shadow-sm select-none">{meta.emoji}</span>
            </div>
          )}

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            aria-label="Cerrar detalle"
            className="absolute top-3.5 right-3.5 h-8 w-8 rounded-full bg-neutral-900/60 dark:bg-black/60 text-white hover:bg-neutral-900/80 transition-all flex items-center justify-center backdrop-blur-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-white"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Indicador de tirador para Bottom Sheet (móvil) */}
          <div className="absolute top-2 inset-x-0 flex justify-center md:hidden pointer-events-none">
            <div className="h-1.5 w-10 bg-neutral-300/80 dark:bg-neutral-600/80 rounded-full" />
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-neutral-800 dark:text-neutral-200">
          {/* Etiquetas superiores */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${meta.tagBg} ${meta.textCol}`}
            >
              <span>{meta.emoji}</span>
              <span>{meta.label}</span>
            </span>

            {marker.year && (
              <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/80 dark:border-neutral-700/80">
                {marker.year}
              </span>
            )}

            {marker.rating !== undefined && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 font-medium ml-auto">
                ★ {marker.rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Título y Ubicación */}
          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 leading-snug">
              {marker.title}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{marker.locationName}</span>
            </div>
          </div>

          {/* Resumen */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Resumen
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {marker.summary || 'Sin descripción disponible.'}
            </p>
          </div>

          {/* Notas editables (Notion style) */}
          <div className="space-y-1.5">
            <label
              htmlFor="marker-notes-input"
              className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block"
            >
              Mis Notas
            </label>
            <textarea
              id="marker-notes-input"
              rows={4}
              value={marker.notes}
              onChange={(e) => onNotesChange(marker.id, e.target.value)}
              placeholder="Escribe tus notas, reflexiones o pendientes aquí..."
              className="w-full text-sm bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 rounded-lg p-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all resize-y"
            />
          </div>
        </div>

        {/* Acciones del pie */}
        <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between gap-3">
          {/* Botón Alternar Estado */}
          <button
            type="button"
            onClick={handleToggleStatus}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isSeen
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent shadow-xs'
                : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/60'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isSeen ? 'bg-emerald-400 dark:bg-emerald-600' : 'bg-amber-400'
              }`}
            />
            {isSeen ? 'Completado' : 'Pendiente'}
          </button>

          {/* Botón Eliminar con confirmación contextual */}
          {showConfirmDelete ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDeleteClick}
                className="py-2 px-3 rounded-lg text-xs font-medium bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
              >
                ¿Confirmar?
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="py-2 px-2.5 rounded-lg text-xs border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 cursor-pointer"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="py-2 px-3 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition-colors cursor-pointer"
            >
              Eliminar
            </button>
          )}
        </div>
      </aside>
    </>
  )
}