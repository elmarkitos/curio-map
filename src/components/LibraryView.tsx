// src/components/LibraryView.tsx
import React from 'react'
import type { Category, Marker } from '../types'

interface LibraryViewProps {
  markers: Marker[]
  selectedId: string | null
  onSelect: (id: string) => void
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

export const LibraryView: React.FC<LibraryViewProps> = ({
  markers,
  selectedId,
  onSelect,
}) => {
  if (markers.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-neutral-50 dark:bg-neutral-950">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-3xl shadow-xs mb-4">
          🗺️
        </div>
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
          No hay lugares que coincidan
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm leading-relaxed">
          Prueba a cambiar los filtros de búsqueda o añade un nuevo lugar cultural a tu biblioteca.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-neutral-50 dark:bg-neutral-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pb-20 md:pb-8">
        {markers.map((marker) => {
          const isSelected = marker.id === selectedId
          const meta = CATEGORY_META[marker.category] ?? {
            label: marker.category,
            emoji: '📍',
            gradient: 'from-neutral-500/25 via-neutral-600/10 to-transparent',
            tagBg: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700',
            textCol: 'text-neutral-700 dark:text-neutral-300',
          }
          const isSeen = marker.status === 'seen'

          return (
            <article
              key={marker.id}
              onClick={() => onSelect(marker.id)}
              className={`group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
                isSelected
                  ? 'border-neutral-900 dark:border-white ring-2 ring-neutral-900/10 dark:ring-white/20'
                  : 'border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              {/* Contenedor Visual (Imagen o Degradado con emoji) */}
              <div className="relative h-40 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950 shrink-0">
                {marker.imageUrl ? (
                  <img
                    src={marker.imageUrl}
                    alt={marker.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-linear-to-b ${meta.gradient} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                  >
                    <span className="text-5xl select-none drop-shadow-xs">{meta.emoji}</span>
                  </div>
                )}

                {/* Badge de Categoría */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border backdrop-blur-md shadow-2xs ${meta.tagBg} ${meta.textCol}`}
                  >
                    <span>{meta.emoji}</span>
                    <span>{meta.label}</span>
                  </span>
                </div>

                {/* Badge de Estado visto/pendiente */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border backdrop-blur-md shadow-2xs ${
                      isSeen
                        ? 'bg-white/90 dark:bg-neutral-900/90 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/80'
                        : 'bg-white/90 dark:bg-neutral-900/90 text-amber-700 dark:text-amber-400 border-amber-200/80 dark:border-amber-800/80'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSeen ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                    />
                    <span>{isSeen ? 'Visto' : 'Pendiente'}</span>
                  </span>
                </div>
              </div>

              {/* Contenido textual */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight leading-snug line-clamp-1 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                      {marker.title}
                    </h4>
                    {marker.year && (
                      <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 shrink-0">
                        {marker.year}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{marker.locationName}</span>
                  </div>
                </div>

                {marker.summary && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {marker.summary}
                  </p>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}