import { useMemo } from "react"
import { useModal } from "../../../hooks/useModal";
import { useCrearUsuario, useEditarUsuario } from "./useUsuarioQuery";
import z from "zod";

export const useFormUsuario = () => {
  const modal = useModal()
  const mutationCrear = useCrearUsuario()
  const mutationEditar = useEditarUsuario()

  const guardarUsuario = (datos) => {
    if (modal.data) {
      // editar
      if (modal.data.password === '' || !datos.password) {
        delete datos.password
      }
      mutationEditar.mutate({ id: modal.data.id, data: datos })
    } else {
      // crear
      mutationCrear.mutate(datos)
    }
  }

  const usuarioEsquema = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    usuario: z.string().min(4, 'El usuario debe tener al menos 4 caracteres'),
    rol: z.string().min(1, 'El rol es obligatorio'),
    password: modal.data
      ? z.string().min(0).optional()
      : z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
  })

  const configuracionFormulario = useMemo(() => ({
    defaultValues: {
      nombre: modal.data?.nombre || '',
      usuario: modal.data?.usuario || '',
      rol: modal.data?.rol || '',
      password: '',
    }
  }), [modal.data])

  return {
    modal,
    guardarUsuario,
    configuracionFormulario,
    usuarioEsquema
  }
}
