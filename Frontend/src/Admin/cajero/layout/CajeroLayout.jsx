// Admin/cajero/layout/CajaVerificacionLayout.jsx
import { Outlet } from 'react-router'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import {
  DollarSign,
  Lock,
  Unlock,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  LogOut,
  User,
  Home
} from 'lucide-react'
import { useCajaQueryObtenerAbierta } from '../hooks/useCajaQuery'
import { useCajaManager } from '../hooks/useCajaManager'
import { useNavigate } from 'react-router'

export const CajeroLayout = () => {
  const [montoInicial, setMontoInicial] = useState('0.00')
  const [isAbriendo, setIsAbriendo] = useState(false)
  const [error, setError] = useState('')
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {}
  const navigate = useNavigate()

  const { data: cajaData, isLoading, error: queryError } = useCajaQueryObtenerAbierta()
  const { abrirCaja, isPending } = useCajaManager()

  useEffect(() => {
    if (queryError) {
      setError('Error al verificar el estado de la caja. Por favor, intenta nuevamente.')
    }
  }, [queryError])

  // Si ya tiene caja abierta, mostrar el contenido normal
  const tieneCajaAbierta = cajaData?.tieneCajaAbierta

  const handleAbrirCaja = () => {
    const monto = parseFloat(montoInicial)

    if (isNaN(monto) || monto < 0) {
      setError('Por favor, ingresa un monto válido')
      return
    }

    setIsAbriendo(true)
    setError('')

    try {
      abrirCaja({ montoInicial: monto })
      window.location.reload() // Recargar para actualizar el estado de la caja
    } catch (error) {
      setError(error.message || 'Error al abrir la caja')
      setIsAbriendo(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando estado de caja...</p>
        </div>
      </div>
    )
  }

  // Si NO tiene caja abierta, mostrar pantalla de verificación
  if (!tieneCajaAbierta) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Caja Registradora</h1>
                <p className="text-sm text-gray-600">Gestión de pagos y ventas</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{usuario?.nombre}</p>
                  <p className="text-xs text-gray-500">Cajero</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Salir</span>
              </button>
            </div>
          </div>
        </header>

        {/* Contenido de verificación */}
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full"
          >
            {/* Encabezado */}
            <div className="text-center mb-8">
              <div className="inline-flex p-4 bg-blue-100 rounded-2xl mb-4">
                <DollarSign className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Control de Caja
              </h2>
              <p className="text-gray-600">
                Gestiona los pagos y ventas de tu turno
              </p>
            </div>

            {/* Estado actual */}
            <div className="mb-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h3 className="font-medium text-yellow-900">Caja Cerrada</h3>
                    <p className="text-sm text-yellow-700">
                      Debes abrir caja para comenzar a registrar pagos
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario para abrir caja */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-gray-900">Abrir Nueva Caja</h3>
                </div>

                {/* Monto inicial */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto Inicial en Efectivo
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Bs
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={montoInicial}
                      onChange={(e) => setMontoInicial(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-lg font-medium text-gray-900 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      placeholder="0.00"
                      disabled={isAbriendo || isPending}
                      autoFocus
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Dinero físico para dar cambio a los clientes
                  </p>
                </div>

                {/* Botones rápidos */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Montos sugeridos:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[50, 100, 200, 500, 1000, 0].map((monto) => (
                      <button
                        key={monto}
                        type="button"
                        onClick={() => setMontoInicial(monto.toString())}
                        className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                        disabled={isAbriendo || isPending}
                      >
                        {monto === 0 ? 'Limpiar' : `Bs ${monto}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Información */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Importante:</span> Una vez abierta la caja,
                      todos los pagos que registres quedarán asociados a esta sesión.
                    </p>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-3">
                  <button
                    onClick={handleAbrirCaja}
                    disabled={isAbriendo || isPending}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isAbriendo || isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Abriendo Caja...
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4" />
                        Abrir Caja y Comenzar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Mensaje de error */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Información del turno */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500">
                <p>Turno: {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
                <p className="mt-1">Hora: {new Date().toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Si TIENE caja abierta, mostrar el contenido normal (Outlet)
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Unlock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Caja Registradora</h1>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Caja Abierta
                </span>
                <span className="text-gray-600">
                  Desde {cajaData.caja?.fechaApertura ?
                    new Date(cajaData.caja.fechaApertura).toLocaleTimeString() : 'hoy'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* si es admin volver al home */}
            {usuario.rol === 'ADMINISTRADOR' && (
              <div className="flex items-center gap-2 cursor-pointer" >
                <button
                  onClick={() => navigate('/home')}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Home className="w-4 h-4" />
                  <span className="text-sm font-medium">Inicio</span>
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{usuario?.userName}</p>
                <p className="text-xs text-gray-500">Cajero</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Salir</span>
            </button>
          </div>
        </div>

        {/* Estado de caja */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span>Monto inicial: <span className="font-medium">Bs {Number(cajaData.caja?.montoInicial)?.toFixed(2) || '0.00'}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span>Estado: <span className="font-medium">Activa</span></span>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}