import { useModal } from "../../../../hooks/useModal"
import { useCategoriaEliminar, useCategoriaQuery } from "./useCategoriaQuery"

export const useCategoriaManager = ({ filtro }) => {
  const modalEliminar = useModal()
  const { categoriaQuery, page, siguiente, anterior } = useCategoriaQuery({ filtro })
  const eliminarCategoriaMutation = useCategoriaEliminar()

  const eliminarCategoria = (id) => {
    eliminarCategoriaMutation.mutate({ id })
  }

  return {
    categorias: categoriaQuery?.data || [],
    isLoading: categoriaQuery.isLoading,
    error: categoriaQuery.error,
    page,
    modalEliminar,
    isError: categoriaQuery.isError,
    isEliminando: eliminarCategoriaMutation.isPending,
    eliminarCategoria,
    siguiente,
    anterior
  }
}
