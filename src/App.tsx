// src/App.tsx
import React, { useState } from 'react'
import { MapView } from './components/MapView'
import { MarkerDetailCard } from './components/MarkerDetailCard'
import { Header } from './components/Header'
import { FilterBar } from './components/FilterBar'
import { AddMarkerForm } from './components/AddMarkerForm'
import { useMarkerFilters } from './hooks/useMarkerFilters'
import type { Filters, Marker, NewMarkerInput, Status } from './types'

const INITIAL_MARKERS: Marker[] = [
  {
    id: '1',
    title: 'Cien años de soledad',
    category: 'book',
    lat: 10.488,
    lng: -74.195,
    locationName: 'Aracataca, Colombia',
    summary: 'El pueblo natal de Gabriel García Márquez que inspiró Macondo.',
    year: '1967',
    rating: 4.9,
    notes: 'Releer el capítulo de la peste del insomnio.',
    status: 'seen',
  },
  {
    id: '2',
    title: 'Blade Runner',
    category: 'movie',
    lat: 34.0505,
    lng: -118.2479,
    locationName: 'Los Ángeles, EE. UU.',
    summary: 'El Bradbury Building sirvió de escenario para el clímax de la película.',
    year: '1982',
    rating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    notes: 'Visitar el interior durante el día para ver los tragaluces.',
    status: 'pending',
  },
  {
    id: '3',
    title: 'Guernica',
    category: 'art',
    lat: 40.4079,
    lng: -3.6946,
    locationName: 'Madrid, España',
    summary: 'Expuesto de forma permanente en el Museo Nacional Centro de Arte Reina Sofía.',
    year: '1937',
    rating: 4.7,
    notes: 'Comprar entrada con antelación.',
    status: 'seen',
  },
  {
    id: '4',
    title: 'Caída de Constantinopla',
    category: 'history',
    lat: 41.0082,
    lng: 28.9784,
    locationName: 'Estambul, Turquía',
    summary: 'Punto de inflexión que marca el fin de la Edad Media en las murallas teodosianas.',
    year: '1453',
    rating: 4.5,
    notes: 'Caminar por el tramo de muralla restaurado junto a Edirnekapı.',
    status: 'pending',
  },
]

export default function App(): React.JSX.Element {
  const [markers, setMarkers] = useState<Marker[]>(INITIAL_MARKERS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false)
  const [filters, setFilters] = useState<Filters>({
    query: '',
    categories: [],
    status: 'all',
  })

  // Marcadores pasados por el hook de filtrado (búsqueda, categoría y estado)
  const filteredMarkers = useMarkerFilters(markers, filters)

  // Marcador seleccionado actualmente (si existe)
  const selectedMarker = markers.find((m) => m.id === selectedId) ?? null

  const handleAddMarker = (input: NewMarkerInput): void => {
    const newMarker: Marker = {
      ...input,
      id: crypto.randomUUID(),
    }
    setMarkers((prev) => [...prev, newMarker])
    setSelectedId(newMarker.id)
  }

  const handleDeleteMarker = (id: string): void => {
    setMarkers((prev) => prev.filter((m) => m.id !== id))
    if (selectedId === id) {
      setSelectedId(null)
    }
  }

  const handleNotesChange = (id: string, notes: string): void => {
    setMarkers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, notes } : m))
    )
  }

  const handleStatusChange = (id: string, status: Status): void => {
    setMarkers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    )
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-950 font-sans">
      {/* Barra superior con filtros integrados en el centro */}
      <Header onAddClick={() => setIsAddOpen(true)}>
        <FilterBar filters={filters} onChange={setFilters} />
      </Header>

      {/* Mapa a pantalla completa con marcadores filtrados */}
      <main className="w-full h-full">
        <MapView
          markers={filteredMarkers}
          selectedId={selectedId}
          onMarkerClick={(id) => setSelectedId(id)}
        />
      </main>

      {/* Panel lateral / Bottom sheet de detalle */}
      <MarkerDetailCard
        marker={selectedMarker}
        onClose={() => setSelectedId(null)}
        onNotesChange={handleNotesChange}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteMarker}
      />

      {/* Modal para añadir nuevo marcador */}
      <AddMarkerForm
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddMarker}
      />
    </div>
  )
}