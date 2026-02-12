// pages/cajero/components/VentaProductosList.jsx
import { Package, DollarSign, Hash } from 'lucide-react'

export const VentaProductosList = ({ productos, totalItems, total }) => {
  // Calcular total general
  const calcularTotalGeneral = () => {
    return productos.reduce((total, producto) => {
      return total + (producto.subtotal || 0)
    }, 0)
  }

  const totalGeneral = calcularTotalGeneral()

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Productos</h2>
              <p className="text-sm text-gray-600">{totalItems || productos.length} items en la venta</p>
            </div>
          </div>
          <h2 className="text-lg font-bold text-green-600">Total: Bs {parseFloat(total).toFixed(2)}</h2>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="divide-y divide-gray-200">
        {productos.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay productos en esta venta</p>
          </div>
        ) : (
          productos.map((producto, index) => (
            <div key={index} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                {/* Información del producto */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">{producto.cantidad}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{producto.nombre}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <DollarSign className="w-3 h-3" />
                          <span>Bs {producto.precioUnitario?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Hash className="w-3 h-3" />
                          <span>ID: {producto.productoId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    Bs {producto.subtotal?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {producto.cantidad} × Bs {producto.precioUnitario?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer con totales */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Total de {productos.length} productos diferentes
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Subtotal</div>
            <div className="text-xl font-bold text-gray-900">Bs {totalGeneral.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}