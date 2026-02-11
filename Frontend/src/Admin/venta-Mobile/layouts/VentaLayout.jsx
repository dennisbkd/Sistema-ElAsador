import { Search, X } from "lucide-react"
import { Menu } from "../../gestion-items/producto/components/Menu"
import { useCategoriaManager } from "../../gestion-items/categoria/hooks/useCategoriaManager"
import { useState } from "react"
import { useProductoManager } from "../../gestion-items/producto/hooks/useProductoManager"
import { motion } from "motion/react"
import { useEffect } from "react"
import { SpinnerCargando } from "../../../ui/spinner/SpinnerCargando"
import { BotonAccion } from "../../../ui/boton/BotonAccion"
import { useDebonce } from "../../gestion-items/producto/hooks/useDebonce"
import { ErrorMessage } from "../../../ui/ErrorMessage"
import { useSocketMesero } from "../../../hooks/useSocketMesero"

export const VentaLayout = ({
  children,
  titulo = "",
  subtitulo = "",
  showSearch = true,
  showCategories = true }) => {

  const { categorias, isLoading, isError } = useCategoriaManager({ filtro: '', limit: 50 })
  const [nombreBusqueda, setNombreBusqueda] = useState('')
  const nombreDebonce = useDebonce({ value: nombreBusqueda, delay: 300 })
  const [categoriaId, setCategoriaId] = useState(null)
  const { isConnected } = useSocketMesero()

  const {
    productos,
    isLoading: isLoadingProductos,
    productosEncontrados,
    isLoadingBusqueda,
    isErrorBusqueda,
    isErrorProducto } = useProductoManager({ filtro: categoriaId, nombre: nombreDebonce, activo: true, limit: 100 })

  //efecto para hacer scroll al cambiar de categoria
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [categoriaId])

  // Establecer categoría por defecto
  useEffect(() => {
    if (categorias.length > 0 && !categoriaId) {
      setCategoriaId(categorias[0].id)
    }
  }, [categorias, categoriaId])

  const productosAmostrar = productosEncontrados?.length > 0 ? productosEncontrados : productos

  if (isErrorProducto || isErrorBusqueda) {
    return (
      <ErrorMessage mensaje='Error al cargar los productos.'
        titulo='Error al solicitar los productos'
        onRetry={() => window.location.reload()}
      />
    )
  }
  if (isError) {
    return (
      <ErrorMessage mensaje='Error al cargar las categorías.'
        titulo='Error al solicitar las categorías'
        onRetry={() => window.location.reload()}
      />
    )
  }

  return (
    <div className="min-h-dvh bg-gray-50 pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{titulo} {isConnected ?
              <div className="rounded-full h-3 w-3 bg-green-500 inline-block ml-2"></div> :
              <div className="rounded-full h-3 w-3 bg-red-500 inline-block ml-2"></div>}
            </h1>
            <p className="text-sm text-gray-600">
              {subtitulo}
            </p>
          </div>
        </div>

        {/* Barra de búsqueda */}
        {showSearch && (
          <div className='relative flex items-center space-x-2 mb-3'>
            <Search className="absolute left-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder='Buscar producto...'
              value={nombreBusqueda}
              onChange={(e) => setNombreBusqueda(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     transition-all duration-200 outline-none"
              aria-label="Buscar productos"
            />
            {nombreBusqueda && (
              <BotonAccion
                label={'limpiar'}
                icon={X}
                variant='edit'
                onClick={() => setNombreBusqueda('')}
              />
            )}
          </div>
        )}
        {/* Filtros por categoría */}
        {showCategories && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Menu
              categorias={categorias}
              categoriaId={categoriaId}
              isLoading={isLoading}
              setCategoriaId={setCategoriaId}
            />
          </div>
        )}
      </div>
      <div className="space-y-4 mt-4 ">
        {isLoadingProductos || isLoadingBusqueda ? (
          <SpinnerCargando
            texto="Cargando productos..."
            tamaño="lg"
          />
        ) : (
          productosAmostrar.map((producto, index) => (
            <motion.div
              key={producto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {children(producto)}
            </motion.div>
          ))
        )}
      </div>
    </div >
  )
}
