import z from "zod"
import { useCategoriaCrear, useCategoriaEditar } from "./useCategoriaQuery"
import { useMemo, useState } from "react"

export const useFormCategoria = () => {
  const [data, setData] = useState(null)
  const crearCtgMutation = useCategoriaCrear()
  const editarCtgMutation = useCategoriaEditar()

  const guardarCategoria = (datos) => {
    //limpiar datos
    console.log('datos', datos)
    console.log('data', data)
    const trimDatos = {
      nombre: datos.nombre.trim(),
      tipo: datos.tipo.trim().toUpperCase(),
      icono: datos.icono
    }
    if (data?.id) {
      editarCtgMutation.mutate({ id: data.id, data: trimDatos })
      setData(null)
    } else {
      crearCtgMutation.mutate(trimDatos)
    }
  }
  const editarcategoria = (categoria) => {
    setData(categoria)
  }
  const categoriaEsquema = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    tipo: z.string().min(1, 'El tipo es obligatorio')
  })

  const valoresPorDefecto = useMemo(() => ({
    defaulValues: {
      id: data?.id || null,
      nombre: data?.nombre || '',
      tipo: data?.tipo || '',
      icono: data?.icono || 'Folder'
    }
  }), [data])

  return {
    guardarCategoria,
    categoriaEsquema,
    valoresPorDefecto,
    editarcategoria,
    data,
    setData
  }
}
