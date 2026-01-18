import { LucideShoppingBag, MoveLeft } from "lucide-react"
import { useState } from "react"
import { ProductoCardMobile } from "../components/ProductoCardMobile"
import { useCarrito } from "../hooks/useCarrito"
import { ModalMobileCarrito } from "../components/ModalMobileCarrito"
import { useVentaMobileManager } from "../hooks/useVentaMobileManager"
import { useNavigate, useParams } from "react-router";
import { VentaLayout } from "../layouts/VentaLayout"
import { BotonAccion } from "../../../ui/boton/BotonAccion"
import { ErrorMessage } from "../../../ui/ErrorMessage"
import { SpinnerCargando } from "../../../ui/spinner/SpinnerCargando"

export const AgregarProductoOrdenPage = () => {
  const ventaId = useParams().ventaId
  const navigate = useNavigate()
  const { agregarProductoAVenta, isPending, venta, isLoadingVenta, isErrorVenta } = useVentaMobileManager({ filtroEstado: '', ventaId })
  const [mostrarCarrito, setMostrarCarrito] = useState(false)


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
    const datosPedido = getDatosBackend()

    const pedidoCompleto = {
      detalle: [
        ...datosPedido
      ]
    }
    agregarProductoAVenta(ventaId, pedidoCompleto)
    limpiarCarrito()
    setMostrarCarrito(false)
  }

  if (isLoadingVenta) {
    return (
      <SpinnerCargando
        texto="Cargando la venta"
      />
    )
  }

  if (isErrorVenta) {
    return (
      <ErrorMessage
        onRetry={() => window.location.reload()}
        mensaje="Error al Cargar la venta solicitada"
        titulo="Error de solicitud de venta"
      />
    )
  }

  return (
    <>
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <BotonAccion
            icon={MoveLeft}
            variant="edit"
            onClick={() => navigate("/mesero/pedidos")}
          />
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">Agregar a Orden</h1>
            <p className="text-sm text-gray-600">
              Orden #{venta.codigo} • <b>Mesa {venta.nroMesa}</b>
            </p>
            <p>Cliente: {venta.clienteNombre || 'N/A'}</p>
          </div>
          <div className="w-10"></div> {/* Spacer para centrar */}
        </div>
      </div>
      <VentaLayout >
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

