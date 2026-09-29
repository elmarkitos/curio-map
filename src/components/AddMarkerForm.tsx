// src/components/AddMarkerForm.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import type { Category, NewMarkerInput, Status } from '../types'

interface AddMarkerFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: NewMarkerInput) => void
}

interface FormState {
  title: string
  category: Category
  locationName: string
  lat: string
  lng: string
  year: string
  notes: string
  status: Status
}

interface FormErrors {
  title?: string
  lat?: string
  lng?: string
}

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'book', label: 'Libro', emoji: '📖' },
  { id: 'movie', label: 'Película', emoji: '🎬' },
  { id: 'art', label: 'Arte', emoji: '🎨' },
  { id: 'history', label: 'Historia', emoji: '🏛️' },
]

const INITIAL_FORM_STATE: FormState = {
  title: '',
  category: 'book',
  locationName: '',
  lat: '',
  lng: '',
  year: '',
  notes: '',
  status: 'pending',
}

export const AddMarkerForm: React.FC<AddMarkerFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE)
  const [errors, setErrors] = useState<FormErrors>({})

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM_STATE)
    setErrors({})
  }, [])

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [onClose, resetForm])

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  if (!isOpen) return null

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!form.title.trim()) {
      newErrors.title = 'El título es obligatorio'
    }

    const latNum = parseFloat(form.lat)
    if (form.lat.trim() === '' || Number.isNaN(latNum)) {
      newErrors.lat = 'La latitud es obligatoria'
    } else if (latNum < -90 || latNum > 90) {
      newErrors.lat = 'Debe estar entre -90 y 90'
    }

    const lngNum = parseFloat(form.lng)
    if (form.lng.trim() === '' || Number.isNaN(lngNum)) {
      newErrors.lng = 'La longitud es obligatoria'
    } else if (lngNum < -180 || lngNum > 180) {
      newErrors.lng = 'Debe estar entre -180 y 180'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    const newMarker: NewMarkerInput = {
      title: form.title.trim(),
      category: form.category,
      locationName: form.locationName.trim(),
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
      summary: '', // Pendiente de rellenar por IA más adelante
      year: form.year.trim() || undefined,
      notes: form.notes.trim(),
      status: form.status,
    }

    onSubmit(newMarker)
    resetForm()
    onClose()
  }

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-7 text-neutral-900 dark:text-neutral-100 animate-in zoom-in-95 duration-200"
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Añadir lugar cultural</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Registra un punto de interés en tu mapa personal.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar modal"
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Título */}
          <div>
            <label
              htmlFor="marker-title"
              className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider mb-1.5"
            >
              Título <span className="text-rose-500">*</span>
            </label>
            <input
              id="marker-title"
              type="text"
              placeholder="Ej. Cien años de soledad"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`w-full px-3 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border ${
                errors.title
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-neutral-200 dark:border-neutral-700/80 focus:ring-neutral-900 dark:focus:ring-white'
              } text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-2 transition-all`}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Categoría (Selector visual) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              Categoría
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = form.category === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat.id })}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-700/80 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600'
                    }`}
                  >
                    <span className="text-xl mb-1">{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Ubicación y Año */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label
                htmlFor="marker-location"
                className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider mb-1.5"
              >
                Ubicación
              </label>
              <input
                id="marker-location"
                type="text"
                placeholder="Ej. Aracataca, Colombia"
                value={form.locationName}
                onChange={(e) => setForm({ ...form, locationName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="marker-year"
                className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider mb-1.5"
              >
                Año
              </label>
              <input
                id="marker-year"
                type="text"
                placeholder="Ej. 1967"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
              />
            </div>
          </div>

          {/* Coordenadas (Lat / Lng) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="marker-lat"
                className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider mb-1.5"
              >
                Latitud (-90 a 90) <span className="text-rose-500">*</span>
              </label>
              <input
                id="marker-lat"
                type="number"
                step="any"
                placeholder="10.4880"
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
                className={`w-full px-3 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border ${
                  errors.lat
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-neutral-200 dark:border-neutral-700/80 focus:ring-neutral-900 dark:focus:ring-white'
                } text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-2 transition-all`}
              />
              {errors.lat && (
                <p className="text-xs text-rose-500 mt-1">{errors.lat}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="marker-lng"
                className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider mb-1.5"
              >
                Longitud (-180 a 180) <span className="text-rose-500">*</span>
              </label>
              <input
                id="marker-lng"
                type="number"
                step="any"
                placeholder="-74.1950"
                value={form.lng}
                onChange={(e) => setForm({ ...form, lng: e.target.value })}
                className={`w-full px-3 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border ${
                  errors.lng
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-neutral-200 dark:border-neutral-700/80 focus:ring-neutral-900 dark:focus:ring-white'
                } text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-2 transition-all`}
              />
              {errors.lng && (
                <p className="text-xs text-rose-500 mt-1">{errors.lng}</p>
              )}
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              Estado inicial
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, status: 'pending' })}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  form.status === 'pending'
                    ? 'border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-700/80 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Pendiente
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, status: 'seen' })}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  form.status === 'seen'
                    ? 'border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-700/80 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Completado / Visto
              </button>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label
              htmlFor="marker-notes"
              className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider mb-1.5"
            >
              Notas
            </label>
            <textarea
              id="marker-notes"
              rows={3}
              placeholder="Detalles sobre por qué es relevante, pasajes que recordar..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all resize-none"
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs cursor-pointer"
            >
              Guardar lugar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}