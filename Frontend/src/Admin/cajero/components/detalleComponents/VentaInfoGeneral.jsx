// pages/cajero/components/VentaInfoGeneral.jsx
import { Calendar, Clock, Users, MapPin, CreditCard } from 'lucide-react'

export const VentaInfoGeneral = ({ venta }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Información General</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Información básica */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Datos del Cliente</h3>
            <div className="space-y-2">
              {venta.clienteNombre ? (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{venta.clienteNombre}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>Cliente no registrado</span>
                </div>
              )}

              {venta.nroMesa && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">Mesa {venta.nroMesa}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Fecha y Hora</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{venta.fecha}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{venta.hora}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Información adicional */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Código:</span>
            <p className="font-medium text-gray-900">{venta.codigo}</p>
          </div>
          <div>
            <span className="text-gray-600">Items:</span>
            <p className="font-medium text-gray-900">{venta.total_items || 0}</p>
          </div>
        </div>
      </div>
    </div>
  )
}