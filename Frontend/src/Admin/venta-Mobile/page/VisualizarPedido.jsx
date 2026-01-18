import { useNavigate, useParams } from "react-router"
import { useVentaMobileManager } from "../hooks/useVentaMobileManager"
import { SpinnerCargando } from "../../../ui/spinner/SpinnerCargando"
import { ErrorMessage } from "../../../ui/ErrorMessage"
import { Insignia } from "../../../ui/Insignia"
import { BadgeAlert, CalendarClock, MoveLeft, Table, User } from "lucide-react"
import { CardInfoVenta } from "../components/CardInfoVenta"
import { BotonAccion } from "../../../ui/boton/BotonAccion"


export const VisualizarPedido = () => {
  const ventaId = useParams().ventaId
  const navigate = useNavigate()
  const { venta, isLoadingVenta, isErrorVenta } = useVentaMobileManager({ filtroEstado: '', ventaId })
  if (isLoadingVenta) {
    return (
      <SpinnerCargando
        texto="Cargando venta solicitada"
      />
    )
  }
  if (isErrorVenta) {
    return (
      <ErrorMessage
        mensaje="Algo salio mal con el servidor"
        titulo="Error al mostrar la venta"
      />
    )
  }

  const dataUsuario = [{
    icono: User,
    texto: venta.clienteNombre || 'Cliente no registrado',
    titulo: "CLIENTE"
  }, {
    icono: CalendarClock,
    texto: `${venta.fecha} - ${venta.hora}`,
    titulo: "FECHA Y HORA"
  }, {
    icono: Table,
    texto: `# ${venta.nroMesa}`,
    titulo: "MESA"
  }]

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="flex items-center justify-between space-x-4 bg-white shadow-md px-4 py-4 mb-4">
        <BotonAccion
          icon={MoveLeft}
          variant="edit"
          label={"Volver"}
          onClick={() => navigate("/mesero/pedidos")}
        />
        <h1 className="text-wrap font-bold text-2xl">Orden #{venta.codigo}</h1>
      </div>
      <Insignia size={24} icon={BadgeAlert} color={'yellow'} texto={venta.estado} className="mb-4" />
      {
        dataUsuario.map((item, index) => (
          <CardInfoVenta
            key={index}
            icono={item.icono}
            texto={item.texto}
            titulo={item.titulo}
          />
        ))
      }
      <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
        <h2 className="border-b border-gray-200 font-bold text-xl py-4 px-6">Detalles del pedido</h2>
        <div className="py-2">
          {
            venta.productos.map((producto, index) => (
              <div key={index} className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                <div className="flex items-center justify-between gap-4 w-full px-6">
                  <div className="flex items-center">
                    <div className="p-1 h-12 w-12 bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center rounded-lg text-white font-bold">
                      <span className="font-bold text-lg">{producto.cantidad}x</span>
                    </div>
                    <div className="grid justify-items-start ml-4">
                      <span className="ml-2 text-gray-800 font-bold">{producto.nombre}</span>
                      <span className="ml-2 text-xs text-gray-500" >P/u: {producto.precioUnitario}</span>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">
                    Bs. {producto.subtotal}
                  </p>
                </div>
              </div>
            ))
          }
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <span className="font-bold text-lg text-gray-900">Total:</span>
          <span className="font-bold text-lg text-gray-900">Bs. {venta.total}</span>
        </div>
      </div>
    </div >
  )
}
