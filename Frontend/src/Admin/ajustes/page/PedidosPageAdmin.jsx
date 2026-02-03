// PedidosPageAdmin.jsx - Actualizado para tu backend
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  DollarSign,
  User,
  Utensils,
  Calendar,
  Eye,
  XCircle,
  MoreVertical,
  AlertCircle,
  Printer,
  CheckSquare,
  Ban,
  Receipt,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react'
import { useAjustesManager } from '../hooks/useAjustesManager'
import { TarjetaPedido } from '../components/TarjetaPedido'
import { useSocketMesero } from '../../../hooks/useSocketMesero'
export const PedidosPageAdmin = () => {
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [filtroTipo, setFiltroTipo] = useState('TODOS')
  const [busqueda, setBusqueda] = useState('')
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  const {
    pedidos,
    cargando,
    error,
    refetch,
    cambiarEstadoVenta,
    isPendingCambiarEstado,
    anteriorPagina,
    siguientePagina,
    page
  } = useAjustesManager({
    filtros: {
      filtroEstado: filtroEstado !== 'TODOS' ? filtroEstado : undefined,
      tipoVenta: filtroTipo !== 'TODOS' ? filtroTipo : undefined
    }
  })
  const { isConnected } = useSocketMesero()

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
    { valor: 'NORMAL', label: 'Normal', icon: Utensils },
    { valor: 'RESERVA', label: 'Reserva', icon: Calendar }
  ]

  // Filtrar pedidos por búsqueda en el frontend
  const pedidosFiltrados = useMemo(() => {
    if (!pedidos || pedidos.error) return []

    let filtrados = [...pedidos]

    // Filtrar por búsqueda
    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase()
      filtrados = filtrados.filter(pedido =>
        pedido.codigo?.toLowerCase().includes(termino) ||
        pedido.clienteNombre?.toLowerCase().includes(termino) ||
        pedido.mesero?.toLowerCase().includes(termino) ||
        pedido.nroMesa?.toString().includes(termino)
      )
    }

    return filtrados
  }, [pedidos, busqueda])


  // Manejar cambio de filtro
  const handleCambiarFiltro = (nuevoEstado, nuevoTipo) => {
    setFiltroEstado(nuevoEstado)
    setFiltroTipo(nuevoTipo)
    refetch() // Forzar recarga
  }

  // Calcular totales
  const calcularTotales = () => {
    if (!pedidosFiltrados || pedidosFiltrados.length === 0) {
      return { totalVentas: 0, cantidadVentas: 0 }
    }

    const totalVentas = pedidosFiltrados.reduce((sum, p) => sum + parseFloat(p.total || 0), 0)
    const cantidadVentas = pedidosFiltrados.length

    return { totalVentas, cantidadVentas }
  }

  const { totalVentas, cantidadVentas } = calcularTotales()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Pedidos  {isConnected ?
              <div className="rounded-full h-3 w-3 bg-green-500 inline-block ml-2"></div> :
              <div className="rounded-full h-3 w-3 bg-red-500 inline-block ml-2"></div>}</h1>
            <p className="text-gray-600">Administra todos los pedidos del restaurante</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </button>

            <button
              onClick={() => {
                refetch()
              }}
              disabled={cargando}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} />
              {cargando ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por código, cliente, mesero o mesa..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={cargando}
          />
        </div>
      </div>

      {/* Filtros */}
      <AnimatePresence>
        {mostrarFiltros && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Filtro por estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado del Pedido</label>
                  <div className="flex flex-wrap gap-2">
                    {estados.map(estado => (
                      <button
                        key={estado.valor}
                        onClick={() => handleCambiarFiltro(estado.valor, filtroTipo)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
                          ${filtroEstado === estado.valor
                            ? estado.color.replace('100', '600').replace('800', '50') + ' text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        disabled={cargando}
                      >
                        <estado.icon className="w-4 h-4" />
                        {estado.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtro por tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Venta</label>
                  <div className="flex flex-wrap gap-2">
                    {tiposVenta.map(tipo => (
                      <button
                        key={tipo.valor}
                        onClick={() => handleCambiarFiltro(filtroEstado, tipo.valor)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
                          ${filtroTipo === tipo.valor
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        disabled={cargando}
                      >
                        <tipo.icon className="w-4 h-4" />
                        {tipo.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido principal */}
      <main className="p-6">
        {cargando ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">Cargando pedidos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-700">Error al cargar los pedidos</p>
            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        ) : pedidos?.error ? (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-700">Error en el servidor</p>
            <p className="text-sm text-gray-500">{pedidos.error}</p>
          </div>
        ) : (
          <>
            {/* Estadísticas */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-500">Total Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{cantidadVentas}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-500">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  Bs {totalVentas.toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-500">Página Actual</p>
                <p className="text-2xl font-bold text-gray-900">{page}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-500">Mostrando</p>
                <p className="text-2xl font-bold text-gray-900">{pedidosFiltrados.length} items</p>
              </div>
            </div>

            {/* Grid de pedidos */}
            {pedidosFiltrados.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {pedidosFiltrados.map(pedido => (
                    <TarjetaPedido
                      key={pedido.id}
                      pedido={pedido}
                      filtroEstado={filtroEstado}
                      filtroTipo={filtroTipo}
                      estados={estados}
                      page={page}
                      cambiarEstadoVenta={cambiarEstadoVenta}
                      isPendingCambiarEstado={isPendingCambiarEstado}
                    />
                  ))}
                </div>


              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Utensils className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay pedidos</h3>
                <p className="text-gray-500">
                  {busqueda
                    ? 'No se encontraron pedidos con esa búsqueda'
                    : `No hay pedidos con los filtros seleccionados`
                  }
                </p>
                {busqueda && (
                  <button
                    onClick={() => setBusqueda('')}
                    className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}
            {/* Paginación */}
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
          </>
        )}
      </main>
    </div>
  )
}