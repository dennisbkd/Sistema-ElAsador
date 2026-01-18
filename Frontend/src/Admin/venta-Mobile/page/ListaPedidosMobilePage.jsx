// pages/mesero/PedidosPage.jsx
import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  RefreshCw,
  PlusCircle
} from 'lucide-react'
import { TarjetaPedido } from '../components/TarjetaPedido'
import { useVentaMobileManager } from '../hooks/useVentaMobileManager'
import { SpinnerCargando } from '../../../ui/spinner/SpinnerCargando'
import { ErrorMessage } from '../../../ui/ErrorMessage'
import { useNavigate } from 'react-router'


// Componente principal de la página
export const PedidosPage = () => {
  const [pedidosFiltrados, setPedidosFiltrados] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const navigation = useNavigate()

  const { pedidos, isLoadingPedidos, isErrorPedidos } = useVentaMobileManager({ filtroEstado })

  // Estados disponibles para filtros
  const estados = [
    { id: 'TODOS', label: 'Todos', color: 'bg-gray-500' },
    { id: 'PENDIENTE', label: 'Pendientes', color: 'bg-yellow-500' },
    { id: 'LISTO', label: 'Listos', color: 'bg-green-500' },
    { id: 'ENTREGADO', label: 'Entregados', color: 'bg-gray-500' }
  ]

  // Aplicar filtros
  useEffect(() => {
    let resultados = [...pedidos]
    // Filtrar por estado
    if (filtroEstado !== 'TODOS') {
      resultados = resultados.filter(p => p.estado === filtroEstado)
    }

    setPedidosFiltrados(resultados)
  }, [filtroEstado, pedidos])

  if (isLoadingPedidos) {
    return (
      <SpinnerCargando
        texto="Cargando pedidos..."
      />
    )
  }

  if (isErrorPedidos) {
    return (
      <ErrorMessage
        mensaje="Error al cargar los pedidos. Por favor, intenta nuevamente más tarde."
        titulo='Algo salió mal'
        onRetry={() => window.location.reload()}
      />

    )
  }

  // Estadísticas
  const estadisticas = {
    total: pedidos.length,
    pendientes: pedidos.filter(p => p.estado === 'PENDIENTE').length,
    preparando: pedidos.filter(p => p.estado === 'PREPARANDO').length,
    listos: pedidos.filter(p => p.estado === 'LISTO').length
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
            <p className="text-sm text-gray-600">
              {estadisticas.total} pedidos
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw size={20} className={isLoadingPedidos ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por mesa, cliente o código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filtros por estado */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {estados.map((estado) => (
            <button
              key={estado.id}
              onClick={() => setFiltroEstado(estado.id)}
              className={`
                flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${filtroEstado === estado.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <div className={`w-2 h-2 rounded-full ${estado.color}`}></div>
              {estado.label}
              {estado.id !== 'TODOS' && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${filtroEstado === estado.id
                  ? 'bg-blue-700'
                  : 'bg-gray-300 text-gray-700'
                  }`}>
                  {pedidos.filter(p => p.estado === estado.id).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white rounded-lg p-2 text-center border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{estadisticas.total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-2 text-center border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-700">{estadisticas.pendientes}</div>
            <div className="text-xs text-yellow-600">Pendientes</div>
          </div>
          <div className="bg-green-50 rounded-lg p-2 text-center border border-green-200">
            <div className="text-2xl font-bold text-green-700">{estadisticas.listos}</div>
            <div className="text-xs text-green-600">Listos</div>
          </div>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="px-4 py-3">
        {isLoadingPedidos ? (
          <SpinnerCargando tamaño='lg' texto="Cargando pedidos..." />
        ) : pedidosFiltrados.length === 0 ? (
          <div className="text-center py-10">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {busqueda || filtroEstado !== 'TODOS' ? 'No se encontraron resultados' : 'No hay pedidos'}
            </h3>
            <p className="text-gray-600">
              {busqueda || filtroEstado !== 'TODOS'
                ? 'Intenta con otros filtros o términos de búsqueda'
                : 'Los pedidos aparecerán aquí cuando sean creados'
              }
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
              </span>
              <button type='button' className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                <Filter size={14} />
                Ordenar
              </button>
            </div>

            {/* Lista de tarjetas */}
            {pedidosFiltrados.map((pedido) => (
              <TarjetaPedido
                key={pedido.codigo}
                pedido={pedido}
                onAdd={() => navigation(`/mesero/pedidos/${pedido.id}/agregar-producto`)}
                onSelect={() => navigation(`/mesero/pedidos/${pedido.id}/visualizar-pedido`)}
              />
            ))}
          </div>
        )}
      </div>
      {/* Botón flotante para nuevo pedido */}
      <button className="fixed bottom-24 right-4 z-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 transition-all duration-200">
        <PlusCircle size={24} />
      </button>
    </div>
  )
}