// pages/cajero/components/ModalPago.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  XCircle,
  DollarSign,
  QrCode,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Receipt,
  Calculator,
  Coins
} from 'lucide-react'
import { useRegistrarPago } from '../hooks/useCajaQuery'

export const ModalPago = ({ venta, onClose, onPagoRegistrado }) => {
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('EFECTIVO')
  const [montoRecibido, setMontoRecibido] = useState('')
  const [isRegistrando, setIsRegistrando] = useState(false)
  const [cambio, setCambio] = useState(0)
  const registrarPagoMutation = useRegistrarPago()

  const totalVenta = parseFloat(venta.total)
  const montoRecibidoNum = parseFloat(montoRecibido) || 0

  // Calcular cambio cuando el método es EFECTIVO y hay monto recibido
  useEffect(() => {
    if (metodoSeleccionado === 'EFECTIVO' && montoRecibidoNum > 0) {
      const cambioCalculado = montoRecibidoNum - totalVenta
      setCambio(cambioCalculado > 0 ? cambioCalculado : 0)
    } else {
      setCambio(0)
    }
  }, [metodoSeleccionado, montoRecibidoNum, totalVenta])

  // Botones rápidos para montos comunes
  const montosRapidos = [100, 200, 300, 500, 1000]

  const handleMontoRapido = (monto) => {
    const nuevoMonto = montoRecibidoNum + monto
    setMontoRecibido(nuevoMonto.toString())
  }

  const handleRegistrarPago = async () => {
    if (!metodoSeleccionado) {
      alert('Por favor, selecciona un método de pago')
      return
    }

    // Validar que para efectivo se haya ingresado un monto suficiente
    if (metodoSeleccionado === 'EFECTIVO') {
      if (montoRecibidoNum === 0) {
        alert('Por favor, ingresa el monto recibido del cliente')
        return
      }

      if (montoRecibidoNum < totalVenta) {
        alert(`El monto recibido (Bs ${montoRecibidoNum.toFixed(2)}) es menor al total de la venta (Bs ${totalVenta.toFixed(2)})`)
        return
      }
    }

    setIsRegistrando(true)
    try {
      await registrarPagoMutation.mutateAsync({
        ventaId: venta.id,
        metodoPago: metodoSeleccionado
      })

      onPagoRegistrado()
      onClose()
    } catch (error) {
      console.error('Error registrando pago:', error)
    } finally {
      setIsRegistrando(false)
    }
  }

  // Métodos de pago disponibles
  const metodosPago = [
    {
      id: 'EFECTIVO',
      nombre: 'Efectivo',
      icono: DollarSign,
      color: 'green',
      descripcion: 'Pago en efectivo'
    },
    {
      id: 'QR',
      nombre: 'QR',
      icono: QrCode,
      color: 'purple',
      descripcion: 'Pago con código QR'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full max-h-full overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Registrar Pago</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Receipt className="w-4 h-4" />
              <span>{venta.codigo}</span>
              {venta.mesa && <span>• Mesa {venta.mesa}</span>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={isRegistrando}
          >
            <XCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Resumen de la venta */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Total a pagar:</span>
            </div>
            <span className="text-3xl font-bold text-gray-900">
              Bs {totalVenta.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Selección de método de pago */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Método de pago</h4>
          <div className="grid grid-cols-2 gap-3">
            {metodosPago.map((metodo) => {
              const Icon = metodo.icono
              const isSelected = metodoSeleccionado === metodo.id

              return (
                <button
                  key={metodo.id}
                  onClick={() => {
                    setMetodoSeleccionado(metodo.id)
                    if (metodo.id === 'QR') {
                      setMontoRecibido('') // Limpiar monto recibido para QR
                    }
                  }}
                  className={`
                    p-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2
                    transition-all duration-200
                    ${isSelected
                      ? `border-${metodo.color}-500 bg-${metodo.color}-50`
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className={`w-8 h-8 ${isSelected ? `text-${metodo.color}-600` : 'text-gray-400'}`} />
                  <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                    {metodo.nombre}
                  </span>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Para pago en EFECTIVO: Monto recibido */}
        {metodoSeleccionado === 'EFECTIVO' && (
          <div className="mb-4 space-y-4">
            {/* Monto recibido */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h5 className="font-medium text-gray-900">Monto Recibido</h5>
              </div>

              <div className="relative mb-4">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl font-medium">
                  Bs
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={montoRecibido}
                  onChange={(e) => setMontoRecibido(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-2xl font-bold text-gray-900 border border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                  placeholder="0.00"
                  disabled={isRegistrando}
                />
              </div>

              {/* Botones rápidos */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Montos rápidos:</p>
                <div className="grid grid-cols-5 gap-2">
                  {montosRapidos.map((monto) => (
                    <button
                      key={monto}
                      type="button"
                      onClick={() => handleMontoRapido(monto)}
                      className="px-2 py-2 text-sm bg-white border border-green-200 rounded hover:bg-green-50 hover:border-green-300 transition-colors"
                      disabled={isRegistrando}
                    >
                      +{monto}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Resumen de cambio */}
            {montoRecibidoNum > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="grid grid-cols-3 gap-4">
                  {/* Total */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Total</p>
                    <p className="text-lg font-bold text-gray-900">
                      Bs {totalVenta.toFixed(2)}
                    </p>
                  </div>

                  {/* Recibido */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Recibido</p>
                    <p className="text-lg font-bold text-green-600">
                      Bs {montoRecibidoNum.toFixed(2)}
                    </p>
                  </div>

                  {/* Cambio */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Cambio</p>
                    <div className="flex items-center justify-center gap-1">
                      <Coins className="w-4 h-4 text-yellow-600" />
                      <p className={`text-lg font-bold ${cambio > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>
                        Bs {cambio.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Para pago en QR */}
        {metodoSeleccionado === 'QR' && (
          <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center gap-3">
              <QrCode className="w-6 h-6 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Pago con QR</p>
                <p className="text-sm text-gray-600">
                  El cliente escaneará el código QR para pagar Bs {totalVenta.toFixed(2)}.
                </p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-white rounded border border-purple-200">
              <p className="text-sm text-purple-700">
                <span className="font-medium">Nota:</span> El sistema registrará el pago automáticamente una vez completada la transacción QR.
              </p>
            </div>
          </div>
        )}


        {/* Footer con botones */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isRegistrando}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleRegistrarPago}
            disabled={
              isRegistrando ||
              !metodoSeleccionado ||
              (metodoSeleccionado === 'EFECTIVO' && (montoRecibidoNum < totalVenta || montoRecibidoNum === 0))
            }
            className={`
              flex-1 px-4 py-3 text-white rounded-lg flex items-center justify-center gap-2
              ${metodoSeleccionado === 'EFECTIVO'
                ? 'bg-green-600 hover:bg-green-700'
                : metodoSeleccionado === 'QR'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }
              disabled:opacity-50
            `}
          >
            {isRegistrando ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                {metodoSeleccionado === 'EFECTIVO' ? (
                  <>
                    <DollarSign className="w-4 h-4" />
                    {cambio >= 0 ? 'Registrar Pago' : 'Monto insuficiente'}
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    Registrar Pago QR
                  </>
                )}
              </>
            )}
          </button>
        </div>

        {/* Advertencia si el monto recibido es menor al total */}
        {metodoSeleccionado === 'EFECTIVO' && montoRecibidoNum > 0 && montoRecibidoNum < totalVenta && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-700">
                El monto recibido es insuficiente. Faltan <span className="font-bold">Bs {(totalVenta - montoRecibidoNum).toFixed(2)}</span>.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}