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

export const NuevaReservaPage = () => {
  const [nombreBusqueda, setNombreBusqueda] = useState('')
  const [categoriaId, setCategoriaId] = useState(null)
  const navigate = useNavigate()


  // Datos de la reserva
  const [reservaData, setReservaData] = useState({
    clienteNombre: '',
    nroMesa: '',
    fechaReserva: '',
    horaReserva: '19:00',
    observaciones: ''
  })

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

      // Combinar fecha y hora
      const hoy = new Date().toLocaleDateString().split('/')
      if (!reservaData.fechaReserva) {
        reservaData.fechaReserva = `${hoy[2]}-${hoy[1].padStart(2, '0')}-${hoy[0].padStart(2, '0')}`
      }
      const fechaCompleta = `${reservaData.fechaReserva}T${reservaData.horaReserva}`

      // Preparar datos para el backend
      const detalle = Object.values(carrito).map(item => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
        observaciones: item.observaciones || ''
      }))

      const reservaPayload = {
        clienteNombre: reservaData.clienteNombre.trim(),
        nroMesa: reservaData.nroMesa ? parseInt(reservaData.nroMesa) : null,
        fechaReserva: fechaCompleta,
        observaciones: reservaData.observaciones || '',
        tipo: 'RESERVA',
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
        fechaReserva: '',
        horaReserva: '19:00',
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
      <div className="w-full mx-auto p-6">
        {/* retroceder a la anterior page */}
        <BotonAccion
          label={'Volver'}
          icon={ChevronLeft}
          variant="edit"
          onClick={() => navigate('/cajero/caja')}
          className="mb-4"
        />
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