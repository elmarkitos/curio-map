// src/components/MapView.tsx
import React, { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker as LeafletMarker, ZoomControl, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Category, Marker } from '../types'

interface MapViewProps {
  markers: Marker[]
  selectedId: string | null
  onMarkerClick: (id: string) => void
}

const CATEGORY_STYLES: Record<Category, { emoji: string; bg: string; ring: string }> = {
  book: { emoji: '📖', bg: 'bg-emerald-500', ring: 'ring-emerald-400' },
  movie: { emoji: '🎬', bg: 'bg-rose-500', ring: 'ring-rose-400' },
  art: { emoji: '🎨', bg: 'bg-violet-500', ring: 'ring-violet-400' },
  history: { emoji: '🏛️', bg: 'bg-amber-500', ring: 'ring-amber-400' },
}

function createCategoryIcon(category: Category, isSelected: boolean): L.DivIcon {
  const meta = CATEGORY_STYLES[category] ?? {
    emoji: '📍',
    bg: 'bg-neutral-800',
    ring: 'ring-neutral-400',
  }

  const size = isSelected ? 46 : 34
  const sizeClasses = isSelected
    ? 'w-[46px] h-[46px] text-lg ring-4 ring-offset-2 ring-neutral-900/60 dark:ring-white/80 shadow-2xl scale-110 z-50'
    : 'w-[34px] h-[34px] text-sm shadow-md hover:scale-110 ring-2 ring-white dark:ring-neutral-900'

  const html = `
    <div class="flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${meta.bg} text-white ${sizeClasses} select-none border border-white/20">
      <span class="leading-none pointer-events-none">${meta.emoji}</span>
    </div>
  `

  return L.divIcon({
    html,
    className: '!bg-transparent !border-0',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

interface CameraControllerProps {
  selectedLocation: { lat: number; lng: number } | null
}

const CameraController: React.FC<CameraControllerProps> = ({ selectedLocation }) => {
  const map = useMap()

  useEffect(() => {
    if (!selectedLocation) return

    map.flyTo([selectedLocation.lat, selectedLocation.lng], Math.max(map.getZoom(), 13), {
      duration: 1.2,
      easeLinearity: 0.25,
    })
  }, [selectedLocation, map])

  return null
}

export const MapView: React.FC<MapViewProps> = ({ markers, selectedId, onMarkerClick }) => {
  const selectedMarker = useMemo(
    () => markers.find((m) => m.id === selectedId) ?? null,
    [markers, selectedId]
  )

  const defaultCenter: [number, number] = useMemo(() => {
    if (selectedMarker) return [selectedMarker.lat, selectedMarker.lng]
    if (markers.length > 0) return [markers[0].lat, markers[0].lng]
    return [40.4168, -3.7038]
  }, [markers, selectedMarker])

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
      <MapContainer
        center={defaultCenter}
        zoom={markers.length > 0 ? 4 : 3}
        zoomControl={false}
        scrollWheelZoom={true}
        className="w-full h-full z-0 dark:[&_.leaflet-tile]:brightness-[0.72] dark:[&_.leaflet-tile]:invert dark:[&_.leaflet-tile]:hue-rotate-180 dark:[&_.leaflet-tile]:contrast-[1.2]"
      >
        <ZoomControl position="bottomleft" />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CameraController
          selectedLocation={
            selectedMarker ? { lat: selectedMarker.lat, lng: selectedMarker.lng } : null
          }
        />

        {markers.map((marker) => {
          const isSelected = marker.id === selectedId
          const icon = createCategoryIcon(marker.category, isSelected)

          return (
            <LeafletMarker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={icon}
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={{
                click: () => onMarkerClick(marker.id),
              }}
            />
          )
        })}
      </MapContainer>
    </div>
  )
}