import { LucideShoppingBag, Plus } from "lucide-react"
import { useState } from "react"
import { ProductoCardMobile } from "../components/ProductoCardMobile"
import { useCarrito } from "../hooks/useCarrito"
import { ModalMobileCarrito } from "../components/ModalMobileCarrito"
import { BotonAccion } from "../../../ui/boton/BotonAccion"
import { useVentaMobileManager } from "../hooks/useVentaMobileManager"
import toast from "react-hot-toast"
import { VentaLayout } from "../layouts/VentaLayout"

export const NuevaVentaMobilePage = () => {

  const { crearVenta, isPending } = useVentaMobileManager({ filtroEstado: '' })
  const [mostrarCarrito, setMostrarCarrito] = useState(false)
  const [datosCliente, setDatosCliente] = useState({ nombre: '', nroMesa: '' })
  const [viewData, setViewData] = useState(false)

  const {
    agregarProducto,
    removerProducto,
    limpiarCarrito,
    getCantidad,
    getObservacion,
    actualizarObservacion,
    getDatosBackend,
    totalItems,
    estaVacio,
    carrito
  } = useCarrito()

  const handleAgregarProducto = (producto, cantidad) => {
    agregarProducto(producto, cantidad)
  }
  const handleConfirmarPedido = () => {
    if (datosCliente.nombre.trim() === '' && datosCliente.nroMesa === '') {
      toast.error('Por favor, ingresa el nombre del cliente o el número de mesa.')
      return
    }
    const datosPedido = getDatosBackend()

    const pedidoCompleto = {
      clienteNombre: datosCliente.nombre,
      nroMesa: datosCliente.nroMesa,
      detalle: [
        ...datosPedido
      ]
    }
    crearVenta(pedidoCompleto)
    limpiarCarrito()
    setMostrarCarrito(false)
    setDatosCliente({ nombre: '', nroMesa: '' })
    setViewData(false)
  }

  return (
    <>
      <BotonAccion
        icon={Plus}
        variant="success"
        label={!viewData ? 'Agregar datos del cliente' : 'Ocultar datos del cliente'}
        onClick={() => setViewData(!viewData)}
        className="mb-3"
      />
      {
        viewData && (
          <div className="mb-3">
            <input
              type="text"
              placeholder="Nombre del cliente"
              value={datosCliente.nombre}
              onChange={(e) => setDatosCliente({ ...datosCliente, nombre: e.target.value })}
              className="w-full mb-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              value={datosCliente.nroMesa}
              placeholder="Número de mesa"
              onChange={(e) => {
                const value = e.target.value
                if (!isNaN(value) && Number(value) >= 0) {
                  setDatosCliente({ ...datosCliente, nroMesa: Number(value) })
                }
              }}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button onClick={() => setViewData(!viewData)} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Guardar
            </button>
          </div>
        )
      }
      <VentaLayout titulo="Nueva Venta" subtitulo="Selecciona los productos para el pedido">
        {(producto) => (
          <ProductoCardMobile
            actualizarObservacion={actualizarObservacion}
            onAgregar={handleAgregarProducto}
            producto={producto}
            cantidad={getCantidad(producto.id)}
            observacion={getObservacion(producto.id)}
          />
        )}

      </VentaLayout>
      {totalItems !== 0 && (
        <button type="button" onClick={() => setMostrarCarrito(true)} className="fixed bottom-24 right-4 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 transition-all duration-200">
          <LucideShoppingBag size={24} />
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </div>
        </button>
      )}
      <ModalMobileCarrito
        carrito={carrito}
        estaVacio={estaVacio}
        handleAgregarProducto={agregarProducto}
        actualizarObservacion={actualizarObservacion}
        limpiarCarrito={limpiarCarrito}
        setMostrarCarrito={setMostrarCarrito}
        removerProducto={removerProducto}
        totalItems={totalItems}
        mostrarCarrito={mostrarCarrito}
        handleConfirmarPedido={handleConfirmarPedido}
        isPending={isPending}
      />
    </>
  )
}

