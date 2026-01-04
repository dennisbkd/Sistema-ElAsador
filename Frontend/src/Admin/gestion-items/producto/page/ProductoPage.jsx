import React, { useEffect, useState } from 'react'
import { useProductoManager } from '../hooks/useProductoManager'
import { Link } from 'react-router'
import { useCategoriaManager } from '../../categoria/hooks/useCategoriaManager'
import { Menu } from '../components/Menu'
import { BotonAccion } from '../../../../ui/boton/BotonAccion'
import { PackageSearch, Plus, Search, X } from 'lucide-react'
import { CardProducto } from '../components/CardProducto'
import { motion } from 'motion/react'
import { ModalEliminar } from '../../../../components/modal/ModalEliminar'
import { SpinnerCargando } from '../../../../ui/spinner/SpinnerCargando'
import { ErrorMessage } from '../../../../ui/ErrorMessage'
import { useDebonce } from '../hooks/useDebonce'


export const ProductoPage = () => {
  const { categorias, isLoading } = useCategoriaManager({ filtro: '', limit: 20 })
  const [categoriaId, setCategoriaId] = useState(null)
  const [nombreBusqueda, setNombreBusqueda] = useState('')
  const nombreDebonce = useDebonce({ value: nombreBusqueda, delay: 500 })

  useEffect(() => {
    if (categorias.length > 0 && !categoriaId) {
      setCategoriaId(categorias[0].id)
    }
  }, [categorias, categoriaId])

  const {
    productos,
    isLoadingProducto,
    isErrorProducto,
    isEliminando,
    eliminarProducto,
    cambiarEstadoProducto,
    modal,
    productosEncontrados,
    isErrorBusqueda,
    isLoadingBusqueda } = useProductoManager({ filtro: categoriaId, nombre: nombreDebonce })

  const cerrarModal = () => {
    eliminarProducto(modal.data?.id)
    modal.cerrar()
  }

  const cambiarCategoria = (id) => {
    setCategoriaId(id)
    setNombreBusqueda('')
  }

  if (isLoadingProducto || isLoadingBusqueda) {
    return (
      <SpinnerCargando
        tamaño='lg'
        texto='Cargando los productos...'
      />
    )
  }
  if (isErrorProducto || isErrorBusqueda) {
    return (
      <ErrorMessage mensaje='Error al cargar los productos.'
        titulo='Error al solicitar los productos'
        onRetry={() => window.location.reload()}
      />
    )
  }

  const productosAMostrar = productosEncontrados && productosEncontrados.length > 0 ? productosEncontrados : productos
  return (
    <div className='grid gap-4'>
      <div className='flex items-center gap-4 mb-6 w-full'>
        <div className='relative flex items-center space-x-2'>
          <Search className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder='Buscar producto...'
            value={nombreBusqueda}
            onChange={(e) => setNombreBusqueda(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     transition-all duration-200 outline-none"
            aria-label="Buscar productos"
          />
          {nombreBusqueda && (
            <BotonAccion
              label={'limpiar'}
              icon={X}
              variant='edit'
              onClick={() => setNombreBusqueda('')}
            />
          )}
        </div>
        <Link to={'/home/productos/nuevo'}>
          <BotonAccion
            icon={Plus}
            label={"Agregar Producto"}
            className='bg-indigo-500'
          />
        </Link>
      </div>
      <Menu categorias={categorias}
        categoriaId={categoriaId}
        isLoading={isLoading}
        setCategoriaId={cambiarCategoria}
      />
      {/* Aquí iría la lista de productos filtrados por categoría */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {isLoadingProducto || isLoadingBusqueda ? (
          <SpinnerCargando
            tamaño='lg'
            texto='Cargando los productos...'
          />
        ) : (
          productosAMostrar.length === 0 ? (
            <div className='col-span-full grid justify-items-center mt-10  text-center text-gray-500'>
              <PackageSearch size={48} />
              <p>No se encontraron productos que coincidan con la búsqueda.</p>
            </div>
          ) : (<>
            {productosAMostrar.map((producto, index) => (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CardProducto
                  productos={producto}
                  isEliminando={isEliminando}
                  eliminarProducto={modal.abrir}
                  cambiarEstadoProducto={cambiarEstadoProducto}
                />
              </motion.div>
            ))}
          </>)
        )}
      </div>
      <ModalEliminar
        abrir={modal.isOpen}
        cerrar={modal.cerrar}
        confirmarEliminar={cerrarModal}
        tipo={'producto ' + modal.data?.nombre}
      />
    </div>

  )
}
