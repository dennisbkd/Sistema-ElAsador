import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import {
  CheckCircle,
  User,
  Utensils,
  Calendar,
  Eye,
  AlertCircle,
} from 'lucide-react'

export const TarjetaPedido = ({ pedido, filtroTipo, filtroEstado, page, estados, cambiarEstadoVenta, isPendingCambiarEstado }) => {
  const navigate = useNavigate()

  // Navegar a detalle del pedido
  const verDetallePedido = (pedido) => {
    navigate(`/home/ajustes-venta/pedido/${pedido.id}`, {
      state: {
        filtroEstado,
        filtroTipo,
        page
      }
    })
  }


  // Obtener color según estado
  const getColorEstado = (estado) => {
    const estadoObj = estados.find(e => e.valor === estado)
    return estadoObj?.color || 'bg-gray-100 text-gray-800'
  }

  const EstadoIcon = estados.find(e => e.valor === pedido.estado)?.icon || AlertCircle

  return (
    <motion.div
      key={pedido.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => verDetallePedido(pedido)}
    >
      <div className="p-4">
        {/* Encabezado */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-gray-900">{pedido.codigo}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorEstado(pedido.estado)}`}>
                <EstadoIcon className="inline-block w-3 h-3 mr-1" />
                {pedido.estado}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {pedido.fecha} · {pedido.hora}
            </p>
          </div>

          <div className="text-right">
            <p className="font-bold text-xl text-gray-900">Bs {parseFloat(pedido.total || 0).toFixed(2)}</p>
            <p className="text-sm text-gray-500">{pedido.total_items || 0} items</p>
          </div>
        </div>

        {/* Información */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Cliente</p>
              <p className="font-medium text-gray-900 truncate">
                {pedido.clienteNombre || 'Cliente no especificado'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <User className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Mesero</p>
              <p className="font-medium text-gray-900 truncate">
                {pedido.mesero || 'No asignado'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Utensils className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Mesa</p>
              <p className="font-medium text-gray-900">
                {pedido.nroMesa ? `Mesa ${pedido.nroMesa}` : 'S/R'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Calendar className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tipo</p>
              <p className="font-medium text-gray-900">
                {pedido.tipo || 'NORMAL'}
              </p>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        {pedido.observaciones && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <p className="text-sm text-yellow-800 line-clamp-2">
              <span className="font-medium">Obs:</span> {pedido.observaciones}
            </p>
          </div>
        )}

        {/* Botones de acción rápida */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              verDetallePedido(pedido)
            }}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2 text-sm"
          >
            <Eye className="w-4 h-4" />
            Ver Detalle
          </button>

          {pedido.estado === 'PENDIENTE' && (
            <button
              disabled={isPendingCambiarEstado}
              onClick={(e) => {
                e.stopPropagation()
                cambiarEstadoVenta(pedido.id, 'LISTO')
              }}
              className="px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center gap-2 text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Listo
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
