/* eslint-disable no-unused-vars */



import { Modal } from "../../../components/modal/Modal"
import { Plus, Save, UserIcon } from "lucide-react"
import { useFormUsuario } from "../hooks/useFormUsuario"
import { TablaUsuario } from "../components/TablaUsuario"
import { useAppForm } from "../../../components/form"
import { BotonAccion } from "../../../ui/boton/BotonAccion"
import { useUsuarioAdministrador } from "../hooks/useUsuarioAdministrador"
import { roles } from "../../../assets/rolesOpciones"
import { SpinnerCargando } from "../../../ui/spinner/SpinnerCargando"
import { ErrorMessage } from "../../../ui/ErrorMessage"



export const UsuarioPage = () => {

  const { configuracionFormulario, guardarUsuario, modal } = useFormUsuario()
  const { usuarios, error, isLoading, cambiarEstadoUsuario, estaCambiandoEstado } = useUsuarioAdministrador()


  const form = useAppForm({
    defaultValues: configuracionFormulario.defaultValues,
    onSubmit: ({ value }) => {
      guardarUsuario(value)
      modal.cerrar()
    }
  })

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8">
        <SpinnerCargando
          tamaño="lg"
          texto="Cargando Los Usuarios..."
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8">
        <ErrorMessage
          mensaje="Ha ocurrido un error al cargar los usuarios. Inténtalo de nuevo."
          titulo="Error al cargar usuarios"
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 ">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-end mb-2">
          <BotonAccion
            onClick={() => modal.abrir()}
            icon={Plus}
            label="Nuevo Usuario"
            variant="primary"

          />
        </div>

        <TablaUsuario
          usuarios={usuarios}
          editar={modal.abrir}
          cambiarEstado={cambiarEstadoUsuario}
          isLoading={estaCambiandoEstado}
        />

        <Modal
          abierto={modal.isOpen}
          cambiarEstado={modal.cerrar}
          titulo={modal.data ? "Editar Usuario" : "Crear Usuario"}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            <form.AppField name="nombre"
              children={(field) => <field.TextField label="Nombre" placeholder="Ej: Maria Gonzales" />}
            />
            <form.AppField name="usuario"
              children={(field) => <field.TextField label="Usuario" placeholder="Ej: maria.gonzales" />}

            />
            <form.AppField name="password"
              children={(field) => <field.TextField type="password" label="Contraseña"
                placeholder={modal.data ? "Dejar vacío para mantener la actual" : "Mínimo 6 caracteres"} />}
            />
            <form.AppField name="rol"
              children={(field) => <field.SelectField options={roles} label="Rol" />}
            />
            <form.AppForm >
              <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
                <form.BotonSubmit type="button" variant="secondary" onClick={modal.cerrar}>Cancelar</form.BotonSubmit>
                <form.BotonSubmit icon={Save}>Guardar</form.BotonSubmit>
              </div>
            </form.AppForm>
          </form>
        </Modal>
      </div>
    </div>
  )
}
