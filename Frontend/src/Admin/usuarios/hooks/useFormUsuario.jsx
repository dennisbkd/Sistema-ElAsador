import { useMemo } from "react"
import { useModal } from "../../../hooks/useModal";
import { useCrearUsuario, useEditarUsuario } from "./useUsuarioQuery";


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
  const configuracionFormulario = useMemo(() => ({
    defaultValues: {
      nombre: modal.data?.nombre || '',
      usuario: modal.data?.usuario || '',
      rol: modal.data?.rol || ''
    }
  }), [modal.data])

  return {
    modal,
    guardarUsuario,
    configuracionFormulario
  }
}
