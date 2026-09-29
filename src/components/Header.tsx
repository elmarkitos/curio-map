// src/components/Header.tsx
import React, { type ReactNode } from 'react'
import { Plus, BookOpen, BarChart2, Settings } from 'lucide-react'

interface HeaderProps {
  onAddClick: () => void
  children?: ReactNode
}

interface ActionIconButtonProps {
  icon: React.ReactNode
  label: string
}

const ActionIconButton: React.FC<ActionIconButtonProps> = ({ icon, label }) => {
  return (
    <div className="relative group flex items-center justify-center">
      <button
        type="button"
        aria-label={label}
        className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
      >
        {icon}
      </button>

      {/* Tooltip */}
      <span className="absolute top-full mt-1.5 hidden group-hover:block px-2 py-1 bg-neutral-900 dark:bg-neutral-800 text-white text-[11px] font-medium rounded-md shadow-lg pointer-events-none whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-100">
        {label}
      </span>
    </div>
  )
}

export const Header: React.FC<HeaderProps> = ({ onAddClick, children }) => {
  return (
    <header className="absolute top-4 inset-x-4 z-30 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 pointer-events-auto bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl px-4 py-2.5 shadow-lg shadow-neutral-900/5 transition-all">
        {/* Izquierda: Logo y Marca */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="h-8 w-8 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-base shadow-xs select-none">
            C
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-white leading-none">
              CurioMap
            </span>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
              Cultural Atlas
            </span>
          </div>
        </div>

        {/* Centro: Espacio para filtros u otros controles */}
        <div className="flex-1 flex justify-center max-w-xl mx-2">
          {children}
        </div>

        {/* Derecha: Acciones, Añadir y Perfil */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Botón principal "Añadir" */}
          <button
            type="button"
            onClick={onAddClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-medium rounded-lg shadow-xs transition-all cursor-pointer mr-1"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Añadir</span>
          </button>

          {/* Iconos de navegación secundaria (solo visibles en pantallas md o mayores para no saturar) */}
          <div className="hidden md:flex items-center gap-0.5 border-l border-neutral-200 dark:border-neutral-800 pl-1.5">
            <ActionIconButton
              icon={<BookOpen className="w-4 h-4" />}
              label="Biblioteca"
            />
            <ActionIconButton
              icon={<BarChart2 className="w-4 h-4" />}
              label="Estadísticas"
            />
            <ActionIconButton
              icon={<Settings className="w-4 h-4" />}
              label="Configuración"
            />
          </div>

          {/* Avatar de Perfil con Tooltip */}
          <div className="relative group ml-1">
            <button
              type="button"
              aria-label="Perfil de usuario"
              className="h-8 w-8 rounded-full ring-2 ring-neutral-200 dark:ring-neutral-700 overflow-hidden flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:ring-neutral-400 dark:hover:ring-neutral-500 transition-all cursor-pointer"
            >
              CM
            </button>
            <span className="absolute top-full right-0 mt-1.5 hidden group-hover:block px-2 py-1 bg-neutral-900 dark:bg-neutral-800 text-white text-[11px] font-medium rounded-md shadow-lg pointer-events-none whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-100">
              Mi Perfil
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}