import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { busquedaProductoNombre, cambiarEstadoProducto, crearProducto, editarProducto, eliminarProducto, obtenerProductoId, obtenerProductos } from "../api/productoApi"
import { useEffect } from "react"
import toast from "react-hot-toast"

export const useProductoQuery = ({ filtro, activo }) => {
  const [page, setPage] = useState(1)
  const productoQuery = useQuery({
    queryKey: ["productos", { page, filtro, activo }],
    queryFn: () => obtenerProductos({ filtroCategoria: filtro, page, filtroActivo: activo }),
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
  const siguiente = () => {
    if (productoQuery.data?.length === 0) {
      return null
    }
    setPage((prev) => prev + 1)
  }
  const anterior = () => {
    if (page === 1) {
      return null
    }
    setPage((prev) => prev - 1)
  }
  useEffect(() => {
    setPage(1)
  }, [filtro])

  return {
    productoQuery,
    page,
    siguiente,
    anterior
  }
}
export const useProductoId = (id) => {
  const productoIdQuery = useQuery({
    queryKey: ['producto-id', id],
    queryFn: () => obtenerProductoId(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, //5 minutos
  })
  return {
    producto: productoIdQuery.data || null,
    isLoading: productoIdQuery.isLoading,
    isError: productoIdQuery.isError
  }
}

export const useCreaProducto = () => {
  const clientQuery = useQueryClient()
  return useMutation({
    mutationFn: ({ data }) => crearProducto({ data }),
    mutationKey: ['crear-producto'],
    onSuccess: () => {
      toast.success('Producto creado con exito')
      clientQuery.invalidateQueries({ queryKey: ['productos'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Error al crear el producto')
    }
  })
}

export const useEditarProducto = () => {
  const clientQuery = useQueryClient()
  return useMutation({
    mutationFn: ({ data, id }) => editarProducto({ data, id }),
    mutationKey: ['editar-producto'],
    onSuccess: () => {
      toast.success('Producto editado con exito')
      clientQuery.invalidateQueries({ queryKey: ['productos'] })
      clientQuery.invalidateQueries({ queryKey: ['producto-id'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Error al editar el producto')
    }
  })
}

export const useProductoEliminar = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => eliminarProducto(id),
    mutationKey: ['eliminar-producto'],
    onSuccess: () => {
      toast.success('Producto eliminado con exito')
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Error al eliminar el producto')
    }
  })
}

export const useBusquedaProductoNombre = (nombre) => {
  return useQuery({
    queryKey: ['busqueda-producto-nombre', nombre],
    queryFn: () => busquedaProductoNombre(nombre),
    enabled: !!nombre,
    staleTime: 1000 * 60 * 5, //5 minutos
  })
}

export const useCambiarEstadoProducto = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['cambiar-estado-producto'],
    mutationFn: ({ id, activo }) => cambiarEstadoProducto({ id, activo }),
    onSuccess: (data, variables) => {
      toast.success(variables.activo ? 'Producto activado con éxito' : 'Producto desactivado con éxito')
      queryClient.invalidateQueries({ queryKey: ['productos'], exact: false })
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Error al cambiar el estado del producto')
    }
  })
}