// components/ProductosGrid.jsx
import { ProductoCardReserva } from "./ProductoCardReserva"
import { Package } from "lucide-react"
import { useDebonce } from "../../../gestion-items/producto/hooks/useDebonce"
import { useProductoManager } from "../../../gestion-items/producto/hooks/useProductoManager"
import { SpinnerCargando } from "../../../../ui/spinner/SpinnerCargando"

export const ProductosGrid = ({
  categoriaId,
  nombreBusqueda,
  onAgregarProducto,
  getCantidad,
  getObservacion,
  actualizarObservacion
}) => {
  const nombreDebonce = useDebonce({ value: nombreBusqueda, delay: 300 })

  const {
    productos,
    isLoading: isLoadingProductos,
    productosEncontrados,
    isLoadingBusqueda
  } = useProductoManager({
    filtro: categoriaId,
    nombre: nombreDebonce,
    activo: true,
    limit: 50
  })
  const productosAMostrar = productosEncontrados?.length > 0 ? productosEncontrados : productos

  if (isLoadingProductos || isLoadingBusqueda) {
    return (
      <div className="py-12">
        <SpinnerCargando texto="Cargando productos..." tamaño="lg" />
      </div>
    )
  }

  if (productosAMostrar.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
        <p className="text-gray-600">Intenta con otra búsqueda o selecciona otra categoría</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {productosAMostrar.map((producto) => (
        <ProductoCardReserva
          key={producto.id}
          producto={producto}
          onAgregar={onAgregarProducto}
          cantidad={getCantidad(producto.id)}
          observacion={getObservacion(producto.id)}
          actualizarObservacion={actualizarObservacion}
        />
      ))}
    </div>
  )
}