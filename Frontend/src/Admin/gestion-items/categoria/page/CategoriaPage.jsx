/* eslint-disable no-unused-vars */
import { useCategoriaManager } from "../hooks/useCategoriaManager"
import { TablaCategoria } from "../components/TablaCategoria"
import { BotonPaginacion } from "../../../../components/BotonPaginacion"
import { useAppForm } from "../../../../components/form"
import { useFormCategoria } from "../hooks/useFormCategoria"
import { Plus, Save } from "lucide-react"
import { ModalEliminar } from "../../../../components/modal/ModalEliminar"
import { iconosCategoria } from "../utils/iconos"
import { SpinnerCargando } from "../../../../ui/spinner/SpinnerCargando"
import { ErrorMessage } from "../../../../ui/ErrorMessage"


export const CategoriaPage = () => {

  const {
    categorias,
    page,
    modalEliminar,
    isLoading,
    isError,
    anterior,
    siguiente,
    isEliminando,
    eliminarCategoria
  } = useCategoriaManager({ filtro: '' })

  const {
    valoresPorDefecto,
    data,
    setData,
    categoriaEsquema,
    editarcategoria,
    guardarCategoria
  } = useFormCategoria()

  const form = useAppForm({
    defaultValues: valoresPorDefecto.defaulValues,
    validators: {
      onChange: categoriaEsquema,
    },
    onSubmit: ({ value }) => {
      guardarCategoria(value),
        form.reset()
    }
  })
  const cerrarModal = () => {
    eliminarCategoria(modalEliminar.data)
    modalEliminar.cerrar()
    setData(null)
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

  if (isError) {
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* COLUMNA IZQUIERDA (LISTA) */}
      <div className="lg:col-span-2 space-y-4">

        {/* Card Lista */}
        <div className="overflow-hidden">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Lista de Categorías
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {categorias.length} categorías encontradas
            </p>
          </div>

          <div className="overflow-x-auto min-h-[490px]">
            <TablaCategoria
              categorias={categorias}
              editar={editarcategoria}
              eliminar={modalEliminar.abrir}
            />
          </div>
        </div>

        {/* Paginación */}
        <div className="flex justify-center">
          <BotonPaginacion
            anterior={anterior}
            siguiente={siguiente}
            pagina={page}
          />
        </div>
      </div>

      {/* COLUMNA DERECHA (FORMULARIO) */}
      <div className="sm:col-span-1 mt-0 lg:mt-16">
        <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Plus className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Nueva Categoría
            </h2>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            <form.AppField
              name="nombre"
              children={(field) => (
                <field.TextField
                  label="Nombre de la categoría"
                  placeholder="Sopas y Entradas..."
                />
              )}
            />
            <p className="text-xs text-gray-500">
              Ingrese un nombre descriptivo para la categoría
            </p>

            <form.AppField
              name="tipo"
              children={(field) => (
                <field.TextField
                  label="Tipo de categoría"
                  placeholder="Ej: Bebidas, Comidas..."
                />
              )}
            />
            <p className="text-xs text-gray-500">
              Especifique el tipo general de productos
            </p>

            <h1 className="text-xs font-bold">
              Seleccione un ícono representativo para la categoría
            </h1>
            <form.AppField
              name="icono"
              children={(field) => (
                <field.SelectIcon iconos={iconosCategoria} />
              )}
            />


            <form.AppForm>
              <div className="flex justify-end mt-6">
                {/* Activar boton de cancelar cuando solo se tenga que editar */}
                {data && (
                  <button
                    type="button"
                    onClick={() => {
                      form.reset();
                      setData(null)
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors mr-2"
                  >
                    Cancelar
                  </button>
                )}

                <form.BotonSubmit icon={Save}>
                  Guardar
                </form.BotonSubmit>
              </div>
            </form.AppForm>
          </form>
        </div>
      </div>

      <ModalEliminar
        isLoading={isEliminando}
        abrir={modalEliminar.isOpen}
        cerrar={modalEliminar.cerrar}
        tipo={`categoría ID#${modalEliminar.data}`}
        confirmarEliminar={cerrarModal}
      />
    </div >
  )
}
