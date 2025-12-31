import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { crearCategoria, editarCategoria, eliminarCategoria, obtenerCategorias } from "../api/categoriaApi"
import toast from "react-hot-toast"


export const useCategoriaQuery = ({ filtro }) => {
  const [page, setPage] = useState(1)
  const categoriaQuery = useQuery({
    queryKey: ['categorias', { page, filtro }],
    queryFn: () => obtenerCategorias({ page, filtro }),
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
  const siguiente = () => {
    if (categoriaQuery.data?.length === 0) {
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
    categoriaQuery,
    page,
    siguiente,
    anterior
  }
}

export const useCategoriaCrear = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['crear-categoria'],
    mutationFn: (data) => crearCategoria({ data }),
    onSuccess: (data) => {
      toast.success(`La categoria ${data.nombre} fue creada con éxito`)
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Error al crear la categoria')
    }
  })
}

export const useCategoriaEditar = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['editar-categoria'],
    mutationFn: ({ id, data }) => editarCategoria({ id, data }),
    onSuccess: () => {
      toast.success('Categoria editada con éxito')
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    }
  })
}

export const useCategoriaEliminar = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['eliminar-categoria'],
    mutationFn: ({ id }) => eliminarCategoria({ id }),
    onSuccess: () => {
      toast.success('Categoria eliminada con éxito')
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Error al eliminar la categoria')
    }
  })
}