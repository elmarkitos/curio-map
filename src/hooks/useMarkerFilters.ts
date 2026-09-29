// src/hooks/useMarkerFilters.ts
import { useMemo } from 'react'
import type { Filters, Marker } from '../types'

function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function useMarkerFilters(markers: Marker[], filters: Filters): Marker[] {
  return useMemo(() => {
    const queryNormalized = normalizeString(filters.query.trim())
    const hasCategoryFilter = filters.categories.length > 0
    const hasStatusFilter = filters.status !== 'all'

    return markers.filter((marker) => {
      // 1. Filtro por Estado
      if (hasStatusFilter && marker.status !== filters.status) {
        return false
      }

      // 2. Filtro por Categorías (vacío = todas)
      if (hasCategoryFilter && !filters.categories.includes(marker.category)) {
        return false
      }

      // 3. Filtro por Texto (título y ubicación, insensibles a mayúsculas y tildes)
      if (queryNormalized) {
        const titleNormalized = normalizeString(marker.title)
        const locationNormalized = normalizeString(marker.locationName)

        const matchesTitle = titleNormalized.includes(queryNormalized)
        const matchesLocation = locationNormalized.includes(queryNormalized)

        if (!matchesTitle && !matchesLocation) {
          return false
        }
      }

      return true
    })
  }, [markers, filters])
}