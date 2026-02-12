// pages/cajero/CajaPage.jsx
import React, { useState, useMemo } from 'react'
import {
  Filter,
  Clock,
  CheckCircle,
  Plus,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  XCircle,
  Utensils,
  Calendar,
  ShoppingBag
} from 'lucide-react'
import { CajaVentaCard } from '../components/CajaVentaCard'
import { ModalPago } from '../components/ModalPago'
import { ModalCerrarCaja } from '../components/ModalCerrarCaja'
import { CajaEmptyState } from '../components/CajaEmptyState'
import { CajaLoading } from '../components/CajaLoading'
import { CajaHeader } from '../components/CajaHeader'
import { ErrorMessage } from '../../../ui/ErrorMessage'
import { useAjustesManager } from '../../ajustes/hooks/useAjustesManager'
import { useNavigate, useSearchParams } from 'react-router'
import { useDebonce } from '../../gestion-items/producto/hooks/useDebonce'
import { FiltroEstadoVenta } from '../../../components/FiltroEstadoVenta'
import { CajaBusqueda } from '../components/CajaBusqueda'

export const CajaPage = () => {
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [filtroTipo, setFiltroTipo] = useState('TODOS')
  const [busqueda, setBusqueda] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [mostrarCerrarCaja, setMostrarCerrarCaja] = useState(false)
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  const filtroMesaNombreDebounce = useDebonce({ value: busqueda, delay: 300 })
  const navigate = useNavigate()
  const paginaFromUrl = Number(searchParams.get('page') || 1)
  const filtroEstadoFromUrl = searchParams.get('filtroEstado') || 'TODOS'
  const filtroTipoFromUrl = searchParams.get('filtroTipo') || 'TODOS'
  const { pedidos,
    ventasEncontradas,
    cargando,
    error: isError,
    refetch,
    page,
    isLoadingVentasPorMesas,
    imprimirVenta,
    isPendingImprimir
  } = useAjustesManager({
    filtros: {
      filtroEstado: filtroEstadoFromUrl !== 'TODOS' ? filtroEstadoFromUrl : undefined,
      tipoVenta: filtroTipoFromUrl !== 'TODOS' ? filtroTipoFromUrl : undefined
    },
    filtroMesaNombre: filtroMesaNombreDebounce,
    pageUrl: paginaFromUrl
  })
  const ventas = useMemo(() => {
    const hayBusqueda = busqueda.trim().length > 0
    return hayBusqueda ? ventasEncontradas : pedidos
  }, [busqueda, ventasEncontradas, pedidos])

  // Estados disponibles
  const estados = [
    { valor: 'TODOS', label: 'Todos', icon: Filter, color: 'bg-gray-100 text-gray-800' },
    { valor: 'PENDIENTE', label: 'Pendientes', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    { valor: 'LISTO', label: 'Listos', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { valor: 'PAGADO', label: 'Pagados', icon: DollarSign, color: 'bg-blue-100 text-blue-800' },
    { valor: 'CANCELADO', label: 'Anulados', icon: XCircle, color: 'bg-red-100 text-red-800' }
  ]

  // Tipos de venta
  const tiposVenta = [
    { valor: 'TODOS', label: 'Todos', icon: Filter },
    { valor: 'NORMAL', label: 'Local', icon: Utensils },
    { valor: 'RESERVA', label: 'Reserva', icon: Calendar },
    { valor: 'LLEVAR', label: 'Llevar', icon: ShoppingBag }
  ]

  // Manejar cambio de estado
  const handleCambiarEstado = (nuevoEstado, nuevoTipo) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('filtroEstado', nuevoEstado)
    newParams.set('filtroTipo', nuevoTipo)
    newParams.set('page', '1')
    setFiltroEstado(nuevoEstado)
    setFiltroTipo(nuevoTipo)
    setSearchParams(newParams)
  }

  const handleVerDetalle = (id) => {
    setSearchParams({ page: String(page) })
    navigate(`/cajero/venta/${id}?page=${page}`, {
      state: {
        filtroEstado,
        filtroTipo,
      }
    }
    )
  }

  const handleSiguiente = () => {
    if (ventas.length < 5) return
    setSearchParams({ page: String(page + 1) })
  }

  const handleAnterior = () => {
    setSearchParams({ page: String(page - 1) })
  }

  if (cargando) {
    return <CajaLoading />
  }

  if (isError) {
    return (
      <ErrorMessage mensaje="Error al cargar las ventas. Por favor, intenta nuevamente más tarde."
        titulo='Algo salió mal'
        onRetry={() => refetch()}
      />
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white ">
      {/* Header */}
      <CajaHeader
        onRefresh={refetch}
        onCerrarCaja={() => setMostrarCerrarCaja(true)}
        isLoading={cargando || isLoadingVentasPorMesas}
        setMostrarFiltros={setMostrarFiltros}
        mostrarFiltros={mostrarFiltros}
      />
      {/* Filtros */}
      <FiltroEstadoVenta
        cargando={cargando}
        estados={estados}
        filtroEstado={filtroEstado}
        handleCambiarFiltro={handleCambiarEstado}
        tiposVenta={tiposVenta}
        filtroTipo={filtroTipo}
        mostrarFiltros={mostrarFiltros}
      />

      <div className='mt-4 w-3/4 mx-auto'>
        <CajaBusqueda
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          isLoading={isLoadingVentasPorMesas}
        />
      </div>

      {/* Contenido principal */}
      <main className="p-6">
        {isLoadingVentasPorMesas ? (
          <CajaLoading />
        ) : ventas.length === 0 ? (
          <CajaEmptyState
            mensaje="No se encontraron ventas que coincidan con los filtros."
            onResetFilters={() => {
              setFiltroEstado('PENDIENTE')
              setBusqueda('')
            }}
          />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {ventas.map(venta => (
              <CajaVentaCard
                key={venta.id}
                venta={venta}
                isPendingImprimir={isPendingImprimir}
                onVerDetalle={() => handleVerDetalle(venta.id)}
                onImprimir={() => imprimirVenta(venta.id)}
              />
            ))}
          </div>
        )}
      </main>

      {mostrarCerrarCaja && (
        <ModalCerrarCaja
          onClose={() => setMostrarCerrarCaja(false)}
          onCerrarCaja={() => {
            setMostrarCerrarCaja(false)
            refetch()
          }}
        />
      )}
      {/* paginacion */}
      {
        busqueda.trim() === '' && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={handleAnterior}
              disabled={cargando || isLoadingVentasPorMesas}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>

            <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
              Página {page}
            </div>

            <button
              onClick={handleSiguiente}
              disabled={cargando || isLoadingVentasPorMesas}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )
      }
      {/* Botón flotante para nueva venta/reserva */}
      <button
        onClick={() => navigate('/cajero/reserva')}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 transition-all duration-200 flex items-center gap-2"
      >
        <Plus className="w-6 h-6" />
        <span className="hidden md:inline">Nueva Reserva</span>
      </button>
    </div>
  )
}