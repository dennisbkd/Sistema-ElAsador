/* eslint-disable no-unused-vars */

import { Modal } from "../../../components/modal/Modal"
import { CabeceraPage } from "../../../ui/cabecera/CabeceraPage"
import { UserIcon } from "lucide-react"
import { useFormUsuario } from "../hooks/useFormUsuario"
import { FormProvider } from "../../../components/form/FormProvider"


export const UsuarioPage = () => {

  const { configuracionFormulario, guardarUsuario, modal } = useFormUsuario()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <CabeceraPage
          titulo={'Gestión de Usuarios'}
          subtitulo={'Administra los usuarios de la plataforma'}
          icono={UserIcon}
          className="bg-gray-100"

        />
        <Modal
          abierto={modal.isOpen}
          cambiarEstado={modal.setIsOpen}
          titulo={modal.data ? "Editar Usuario" : "Crear Usuario"}
        >
          <FormProvider
            defaultValues={configuracionFormulario.defaultValues}
            onClose={modal.close}
            isLoading={false}
            onSubmit={guardarUsuario}
          >
            {(form) => (
              <>
                <form.AppField
                  name="nombre"
                  children={(field) => <field.TextField label="Nombre" />}
                />
                <form.AppField
                  name="apellido"
                  children={(field) => <field.TextField label="Apellido" />}
                />
                <form.AppField
                  name="rol"
                  children={(field) => (
                    <field.SelectField
                      label="Rol de residencia"
                      options={[
                        { value: 'usuario', label: 'Usuario' },
                        { value: 'admin', label: 'Administrador' },
                      ]}
                      placeholder="Elige un rol..."
                    />
                  )}
                />
              </>
            )}
          </FormProvider>
        </Modal>
      </div>
    </div>
  )
}
