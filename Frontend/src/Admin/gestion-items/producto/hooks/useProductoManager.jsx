import { useModal } from "../../../../hooks/useModal"
import { useBusquedaProductoNombre, useCambiarEstadoProducto, useProductoEliminar, useProductoId, useProductoQuery } from "./useProductoQuery"

export const useProductoManager = ({ filtro, id, nombre }) => {
  const { anterior, siguiente, page, productoQuery } = useProductoQuery({ filtro })
  const productoBusqueda = useBusquedaProductoNombre(nombre)
  const modal = useModal()
  const { producto, isLoadingProducto: isLoadingProducto, isErrorProducto: isErrorProducto } = useProductoId(id)
  const eliminarProductoMutation = useProductoEliminar()
  const cambiarEstadoProductoMutation = useCambiarEstadoProducto()

  const eliminarProducto = (id) => {
    eliminarProductoMutation.mutate(id)
  }
  const cambiarEstadoProducto = (id, activo) => {
    cambiarEstadoProductoMutation.mutate({ id, activo })
  }

  return {
    productos: productoQuery?.data || [],
    isLoading: productoQuery.isLoading,
    isError: productoQuery.isError,
    page,
    modal,
    producto,
    isLoadingProducto,
    isErrorProducto,
    isEliminando: eliminarProductoMutation.isPending || cambiarEstadoProductoMutation.isPending,
    productosEncontrados: productoBusqueda.data,
    isLoadingBusqueda: productoBusqueda.isLoading,
    isErrorBusqueda: productoBusqueda.isError,
    anterior,
    siguiente,
    eliminarProducto,
    cambiarEstadoProducto
  }
}
