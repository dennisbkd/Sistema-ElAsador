// pages/cajero/VentaDetallePage.jsx
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Printer, Clock, Users, DollarSign, AlertCircle, ChefHat, RefreshCcw } from 'lucide-react'
import { VentaInfoGeneral } from '../components/detalleComponents/VentaInfoGeneral'
import { VentaProductosList } from '../components/detalleComponents/VentaProductosList'
import { useAjusteVentaIdManager } from '../../ajustes/hooks/useAjusteVentaIdManager'
import { useAjustesManager } from '../../ajustes/hooks/useAjustesManager'

export const VentaDetallePage = () => {
  const { ventaId } = useParams()
  const navigate = useNavigate()

  const { isLoading, error, venta } = useAjusteVentaIdManager(ventaId)
  const { imprimirVenta, isPendingImprimir, imprimirComandaCocina } = useAjustesManager({})

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles de la venta...</p>
        </div>
      </div>
    )
  }

  if (error || !venta) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="font-bold text-red-900">Error al cargar la venta</h3>
              <p className="text-sm text-red-700">No se pudieron obtener los detalles</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/cajero/caja')}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver a Caja
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/cajero/caja')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{venta.codigo}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{venta.hora}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Mesa {venta.nroMesa}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">Bs {parseFloat(venta.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type='button' disabled={isPendingImprimir} onClick={() => imprimirVenta(ventaId)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors">
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            <button type='button' disabled={isPendingImprimir} onClick={() => imprimirComandaCocina(ventaId)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
              {isPendingImprimir ? (
                <RefreshCcw size={16} className='animate-spin' />
              ) : (
                <ChefHat className="w-4 h-4" />
              )}
              Imprimir
              Ticket Cocina
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda - Información general */}
          <div className="space-y-6">
            <VentaInfoGeneral venta={venta} />
          </div>

          {/* Columna derecha - Productos */}
          <div className="space-y-6">
            <VentaProductosList productos={venta.productos} totalItems={venta.total_items} />

            {/* Observaciones */}
            {venta.observaciones && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="font-medium text-yellow-900 mb-2">Observaciones</h3>
                <p className="text-sm text-yellow-800">{venta.observaciones}</p>
              </div>
            )}
          </div>
        </div>

        {/* Estado de la venta */}
        <div className="mt-8 p-4 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${venta.estado === 'PAGADO'
                ? 'bg-green-100 text-green-800'
                : venta.estado === 'PENDIENTE'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
                }`}>
                {venta.estado}
              </div>
              <span className="text-gray-600">
                {venta.estado === 'PAGADO'
                  ? 'Venta pagada completamente'
                  : venta.estado === 'PENDIENTE'
                    ? 'Esperando pago'
                    : 'Venta cancelada'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}