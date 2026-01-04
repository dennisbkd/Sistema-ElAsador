/* eslint-disable no-unused-vars */


import { useEffect } from 'react'

import { useAppForm } from '../../../../components/form'
import { useFormProducto } from '../hooks/useFormProducto'
import { useCategoriaManager } from '../../categoria/hooks/useCategoriaManager'
import { ArrowLeft, DollarSign, ImageIcon, Package, PieChart, Save, Tag } from 'lucide-react'
import { SpinnerCargando } from '../../../../ui/spinner/SpinnerCargando'
import { Link, useParams } from 'react-router'
import { useProductoManager } from '../hooks/useProductoManager'
import { BotonAccion } from '../../../../ui/boton/BotonAccion'
import { ErrorMessage } from '../../../../ui/ErrorMessage'

export const EditarProductoPage = () => {
  const productoId = useParams().productoId
  const { productoSquema, editarProducto, guardandoProducto } = useFormProducto()
  const { categorias, isLoading } = useCategoriaManager({ filtro: '', limit: 50 })
  const { producto, isLoadingProducto, isErrorProducto } = useProductoManager({ id: productoId })

  const form = useAppForm({
    defaultValues: {
      nombre: producto?.nombre || '',
      descripcion: producto?.descripcion || '',
      precio: producto?.precio || 0.00,
      imagen: producto?.imagen || null,
      esPreparado: producto?.esPreparado || true,
      categoriaId: producto?.categoria?.id ? String(producto.categoria.id) : '',
      stock: {
        cantidad: producto?.stock?.cantidad || 0,
        cantidadMinima: producto?.stock?.cantidadMinima || 0
      }
    },
    validators: {
      onChange: productoSquema
    },
    onSubmit: ({ value }) => {
      editarProducto(value, productoId),
        form.reset()
    }
  })
  useEffect(() => {
    if (producto) {
      form.reset({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: Number(producto.precio),
        imagen: producto.imagen, // URL string
        esPreparado: producto.esPreparado,
        categoriaId: String(producto.categoria.id),
        stock: {
          cantidad: producto.stock.cantidad,
          cantidadMinima: producto.stock.cantidadMinima
        }
      })
    }
  }, [producto, form])
  if (isLoadingProducto) {
    return (
      <SpinnerCargando
        texto='Cargando producto...'
        tamaño='lg'
      />
    )
  }
  if (isErrorProducto) {
    return (
      <ErrorMessage
        mensaje='error al cargar el producto'
        titulo='Error al solicitar el producto'
        onRetry={() => window.location.reload()}
      />
    )
  }
  return (
    <>
      <div className='mb-4'>
        <Link to={'/home/productos'}>
          <BotonAccion
            label="Volver a Productos"
            variant='primary'
            icon={ArrowLeft}
          />
        </Link>
      </div>
      <div className="min-h-screen bg-gray-50 rounded-lg p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Nuevo Producto</h1>
                <p className="text-gray-600 mt-1">Completa la información del producto para agregarlo al inventario</p>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna izquierda - Información General */}
              <div className="lg:col-span-2 space-y-6">
                {/* Sección 1: Información General */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Información General</h2>
                  </div>

                  <div className="space-y-6">
                    <form.AppField
                      name='nombre'
                      children={(field) => (
                        <div className="space-y-2">
                          <field.TextField
                            label={'Nombre del Producto *'}
                            placeholder='Ej: Hamburguesa Clásica'
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                          <p className="text-xs text-gray-500">Nombre descriptivo del producto para los clientes</p>
                        </div>
                      )}
                    />

                    <form.AppField
                      name='descripcion'
                      children={(field) => (
                        <div className="space-y-2">
                          <field.TextField
                            label={'Descripción'}
                            placeholder='Describe las características del producto, ingredientes, etc.'
                          />
                          <p className="text-xs text-gray-500">Opcional, pero recomendado para información del cliente</p>
                        </div>
                      )}
                    />

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">¿El producto es preparado?</p>
                        <p className="text-sm text-gray-600">Marca esta opción si el producto requiere preparación</p>
                      </div>
                      <form.AppField
                        name='esPreparado'
                        children={(field) => (
                          <div className="flex items-center">
                            <label className="inline-flex items-center cursor-pointer">
                              <field.CheckBox />
                              <span className="ml-3 text-sm font-medium text-gray-900">
                                {field.value ? 'No' : 'Sí'}
                              </span>
                            </label>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Sección 2: Precio y Stock */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Precio y Stock</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <form.AppField
                      name='precio'
                      children={(field) => (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Precio (BOB) *
                          </label>
                          <div className="relative">
                            <field.TextField
                              type='number'
                              min="0"
                              step="0.01"
                              placeholder='0.00'
                            />
                          </div>
                          <p className="text-xs text-gray-500">Precio de venta al público</p>
                        </div>
                      )}
                    />

                    <form.AppField
                      name='stock.cantidad'
                      children={(field) => (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Stock Actual *
                          </label>
                          <field.TextField
                            type='number'
                            min="0"
                            placeholder='0'
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                          <p className="text-xs text-gray-500">Cantidad disponible en inventario</p>
                        </div>
                      )}
                    />

                    <form.AppField
                      name='stock.cantidadMinima'
                      children={(field) => (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Stock Mínimo *
                          </label>
                          <field.TextField
                            type='number'
                            min="0"
                            placeholder='0'
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                          <p className="text-xs text-gray-500">Se alertará cuando el stock llegue a este nivel</p>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Columna derecha - Imagen y Categoría */}
              <div className="space-y-6">
                {/* Sección 3: Imagen */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <ImageIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Imagen del Producto</h2>
                  </div>

                  <div className="space-y-4">
                    <form.AppField
                      name='imagen'
                      children={(field) => (
                        <field.InputImage
                          label=""
                          placeholder='Haz clic para subir una imagen'
                          maxSizeMB={10}
                          previewHeight="h-48"
                          previewWidth="w-full"
                        />
                      )}
                    />
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• Formatos: JPG, PNG, GIF, WebP</p>
                      <p>• Tamaño máximo: 10MB</p>
                      <p>• Resolución recomendada: 800x800px</p>
                    </div>
                  </div>
                </div>

                {/* Sección 4: Categoría */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Tag className="h-5 w-5 text-amber-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Categoría</h2>
                  </div>
                  {isLoading && (
                    <SpinnerCargando
                      tamaño='sm'
                      texto='cargando categorias...'
                    />
                  )}
                  <div className="space-y-4">
                    <form.AppField
                      name='categoriaId'
                      children={(field) => (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Categoría *
                          </label>
                          <field.SelectField
                            placeholder='Selecciona una categoría'
                            options={categorias.map(categoria => ({
                              label: categoria.nombre,
                              value: String(categoria.id),
                            }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                          <p className="text-xs text-gray-500">Organiza tus productos por categorías</p>
                        </div>
                      )}
                    />

                    {/* Estadísticas de categorías */}
                    {categorias.length > 0 && (
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <PieChart className="h-4 w-4 text-gray-500" />
                          <p className="text-sm font-medium text-gray-900">Resumen de categorías</p>
                        </div>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">{categorias.length}</span> categorías disponibles
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de guardar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Antes de guardar, verifica que toda la información sea correcta.</p>
                  <p className="mt-1">Los campos marcados con * son obligatorios.</p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => form.reset()}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Limpiar
                  </button>
                  <form.AppForm>
                    <form.BotonSubmit
                      isLoading={guardandoProducto}
                      icon={Save}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Guardar Producto
                    </form.BotonSubmit>
                  </form.AppForm>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}