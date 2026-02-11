// pages/cajero/components/CajaVentaCard.jsx
import { motion } from 'framer-motion'
import {
  Clock,
  CheckCircle,
  DollarSign,
  Users,
  Eye,
  Printer
} from 'lucide-react'

export const CajaVentaCard = ({ venta, onVerDetalle, onCobrar }) => {
  const getEstadoInfo = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return { icon: Clock, color: 'bg-yellow-100 text-yellow-800' }
      case 'PAGADO':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-800' }
      case 'LISTO':
        return { icon: CheckCircle, color: 'bg-blue-100 text-blue-800' }
      default:
        return { icon: CheckCircle, color: 'bg-gray-100 text-gray-800' }
    }
  }

  const estadoInfo = getEstadoInfo(venta.estado)
  const EstadoIcon = estadoInfo.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-gray-900">MESA {venta.nroMesa || 'N/A'}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoInfo.color}`}>
                <EstadoIcon className="inline-block w-3 h-3 mr-1" />
                {venta.estado}
              </span>
              <span className='font-bold text-gray-500'>{venta.tipo}</span>
            </div>
            <p className="text-sm text-gray-600">
              {venta.fecha} • {venta.hora} • Codigo {venta.codigo}
            </p>
          </div>

          <div className="text-right">
            <p className="font-bold text-xl text-gray-900">Bs {venta.total.toFixed(2)}</p>
            <p className="text-sm text-gray-500">{venta.total_items} items</p>
          </div>
        </div>

        {/* Información */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Cliente</p>
              <p className="font-medium text-gray-900 truncate">
                {venta.clienteNombre || 'Consumidor final'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Mesero</p>
              <p className="font-medium text-gray-900 truncate">
                {venta.mesero || 'No asignado'}
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <button
            onClick={onVerDetalle}
            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Ver Detalle
          </button>

          {(venta.estado === 'PENDIENTE' || venta.estado === 'LISTO') && (
            <button
              onClick={onCobrar}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Cobrar
            </button>
          )}

          {venta.estado === 'PAGADO' && (
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Reimprimir
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}