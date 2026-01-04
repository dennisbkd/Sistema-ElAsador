import { useMemo } from 'react'
import { useCreaProducto, useEditarProducto } from './useProductoQuery'
import z from 'zod'
import { construirFormDataProducto } from '../helper/formDataProducto'

export const useFormProducto = () => {
  const crearProductoMutation = useCreaProducto()
  const editarProductoMutation = useEditarProducto()

  const guardarProducto = (datos) => {
    crearProductoMutation.mutate({ data: datos })
  }
  const editarProducto = (datos, id) => {
    const data = construirFormDataProducto(datos)
    editarProductoMutation.mutate({ data, id })
  }


  const defaulValuesProducto = useMemo(() => ({
    defaultValues: {
      nombre: '',
      descripcion: '',
      precio: 0.00,
      imagen: null,
      esPreparado: true,
      categoriaId: '',
      stock: {
        cantidad: 0,
        cantidadMinima: 0
      }
    }
  }), [])

  const productoSquema = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    descripcion: z.string().optional(),
    precio: z.coerce.number().min(0, 'El precio no puede ser negativo'),
    imagen: z.any().optional().nullable(),
    esPreparado: z.boolean(),
    categoriaId: z.string().min(1, 'Debe seleccionar una categoría'),
    stock: z.object({
      cantidad: z.coerce.number({ invalid_type_error: 'La cantidad debe ser un numero' }).min(0, 'La cantidad no puede ser negativa'),
      cantidadMinima: z.coerce.number({ invalid_type_error: 'La cantidad minima debe ser un numero' }).min(0, 'La cantidad minima no puede ser negativa')
    })
  })

  return {
    defaulValuesProducto,
    productoSquema,
    guardandoProducto: crearProductoMutation.isPending || editarProductoMutation.isPending,
    guardarProducto,
    editarProducto
  }
}
