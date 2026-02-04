// pages/cajero/components/ModalCerrarCaja.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  XCircle,
  DollarSign,
  QrCode,
  Calculator,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { useCajaCerrar, useCajaQueryObtenerAbierta } from '../hooks/useCajaQuery'

export const ModalCerrarCaja = ({ onClose, onCerrarCaja }) => {
  const [montoFinalEfectivo, setMontoFinalEfectivo] = useState('')
  const [montoFinalQR, setMontoFinalQR] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [isCerrando, setIsCerrando] = useState(false)

  const { data: cajaData } = useCajaQueryObtenerAbierta()
  const cerrarCajaMutation = useCajaCerrar()

  // Datos de la caja actual
  const caja = cajaData?.caja
  const totalTeoricoEfectivo = parseFloat(caja?.montoTeoricoEfectivo) || 0
  const totalTeoricoQR = parseFloat(caja?.montoTeoricoQR) || 0
  const montoInicial = parseFloat(caja?.montoInicial) || 0

  // Calcular diferencias
  const montoFinalEfectivoNum = parseFloat(montoFinalEfectivo) || 0
  const montoFinalQRNum = parseFloat(montoFinalQR) || 0

  const diferenciaEfectivo = montoFinalEfectivoNum - (totalTeoricoEfectivo + montoInicial)
  const diferenciaQR = montoFinalQRNum - totalTeoricoQR

  const totalTeorico = totalTeoricoEfectivo + totalTeoricoQR
  const totalReal = montoFinalEfectivoNum + montoFinalQRNum
  const diferenciaTotal = totalReal - totalTeorico

  const handleCerrarCaja = async () => {
    if (!montoFinalEfectivo || parseFloat(montoFinalEfectivo) < 0) {
      alert('Por favor, ingresa el monto final en efectivo')
      return
    }

    if (!montoFinalQR || parseFloat(montoFinalQR) < 0) {
      alert('Por favor, ingresa el monto final en QR')
      return
    }

    setIsCerrando(true)
    try {
      const body = {
        montoFinalEfectivo: parseFloat(montoFinalEfectivo),
        montoFinalQR: parseFloat(montoFinalQR),
        observaciones
      }

      await cerrarCajaMutation.mutateAsync({ body })
      onCerrarCaja()
      onClose()
    } catch (error) {
      console.error('Error cerrando caja:', error)
      // El error ya se maneja en el hook con toast
    } finally {
      setIsCerrando(false)
    }
  }

  // Obtener resumen de pagos si está disponible
  const resumenPagos = cajaData?.resumenPagos || []

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Cierre de Caja</h3>
              <p className="text-sm text-gray-600">
                {caja?.usuario?.nombre || 'Usuario'} • {caja?.fechaApertura ? new Date(caja.fechaApertura).toLocaleDateString() : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={isCerrando}
          >
            <XCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Resumen de la caja */}
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-white rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Monto Inicial</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                Bs {parseFloat(montoInicial).toFixed(2)}
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Total Teórico Efectivo</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                Bs {parseFloat(totalTeoricoEfectivo).toFixed(2)}
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <QrCode className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">Total Teórico QR</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">
                Bs {parseFloat(totalTeoricoQR).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Resumen de ventas */}
          {resumenPagos.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Resumen de ventas:</p>
              <div className="flex flex-wrap gap-2">
                {resumenPagos.map((pago, index) => (
                  <div key={index} className="px-3 py-1 bg-white border rounded-lg text-sm">
                    <span className="font-medium">{pago.metodoPago}:</span> {pago.cantidad} ventas
                    <span className="ml-2 font-bold">
                      Bs {parseFloat(pago.total || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-700">
                <span className="font-medium">Total Teórico:</span>
                <span className="ml-2 font-bold text-lg">
                  Bs {parseFloat(totalTeorico).toFixed(2)}
                </span>
                <span className="ml-4">
                  (Efectivo: Bs {parseFloat(totalTeoricoEfectivo).toFixed(2)} + QR: Bs {parseFloat(totalTeoricoQR).toFixed(2)})
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Montos finales a ingresar */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-4">Montos Finales Contados</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Efectivo */}
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <label className="font-medium text-gray-900">Efectivo Físico</label>
              </div>
              <div className="relative mb-2">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                  Bs
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={montoFinalEfectivo}
                  onChange={(e) => setMontoFinalEfectivo(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-xl font-bold text-gray-900 border border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                  placeholder="0.00"
                  disabled={isCerrando}
                />
              </div>
              <p className="text-sm text-gray-600">
                Dinero físico contado en caja
              </p>
            </div>

            {/* QR */}
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <QrCode className="w-5 h-5 text-purple-600" />
                <label className="font-medium text-gray-900">QR Contado</label>
              </div>
              <div className="relative mb-2">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                  Bs
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={montoFinalQR}
                  onChange={(e) => setMontoFinalQR(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-xl font-bold text-gray-900 border border-purple-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                  placeholder="0.00"
                  disabled={isCerrando}
                />
              </div>
              <p className="text-sm text-gray-600">
                Total de pagos QR verificados
              </p>
            </div>
          </div>
        </div>

        {/* Diferencias calculadas */}
        {(montoFinalEfectivo || montoFinalQR) && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Diferencias Calculadas</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Diferencia Efectivo */}
              <div className={`p-4 rounded-xl border ${diferenciaEfectivo === 0
                ? 'bg-green-50 border-green-200'
                : diferenciaEfectivo > 0
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Diferencia Efectivo</span>
                  <div className={`flex items-center gap-1 ${diferenciaEfectivo === 0 ? 'text-green-600' :
                    diferenciaEfectivo > 0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                    {diferenciaEfectivo > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : diferenciaEfectivo < 0 ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    Bs {Math.abs(diferenciaEfectivo).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600">
                    {diferenciaEfectivo === 0 ? 'Cuadra perfecto' :
                      diferenciaEfectivo > 0 ? 'Sobrante' : 'Faltante'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Cálculo: {montoFinalEfectivoNum.toFixed(2)} - ({totalTeoricoEfectivo.toFixed(2)} + {montoInicial})
                </p>
              </div>

              {/* Diferencia QR */}
              <div className={`p-4 rounded-xl border ${diferenciaQR === 0
                ? 'bg-green-50 border-green-200'
                : diferenciaQR > 0
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Diferencia QR</span>
                  <div className={`flex items-center gap-1 ${diferenciaQR === 0 ? 'text-green-600' :
                    diferenciaQR > 0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                    {diferenciaQR > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : diferenciaQR < 0 ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    Bs {Math.abs(diferenciaQR).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600">
                    {diferenciaQR === 0 ? 'Cuadra perfecto' :
                      diferenciaQR > 0 ? 'Sobrante' : 'Faltante'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Cálculo: {montoFinalQRNum.toFixed(2)} - {totalTeoricoQR.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Diferencia Total */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Diferencia Total</span>
                <div className={`text-lg font-bold ${diferenciaTotal === 0 ? 'text-green-600' :
                  diferenciaTotal > 0 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                  Bs {diferenciaTotal.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Real:</p>
                  <p className="font-medium text-gray-900">
                    Bs {(montoFinalEfectivoNum + montoFinalQRNum).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Total Teórico:</p>
                  <p className="font-medium text-gray-900">
                    Bs {totalTeorico.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Observaciones */}
        <div className="mb-6">
          <label className="block font-medium text-gray-900 mb-2">
            Observaciones (opcional)
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Ej: Retiro de efectivo, observaciones del turno, novedades..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            rows="3"
            disabled={isCerrando}
          />
        </div>

        {/* Validación si hay diferencias */}
        {(diferenciaEfectivo !== 0 || diferenciaQR !== 0) && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800 mb-1">¡Hay diferencias en la caja!</p>
                <p className="text-sm text-yellow-700">
                  Por favor, verifica los montos ingresados.
                  {diferenciaEfectivo !== 0 && ` Diferencia en efectivo: Bs ${Math.abs(diferenciaEfectivo).toFixed(2)} (${diferenciaEfectivo > 0 ? 'sobrante' : 'faltante'}).`}
                  {diferenciaQR !== 0 && ` Diferencia en QR: Bs ${Math.abs(diferenciaQR).toFixed(2)} (${diferenciaQR > 0 ? 'sobrante' : 'faltante'}).`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer con botones */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isCerrando}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleCerrarCaja}
            disabled={isCerrando || !montoFinalEfectivo || !montoFinalQR}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isCerrando ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Cerrando Caja...
              </>
            ) : (
              'Confirmar Cierre de Caja'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}