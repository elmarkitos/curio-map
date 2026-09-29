# 🗺 CurioMap

Mapa cultural personal: marca en un mapa los lugares asociados a libros, películas, series, obras de arte y hechos históricos, y guárdalos como un diario visual con tus propias notas.

> 🚧 Proyecto personal en desarrollo, hecho para aprender. Cualquier cosa puede cambiar.

## Idea

Cuando lees una novela o ves una película, los lugares importan: Los Ángeles en *Blade Runner*, La Mancha en *El Quijote*, Madrid y el *Guernica*. CurioMap te deja construir tu propio mapa de todo lo que consumes, con:

- Marcadores por categoría (libro, película/serie, arte, historia)
- Ficha de cada lugar: imagen, ubicación, resumen y notas personales
- Biblioteca con listas de "visto" y "pendiente"
- Filtros y búsqueda
- Resúmenes generados con IA (fase posterior)

## Stack

**Frontend (este repositorio)**
- React + TypeScript + Vite
- Tailwind CSS
- Leaflet / react-leaflet (mapa con OpenStreetMap)

**Previsto**
- Firebase (Auth, Firestore, Storage)
- Backend en Python con FastAPI (repositorio aparte) para enriquecer marcadores con Wikipedia, TMDB y una API de IA

## Estado

- [x] Proyecto base con Vite + React + TypeScript
- [ ] Tipos y datos de prueba
- [ ] Mapa con marcadores (MapView)
- [ ] Tarjeta de detalle (MarkerDetailCard)
- [ ] Layout: header / sidebar
- [ ] Formulario para añadir marcadores
- [ ] Filtros y búsqueda
- [ ] Backend Python + IA
- [ ] Login y persistencia con Firebase
- [ ] Biblioteca y estadísticas

## Cómo ejecutarlo

Requisitos: Node.js 18 o superior y Git.

```bash
git clone https://github.com/elmarkitos/curio-map.git
cd curio-map
npm install
npm run dev
```

La app se abre en `http://localhost:5173`.

## Variables de entorno

Cuando se conecte Firebase, copia `.env.example` a `.env.local` y rellena tus propias claves. Ese archivo no se sube al repositorio.

## Estructura prevista

```
src/
├── components/   # MapView, MarkerDetailCard, AddMarkerForm...
├── pages/        # pantallas completas
├── services/     # Firebase y llamadas al backend
├── hooks/        # lógica reutilizable (filtros, etc.)
├── data/         # datos de prueba
├── types/        # tipos TypeScript compartidos
├── App.tsx
└── main.tsx
```

## Licencia

Por definir.