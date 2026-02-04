// pages/cajero/CajaPage.jsx
import React, { useState, useMemo } from 'react'
import {
  Filter,
  Clock,
  CheckCircle,
  Plus,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { CajaStats } from '../components/CajaStats'
import { CajaFilters } from '../components/CajaFilters'
import { CajaVentaCard } from '../components/CajaVentaCard'
import { ModalPago } from '../components/ModalPago'
import { ModalCerrarCaja } from '../components/ModalCerrarCaja'
import { CajaEmptyState } from '../components/CajaEmptyState'
import { CajaLoading } from '../components/CajaLoading'
import { CajaHeader } from '../components/CajaHeader'
import { ErrorMessage } from '../../../ui/ErrorMessage'
import { useAjustesManager } from '../../ajustes/hooks/useAjustesManager'
import { useNavigate } from 'react-router'

export const CajaPage = () => {
  const [filtroEstado, setFiltroEstado] = useState('PENDIENTE')
  const [busqueda, setBusqueda] = useState('')
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null)
  const [mostrarModalPago, setMostrarModalPago] = useState(false)
  const [mostrarCerrarCaja, setMostrarCerrarCaja] = useState(false)
  const navigate = useNavigate()

  const { pedidos: ventas, cargando, error: isError, refetch, page, siguientePagina, anteriorPagina } = useAjustesManager({
    filtros: {
      filtroEstado: filtroEstado !== 'TODOS' ? filtroEstado : undefined,
      tipoVenta: undefined
    }
  })

  // Filtrar ventas por búsqueda
  const ventasFiltradas = useMemo(() => {
    if (!ventas) return []

    if (!busqueda.trim()) return ventas

    const termino = busqueda.toLowerCase()
    return ventas.filter(venta =>
      venta.codigo.toLowerCase().includes(termino) ||
      venta.clienteNombre?.toLowerCase().includes(termino) ||
      venta.mesa?.toString().includes(termino) ||
      venta.mesero?.toLowerCase().includes(termino)
    )
  }, [ventas, busqueda])

  // Calcular totales
  const { totalPendiente, totalPagado, cantidadPendientes } = useMemo(() => {
    const totalPendiente = ventasFiltradas
      .filter(v => v.estado === 'PENDIENTE')
      .reduce((sum, v) => sum + parseFloat(v.total || 0), 0)

    const totalPagado = ventasFiltradas
      .filter(v => v.estado === 'PAGADO')
      .reduce((sum, v) => sum + parseFloat(v.total || 0), 0)

    const cantidadPendientes = ventasFiltradas
      .filter(v => v.estado === 'PENDIENTE').length

    return { totalPendiente, totalPagado, cantidadPendientes }
  }, [ventasFiltradas])

  // Iniciar pago de una venta
  const iniciarPago = (venta) => {
    setVentaSeleccionada({
      ...venta,
      saldoPendiente: parseFloat(venta.total)
    })
    setMostrarModalPago(true)
  }

  // Estados disponibles para filtros
  const estadosFiltro = [
    { valor: 'PENDIENTE', label: 'Pendientes', icon: Clock },
    { valor: 'PAGADO', label: 'Pagados', icon: CheckCircle },
    { valor: 'TODOS', label: 'Todos', icon: Filter }
  ]

  // Manejar cambio de estado
  const handleCambiarEstado = (nuevoEstado) => {
    setFiltroEstado(nuevoEstado)
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <CajaHeader
        onRefresh={refetch}
        onCerrarCaja={() => setMostrarCerrarCaja(true)}
        isLoading={cargando}
      />

      {/* Estadísticas */}
      <CajaStats
        totalPendiente={totalPendiente}
        totalPagado={totalPagado}
        cantidadPendientes={cantidadPendientes}
      />

      {/* Filtros y búsqueda */}
      <CajaFilters
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        filtroEstado={filtroEstado}
        onEstadoChange={handleCambiarEstado}
        estadosFiltro={estadosFiltro}
        isLoading={cargando}
      />

      {/* Contenido principal */}
      <main className="p-6">
        {ventasFiltradas.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {ventasFiltradas.map(venta => (
              <CajaVentaCard
                key={venta.id}
                venta={venta}
                onVerDetalle={() => navigate(`/cajero/venta/${venta.id}`)}
                onCobrar={() => iniciarPago(venta)}
              />
            ))}
          </div>
        ) : (
          <CajaEmptyState
            busqueda={busqueda}
            onLimpiarBusqueda={() => setBusqueda('')}
          />
        )}
      </main>

      {/* Modales */}
      {mostrarModalPago && ventaSeleccionada && (
        <ModalPago
          venta={ventaSeleccionada}
          onClose={() => {
            setMostrarModalPago(false)
            setVentaSeleccionada(null)
          }}
          onPagoRegistrado={() => {
            setMostrarModalPago(false)
            setVentaSeleccionada(null)
            refetch()
          }}
        />
      )}

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
      <div className="mt-8 flex justify-center items-center gap-4">
        <button
          onClick={anteriorPagina}
          disabled={cargando}
          className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Anterior
        </button>

        <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
          Página {page}
        </div>

        <button
          onClick={siguientePagina}
          disabled={cargando}
          className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2"
        >
          Siguiente
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      {/* Botón flotante para nueva venta/reserva */}
      <button
        onClick={() => alert('Funcionalidad de nueva reserva no implementada')}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 transition-all duration-200 flex items-center gap-2"
      >
        <Plus className="w-6 h-6" />
        <span className="hidden md:inline">Nueva Reserva</span>
      </button>
    </div>
  )
}