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
import { CardContador } from "../../../components/CardContador"
import { useState } from "react"
import { ModalEliminar } from "../../../components/modal/ModalEliminar"
import { SelectOption } from "../../../components/SelectOption"
import { CardContadorSkeleton } from "../../../components/CardContadorSkeleton"



export const UsuarioPage = () => {
  const [filtroRol, setFiltroRol] = useState('')
  const { configuracionFormulario, guardarUsuario, modal, usuarioEsquema } = useFormUsuario()
  const {
    usuarios,
    error,
    isLoading,
    estaCambiandoEstado,
    page,
    totalUsuarios,
    errorTotal,
    isLoadingTotal,
    modalEliminar,
    eliminarUsuario,
    cambiarEstadoUsuario,
    siguiente,
    anterior,
  } = useUsuarioAdministrador({ rol: filtroRol })

  const form = useAppForm({
    defaultValues: configuracionFormulario.defaultValues,
    validators: {
      onChange: usuarioEsquema,
    },
    onSubmit: ({ value }) => {
      guardarUsuario(value)
      cerrarModal()
    }
  })
  const cerrarModal = () => {
    modal.cerrar()
    form.reset()
  }

  const eliminarUsuarioConfirmado = () => {
    eliminarUsuario(modalEliminar.data)
    modalEliminar.cerrar()
  }


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
        <div className="grid gap-4 grid-cols-3 mb-3 ">
          {isLoadingTotal ? (
            <CardContadorSkeleton />
          ) : (totalUsuarios.map(({ rol, cantidad }) => (
            <CardContador
              key={rol}
              cantidad={cantidad}
              titulo={rol}
            />)
          ))}
        </div>
        <div className="flex justify-between mb-2">
          <div className="flex items-center">
            <span className="font-semibold mr-2">Filtrar por rol: </span>
            <SelectOption
              props={{ className: 'w-38' }}
              value={filtroRol}
              placeholder="Filtrar por rol"
              options={[{ value: '', label: 'Todos' }, ...roles]}
              selectValue={setFiltroRol}
            />
          </div>
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
          eliminar={modalEliminar.abrir}
          isLoading={estaCambiandoEstado}
          page={page}
          anterior={anterior}
          siguiente={siguiente}
        />

        <ModalEliminar
          abrir={modalEliminar.isOpen}
          tipo={`usuario ID#${modalEliminar.data}`}
          cerrar={modalEliminar.cerrar}
          confirmarEliminar={eliminarUsuarioConfirmado}
        />

        <Modal
          abierto={modal.isOpen}
          cambiarEstado={cerrarModal}
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
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <form.BotonSubmit icon={Save}>Guardar</form.BotonSubmit>
              </div>
            </form.AppForm>
          </form>
        </Modal>
      </div>
    </div>
  )
}
