// pages/reserva/NuevaReservaPCPage.jsx
import { useState } from "react"
import { useNavigate } from "react-router"
import toast from "react-hot-toast"
import { motion } from "motion/react"
import { useCarrito } from "../../venta-Mobile/hooks/useCarrito"
import { ReservaSidebar } from "../components/reserva/ReservaSideBar"
import { ProductosGrid } from "../components/reserva/ProductosGrid"
import { BusquedaProductos } from "../components/reserva/BusquedaProductos"
import { CategoriasFiltro } from "../components/reserva/CategoriasFiltro"
import { useVentaMobileManager } from "../../venta-Mobile/hooks/useVentaMobileManager"
import { BotonAccion } from "../../../ui/boton/BotonAccion"
import { ChevronLeft } from "lucide-react"
import { useSocketMesero } from "../../../hooks/useSocketMesero"

export const NuevaReservaPage = () => {
  const [nombreBusqueda, setNombreBusqueda] = useState('')
  const [categoriaId, setCategoriaId] = useState(null)
  const [tipoVenta, setTipoVenta] = useState('RESERVA')
  const navigate = useNavigate()


  // Datos de la reserva
  const [reservaData, setReservaData] = useState({
    clienteNombre: '',
    nroMesa: '',
    fechaReserva: '',
    horaReserva: '',
    observaciones: ''
  })
  const { isConnected } = useSocketMesero()

  // Hook para manejar carrito
  const {
    agregarProducto,
    actualizarObservacion,
    getCantidad,
    getObservacion,
    carrito,
    limpiarCarrito,
    totalItems
  } = useCarrito()

  // Hook para crear reserva
  const { crearVenta, isPending } = useVentaMobileManager({})
  // Función para crear la reserva
  const handleCrearReserva = () => {
    try {
      // Validaciones
      if (!reservaData.clienteNombre.trim()) {
        toast.error('Ingresa el nombre del cliente')
        return
      }

      if (totalItems === 0) {
        toast.error('Agrega al menos un producto a la reserva')
        return
      }

      // Preparar datos para el backend
      const detalle = Object.values(carrito).map(item => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
        observaciones: item.observaciones || ''
      }))

      const reservaPayload = {
        clienteNombre: reservaData.clienteNombre.trim(),
        nroMesa: reservaData.nroMesa ? parseInt(reservaData.nroMesa) : null,
        observaciones: reservaData.observaciones || null,
        tipo: tipoVenta,
        estado: 'PENDIENTE',
        detalle
      }
      crearVenta(reservaPayload)

      toast.success('Reserva creada exitosamente')

      // Limpiar todo
      limpiarCarrito()
      setReservaData({
        clienteNombre: '',
        nroMesa: '',
        observaciones: ''
      })
      setNombreBusqueda('')

    } catch (error) {
      toast.error(error.message || 'Error al crear la reserva')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      {/* Contenido principal */}
      <div className="w-full mx-auto p-4">
        {/* retroceder a la anterior page */}
        <div className="w-full flex items-center justify-between">
          <BotonAccion
            label={'Volver'}
            icon={ChevronLeft}
            variant="edit"
            onClick={() => navigate('/cajero/caja')}
            className="mb-2"
          />
          <div className="flex gap-3 p-1 bg-gray-100 rounded-xl w-fit">
            <button
              className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 min-w-[120px]
      transition-all duration-200 font-medium text-sm
      ${tipoVenta === 'RESERVA'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md shadow-green-200/50'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm border border-gray-200'
                }`}
              onClick={() => setTipoVenta('RESERVA')}
            >
              <svg
                className={`w-5 h-5 ${tipoVenta === 'RESERVA' ? 'text-white' : 'text-gray-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>RESERVA</span>
            </button>

            <button
              className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 min-w-[120px]
      transition-all duration-200 font-medium text-sm
      ${tipoVenta === 'LLEVAR'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-200/50'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm border border-gray-200'
                }`}
              onClick={() => setTipoVenta('LLEVAR')}
            >
              <svg
                className={`w-5 h-5 ${tipoVenta === 'LLEVAR' ? 'text-white' : 'text-gray-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>LLEVAR</span>
            </button>
          </div>
        </div>
        <div>
          {!isConnected && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center font-medium">
              Conexión perdida. Algunas funciones pueden no estar disponibles.
            </div>
          )}
        </div>
        <div className="flex gap-6">
          {/* Columna izquierda - Productos (2/3 del ancho) */}
          <div className="flex-1">
            {/* Barra de búsqueda y filtros */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <BusquedaProductos
                    nombreBusqueda={nombreBusqueda}
                    setNombreBusqueda={setNombreBusqueda}
                  />
                </div>

                <div className="md:w-64">
                  <CategoriasFiltro
                    categoriaId={categoriaId}
                    setCategoriaId={setCategoriaId}
                  />
                </div>
              </div>
            </div>

            {/* Grid de productos */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Productos Disponibles</h2>
                <p className="text-sm text-gray-600">Selecciona los productos para la reserva</p>
              </div>

              <div className="p-4">
                <ProductosGrid
                  categoriaId={categoriaId}
                  nombreBusqueda={nombreBusqueda}
                  onAgregarProducto={agregarProducto}
                  getCantidad={getCantidad}
                  getObservacion={getObservacion}
                  actualizarObservacion={actualizarObservacion}
                />
              </div>
            </div>
          </div>

          {/* Columna derecha - Sidebar de reserva (1/3 del ancho) */}
          <div className="w-96 flex-shrink-0">
            <ReservaSidebar
              tipoVenta={tipoVenta}
              reservaData={reservaData}
              setReservaData={setReservaData}
              carrito={carrito}
              onLimpiarCarrito={limpiarCarrito}
              onCrearReserva={handleCrearReserva}
              isPending={isPending}
              totalItems={totalItems}
              total={Object.values(carrito).reduce((sum, item) =>
                sum + (item.producto.precio * item.cantidad), 0
              )}
              actualizarObservacion={actualizarObservacion}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}