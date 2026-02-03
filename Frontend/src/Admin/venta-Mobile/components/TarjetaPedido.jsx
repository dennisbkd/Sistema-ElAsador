import {
  Clock,
  AlertCircle,
  ChevronRight,
  User,
  CreditCard,
  Eye,
} from 'lucide-react'
import { getEstadoConfig } from '../helpers/estadosPedidosConfig'

// Componente de tarjeta de pedido
export const TarjetaPedido = ({ pedido, onSelect, onAdd }) => {
  const estadoConfig = getEstadoConfig(pedido.estado)
  const EstadoIcon = estadoConfig.icon
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-3 active:scale-[0.995] transition-transform duration-150 cursor-pointer"
    >
      {/* Header con estado */}
      <div className={`px-4 py-3 border-b flex items-center justify-between ${estadoConfig.color}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${estadoConfig.dotColor} animate-pulse`}></div>
          <EstadoIcon size={16} />
          <span className="font-semibold text-sm">{estadoConfig.text}</span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-4">
        {/* Info básica */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-gray-900">Mesa {pedido.nroMesa}</h3>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                {pedido.codigo}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{pedido.clienteNombre}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{pedido.hora}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </div>

        {/* Items del pedido */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Pedido ({pedido.total_items} items)</span>
          </div>
          <div className="space-y-2">
            {pedido.total_items > 2 && (
              <div className="text-center text-sm text-gray-500">
                +{pedido.total_items - 2} más...
              </div>
            )}
          </div>
        </div>

        {/* Notas especiales */}
        {pedido.observaciones && (
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-yellow-800">{pedido.observaciones}</span>
            </div>
          </div>
        )}

        {/* Footer con total y acciones */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-gray-500" />
            <span className="font-bold text-lg text-gray-900">Bs. {pedido.total}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onSelect(pedido)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
              <Eye size={16} />
            </button>
            {/* SOLO SE PODRA AGREGAR PRODUCTOS CUANDO EL PEDIDO ESTE EN PENDIENTE */}
            {
              pedido.estado === 'PENDIENTE' && (
                <button onClick={() => onAdd(pedido)} className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Agregar
                </button>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

