// src/components/Header.tsx
import React, { type ReactNode } from 'react'
import { Plus, BookOpen, BarChart2, Settings, Map as MapIcon } from 'lucide-react'

interface HeaderProps {
  view: 'map' | 'library'
  onViewChange: (v: 'map' | 'library') => void
  onAddClick: () => void
  onStatsClick: () => void
  onSettingsClick: () => void
  children?: ReactNode
}

interface ActionIconButtonProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  onClick?: () => void
}

const ActionIconButton: React.FC<ActionIconButtonProps> = ({
  icon,
  label,
  isActive = false,
  onClick,
}) => {
  return (
    <div className="relative group flex items-center justify-center">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer ${
          isActive
            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xs'
            : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
        }`}
      >
        {icon}
      </button>

      <span className="absolute top-full mt-1.5 hidden group-hover:block px-2 py-1 bg-neutral-900 dark:bg-neutral-800 text-white text-[11px] font-medium rounded-md shadow-lg pointer-events-none whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-100">
        {label}
      </span>
    </div>
  )
}

export const Header: React.FC<HeaderProps> = ({
  view,
  onViewChange,
  onAddClick,
  onStatsClick,
  onSettingsClick,
  children,
}) => {
  const toggleView = () => {
    onViewChange(view === 'map' ? 'library' : 'map')
  }

  return (
    <header className="w-full shrink-0 z-30 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-3 sm:px-6 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-4">
        {/* Fila superior: Logo y Acciones en móvil */}
        <div className="flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
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

          {/* Acciones para pantallas móviles */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={onAddClick}
              aria-label="Añadir lugar"
              className="p-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
            <ActionIconButton
              icon={view === 'library' ? <MapIcon className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
              label={view === 'library' ? 'Ver Mapa' : 'Biblioteca'}
              isActive={view === 'library'}
              onClick={toggleView}
            />
            <ActionIconButton
              icon={<BarChart2 className="w-4 h-4" />}
              label="Estadísticas"
              onClick={onStatsClick}
            />
            <ActionIconButton
              icon={<Settings className="w-4 h-4" />}
              label="Configuración"
              onClick={onSettingsClick}
            />
            <button
              type="button"
              aria-label="Mi Perfil"
              className="h-7 w-7 rounded-full ring-2 ring-neutral-200 dark:ring-neutral-700 overflow-hidden flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-[10px] font-semibold text-neutral-700 dark:text-neutral-300"
            >
              CM
            </button>
          </div>
        </div>

        {/* Barra de Filtros: pasa a segunda fila en móvil */}
        {children && (
          <div className="w-full md:flex-1 md:max-w-2xl flex justify-center order-last md:order-none">
            {children}
          </div>
        )}

        {/* Acciones para desktop */}
        <div className="hidden md:flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onAddClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-medium rounded-lg shadow-xs transition-all cursor-pointer mr-1"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir</span>
          </button>

          <div className="flex items-center gap-0.5 border-l border-neutral-200 dark:border-neutral-800 pl-1.5">
            <ActionIconButton
              icon={<BookOpen className="w-4 h-4" />}
              label={view === 'library' ? 'Volver al mapa' : 'Biblioteca'}
              isActive={view === 'library'}
              onClick={toggleView}
            />
            <ActionIconButton
              icon={<BarChart2 className="w-4 h-4" />}
              label="Estadísticas"
              onClick={onStatsClick}
            />
            <ActionIconButton
              icon={<Settings className="w-4 h-4" />}
              label="Configuración"
              onClick={onSettingsClick}
            />
          </div>

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