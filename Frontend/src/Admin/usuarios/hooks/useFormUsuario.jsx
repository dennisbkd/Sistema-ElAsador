import { useMemo } from "react"
import { useModal } from "../../../hooks/formulario/useModal"


export const useFormUsuario = () => {
  const modal = useModal()

  const guardarUsuario = (datos) => {
    console.log('Guardando usuario con datos:', datos)
    if (modal.data) {
      // editar
      console.log('Editando usuario:', modal.data)
    } else {
      // crear
      console.log('Creando nuevo usuario', modal.data)
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
