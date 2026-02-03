// PedidoDetallePage.jsx - Adaptado para tu backend
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate, useLocation } from 'react-router'
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  DollarSign,
  User,
  Utensils,
  Calendar,
  Printer,
  Ban,
  Receipt,
  AlertCircle,
  Package,
  Hash,
  DollarSign as DollarIcon,
  ShoppingBag,
  MessageSquare,
  Plus,
  Minus,
  RefreshCw,
} from 'lucide-react'
import { useAnularVenta, useAnularProductoDeVenta } from '../hooks/useAjustesQuery'
import { useAjusteVentaIdManager } from '../hooks/useAjusteVentaIdManager'
import toast from 'react-hot-toast'
import { ModalAgregarProducto } from '../components/ModalAgregarProducto'
import { useAjustesManager } from '../hooks/useAjustesManager'

export const PedidoDetallePage = () => {
  const pedidoId = useParams().pedidoId
  const navigate = useNavigate()
  const location = useLocation()
  const { filtroEstado, filtroTipo, page } = location.state || {}

  const { venta, isLoading, isError } = useAjusteVentaIdManager(pedidoId)
  const [mostrarAnularProducto, setMostrarAnularProducto] = useState(null)
  const [mostrarAnularVenta, setMostrarAnularVenta] = useState(false)
  const [motivoAnulacion, setMotivoAnulacion] = useState('')
  const [cantidadAnular, setCantidadAnular] = useState('')
  const [devolverStock, setDevolverStock] = useState(true)
  const [mostrarAgregarProducto, setMostrarAgregarProducto] = useState(false)
  const { agregarProducto, isPending, imprimirComandaCocina, isPendingImprimir, imprimirVenta, cambiarEstadoVenta, isPendingCambiarEstado } = useAjustesManager({})


  // Mutaciones
  const anularProductoMutation = useAnularProductoDeVenta()

  const anularVentaMutation = useAnularVenta()

  // Estados con colores
  const estados = {
    PENDIENTE: { label: 'Pendiente', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    LISTO: { label: 'Listo', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    PAGADO: { label: 'Pagado', icon: DollarSign, color: 'bg-blue-100 text-blue-800' },
    CANCELADO: { label: 'Anulado', icon: Ban, color: 'bg-red-100 text-red-800' }
  }

  // Acciones disponibles según estado
  const getAccionesDisponibles = (estado) => {
    const accionesBase = [
      { id: 'imprimir', label: 'Imprimir Comanda', icon: Printer, color: 'gray' }
    ]

    switch (estado) {
      case 'PENDIENTE':
        return [
          ...accionesBase,
          { id: 'listo', label: 'Marcar como Listo', icon: CheckCircle, color: 'green' },
          { id: 'anular', label: 'Anular Pedido', icon: Ban, color: 'red' }
        ]
      case 'LISTO':
        return [
          ...accionesBase,
          { id: 'anular', label: 'Anular Pedido', icon: Ban, color: 'red' }
        ]
      case 'PAGADO':
        return [
          ...accionesBase,
          { id: 'factura', label: 'Generar Factura', icon: Receipt, color: 'blue' }
        ]
      default:
        return accionesBase
    }
  }

  // Calcular totales
  const calcularTotales = () => {
    if (!venta?.productos) return { subtotal: 0, iva: 0, total: 0 }
    const subtotal = venta.productos.reduce((sum, p) => sum + parseFloat(p.subtotal || 0), 0)
    const total = subtotal

    return { subtotal, total }
  }

  const { subtotal, total } = calcularTotales()

  // Manejar acciones
  const handleAccion = (accionId) => {
    switch (accionId) {
      case 'volver':
        navigate('/home/ajustes-venta', {
          state: { filtroEstado, filtroTipo, page }
        })
        break
      case 'listo':
        cambiarEstadoVenta(pedidoId, 'LISTO')
        break
      case 'anular':
        setMostrarAnularVenta(true)
        break
      case 'imprimir':
        // Lógica para imprimir
        imprimirComandaCocina(pedidoId)
        break
      case 'factura':
        // Lógica para generar factura
        imprimirVenta(pedidoId)
        break
      default:
        console.log('Acción no implementada:', accionId)
    }
  }
  const cerrarModalAgregarProducto = () => {
    setMostrarAgregarProducto(false)
  }
  // Anular producto parcial o total
  const handleAnularProducto = (producto) => {
    setMostrarAnularProducto(producto)
    setCantidadAnular('')
  }

  const handleConfirmarAnularProducto = () => {
    if (!mostrarAnularProducto) return

    const cantidadTotal = mostrarAnularProducto.cantidad
    const cantidadNum =
      cantidadAnular === '' || cantidadAnular === null
        ? cantidadTotal
        : parseInt(cantidadAnular, 10)

    if (cantidadNum <= 0) {
      toast.error('La cantidad debe ser mayor a 0')
      return
    }

    if (cantidadNum > cantidadTotal) {
      toast.error('La cantidad a anular no puede ser mayor a la consumida')
      return
    }

    anularProductoMutation.mutate({
      ventaId: pedidoId,
      productoData: {
        productoId: mostrarAnularProducto.productoId,
        cantidad: cantidadNum,
        devolverStock
      }
    })

    setMostrarAnularProducto(null)
  }


  const handleConfirmarAnularVenta = () => {
    if (!motivoAnulacion.trim()) {
      toast.error('Por favor ingresa un motivo para la anulación')
      return
    }

    anularVentaMutation.mutate(pedidoId)
    setMostrarAnularVenta(false)
  }

  // Agregar nuevo producto
  const handleAgregarProducto = ({ ventaId, detalle }) => {
    agregarProducto(ventaId, { detalle })
  }
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando detalles del pedido...</p>
        </div>
      </div>
    )
  }

  if (isError || !venta) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar el pedido</h3>
          <p className="text-gray-600 mb-6">No se pudo cargar la información del pedido.</p>
          <button
            onClick={() => navigate('/home/ajustes-venta')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a pedidos
          </button>
        </div>
      </div>
    )
  }

  const estadoInfo = estados[venta.estado] || estados.PENDIENTE
  const EstadoIcon = estadoInfo.icon
  const acciones = getAccionesDisponibles(venta.estado)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleAccion('volver')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detalle del Pedido</h1>
              <p className="text-gray-600">Código: {venta.codigo}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${estadoInfo.color} flex items-center gap-2`}>
              <EstadoIcon className="w-4 h-4" />
              {estadoInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Información general */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información del pedido */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Información del Pedido
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Hash className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Código</p>
                      <p className="font-medium text-gray-900">{venta.codigo}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fecha y Hora</p>
                      <p className="font-medium text-gray-900">{venta.fecha} {venta.hora}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Utensils className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Mesa</p>
                      <p className="font-medium text-gray-900">Mesa {venta.nroMesa}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <User className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Cliente</p>
                      <p className="font-medium text-gray-900">{venta.clienteNombre}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              {venta.observaciones && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-yellow-600" />
                    <h3 className="font-medium text-yellow-800">Observaciones</h3>
                  </div>
                  <p className="text-yellow-700">{venta.observaciones}</p>
                </div>
              )}
            </motion.div>

            {/* Productos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  Productos ({venta.total_items})
                </h2>

                {venta.estado === 'PENDIENTE' && (
                  <button
                    onClick={() => setMostrarAgregarProducto(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Producto
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio Unitario
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                      {venta.estado === 'PENDIENTE' && (
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {venta.productos.map((producto, index) => (
                      <motion.tr
                        key={producto.productoId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{producto.nombre}</p>
                            <p className="text-sm text-gray-500">ID: {producto.productoId}</p>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{producto.cantidad}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <p className="font-medium">Bs {parseFloat(producto.precioUnitario).toFixed(2)}</p>
                        </td>

                        <td className="py-4 px-4">
                          <p className="font-bold text-gray-900">
                            Bs {parseFloat(producto.subtotal).toFixed(2)}
                          </p>
                        </td>

                        {venta.estado === 'PENDIENTE' && (
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleAnularProducto(producto)}
                              className="px-3 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 flex items-center gap-2 text-sm"
                              disabled={anularProductoMutation.isPending}
                            >
                              <Minus className="w-4 h-4" />
                              {anularProductoMutation.isPending ? 'Procesando...' : 'Anular'}
                            </button>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Columna derecha - Acciones y totales */}
          <div className="space-y-6">
            {/* Totales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarIcon className="w-5 h-5 text-blue-600" />
                Totales
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">Bs {subtotal.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">Bs {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Acciones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">Acciones</h2>

              <div className="space-y-3">
                {acciones.map((accion) => (
                  <button
                    key={accion.id}
                    onClick={() => handleAccion(accion.id)}
                    disabled={
                      accion.id === 'anular' && anularVentaMutation.isPending ||
                      (accion.id === 'imprimir' && isPendingImprimir) ||
                      (accion.id === 'listo' && isPendingCambiarEstado)}
                    className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50
                      ${accion.color === 'red' ? 'bg-red-50 text-red-700 hover:bg-red-100' :
                        accion.color === 'green' ? 'bg-green-50 text-green-700 hover:bg-green-100' :
                          accion.color === 'yellow' ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' :
                            accion.color === 'blue' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' :
                              'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <accion.icon className="w-4 h-4" />
                    {anularVentaMutation.isPending && accion.id === 'anular' ? 'Anulando...' : accion.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Modal para anular producto */}
      {mostrarAnularProducto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">Anular Producto</h3>
            <p className="text-gray-600 mb-4">
              <span className="font-medium">{mostrarAnularProducto.nombre}</span>
              <br />
              Cantidad actual: {mostrarAnularProducto.cantidad}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad a anular {mostrarAnularProducto.cantidad > 1 ? '(máximo ' + mostrarAnularProducto.cantidad + ')' : ''}
                </label>
                {mostrarAnularProducto.cantidad > 1 ? (
                  <input
                    type="number"
                    min="1"
                    max={mostrarAnularProducto.cantidad}
                    value={cantidadAnular}
                    onChange={(e) => setCantidadAnular(e.target.value)}
                    placeholder={`Dejar en blanco para anular ${mostrarAnularProducto.cantidad}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <p className="text-sm text-gray-500">Se anulará 1 unidad.</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="devolverStock"
                  checked={devolverStock}
                  onChange={(e) => setDevolverStock(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="devolverStock" className="text-sm text-gray-700">
                  Devolver al stock
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setMostrarAnularProducto(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarAnularProducto}
                disabled={anularProductoMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {anularProductoMutation.isPending ? 'Procesando...' : 'Anular'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal para anular venta */}
      {mostrarAnularVenta && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">Anular Pedido Completo</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro de que deseas anular el pedido <span className="font-medium">{venta.codigo}</span>?
              Esta acción devolverá todos los productos al stock.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de anulación
              </label>
              <textarea
                value={motivoAnulacion}
                onChange={(e) => setMotivoAnulacion(e.target.value)}
                placeholder="Ej: Cliente canceló, error en pedido, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                rows="3"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setMostrarAnularVenta(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarAnularVenta}
                disabled={anularVentaMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {anularVentaMutation.isPending ? 'Anulando...' : 'Confirmar Anulación'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <ModalAgregarProducto
        isOpen={mostrarAgregarProducto}
        onClose={cerrarModalAgregarProducto}
        onAgregar={handleAgregarProducto}
        pedidoId={pedidoId}
        venta={venta}
        isPending={isPending}
      />
    </div>
  )
}