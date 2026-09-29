export type Category = 'book' | 'movie' | 'art' | 'history'
export type Status = 'seen' | 'pending'

export interface Marker {
  id: string
  title: string
  category: Category
  lat: number
  lng: number
  locationName: string   // "Los Ángeles, EE. UU."
  summary: string        // luego lo generará la IA
  rating?: number
  year?: string
  imageUrl?: string      // opcional: la UI debe tener imagen de relleno
  notes: string
  status: Status
}

export type NewMarkerInput = Omit<Marker, 'id'>

export interface Filters {
  query: string
  categories: Category[]  // vacío = todas
  status: Status | 'all'
}