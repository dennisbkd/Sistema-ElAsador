// PuntoVentaLayout.jsx - Versión completa con mobile
import { ClipboardPenLine, HandPlatter, ShoppingCart, User } from "lucide-react"
import { CabeceraPage } from "../../../ui/cabecera/CabeceraPage"
import { Outlet } from "react-router"
import { useVerificarMobile } from "../../../hooks/useVerificarMobile"
import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"

export const PuntoVentaLayout = () => {
  const esMobile = useVerificarMobile()
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [clienteNombre, setClienteNombre] = useState("")

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-7xl">
        <CabeceraPage
          titulo={"Punto de Venta"}
          subtitulo={"Procesa ventas de manera rápida y eficiente"}
          icono={ClipboardPenLine}
        />
        {/* Sidebar para Desktop */}
        {!esMobile && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white shadow-xl rounded-lg w-96 flex flex-col fixed top-0 right-0 h-full z-20"
          >
            <div className="flex items-center p-4 border-b border-gray-200  gap-3 md:p-6">
              <div className="p-2 rounded-lg bg-blue-600">
                <ShoppingCart size={24} className="text-white" />
              </div>
              <div >
                <h2 className="font-bold text-gray-800 text-lg">Orden Actual</h2>
                <p className="text-gray-600 text-xs md:text-sm">Venta en Progreso</p>
              </div>
            </div>
            <div>
              <div className="p-4 md:p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <User className="text-gray-400" size={esMobile ? 16 : 20} />
                  <div className="flex-1">
                    <p className="text-xs md:text-sm text-gray-600">Nombre del cliente</p>
                    <input
                      type="text"
                      value={clienteNombre}
                      onChange={(e) => setClienteNombre(e.target.value)}
                      placeholder="Ej. Maria..."
                      className="w-full border-b border-gray-300 focus:border-blue-600 focus:outline-none py-1 text-base md:text-lg"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <HandPlatter className="text-gray-400" size={esMobile ? 16 : 20} />
                  <div className="flex-1">
                    <p className="text-xs md:text-sm text-gray-600">Numero de mesa</p>
                    <input
                      type="text"
                      value={clienteNombre}
                      onChange={(e) => setClienteNombre(e.target.value)}
                      placeholder="ej 6..."
                      className="w-full border-b border-gray-300 focus:border-blue-600 focus:outline-none py-1 text-base md:text-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4">
              {/* Contenido del carrito */}
              <div className="text-center text-gray-500 mt-8">
                <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No hay productos en el carrito</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Procesar Venta
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Contenedor principal */}

      <div className={!esMobile ? "max-w-7xl mr-[408px]" : "max-w-7xl"}>
        <Outlet />
      </div>


      {/* Botón flotante para Mobile */}
      {esMobile && (
        <>
          <button
            onClick={() => setCarritoAbierto(true)}
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-30 hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart size={24} />
          </button>

          {/* Modal del carrito para Mobile */}
          <AnimatePresence>
            {carritoAbierto && (
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                className="fixed inset-0 z-40 bg-white"
              >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800 text-lg">Carrito</h2>
                  <button
                    onClick={() => setCarritoAbierto(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4">
                  {/* Contenido del carrito mobile */}
                  <div className="text-center text-gray-500 mt-8">
                    <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No hay productos en el carrito</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}