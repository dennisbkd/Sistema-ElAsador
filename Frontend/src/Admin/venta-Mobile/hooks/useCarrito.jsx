import { useCallback, useState } from 'react'

export const useCarrito = () => {
  const [carrito, setCarrito] = useState({})

  const agregarProducto = useCallback((producto, cantidad) => {
    setCarrito(carritoAnterior => {
      if (cantidad <= 0) {
        const nuevoCarrito = { ...carritoAnterior }
        delete nuevoCarrito[producto.id]
        return nuevoCarrito
      }
      const stockDisponible = producto.stock?.cantidad || 0
      const cantidadFinal = Math.min(cantidad, stockDisponible)

      if (cantidadFinal <= 0) {
        const nuevoCarrito = { ...carritoAnterior }
        delete nuevoCarrito[producto.id]
        return nuevoCarrito
      }
      const observacionesFinal = producto.esPreparado ? producto.observaciones || '' : ''

      return {
        ...carritoAnterior,
        [producto.id]: {
          producto,
          cantidad: cantidadFinal,
          observaciones: observacionesFinal
        }
      }
    })
  }, [])

  const actualizarObservacion = useCallback((productoId, nuevaObservacion) => {
    setCarrito(carritoAnterior => {
      const item = carritoAnterior[productoId]
      if (!item) return carritoAnterior
      const observacionFinal = item.producto.esPreparado ? nuevaObservacion || '' : ''
      return {
        ...carritoAnterior,
        [productoId]: {
          ...item,
          observaciones: observacionFinal
        }
      }
    })
  }, [])

  const removerProducto = useCallback((productoId) => {
    setCarrito(carritoAnterior => {
      const nuevoCarrito = { ...carritoAnterior }
      delete nuevoCarrito[productoId]
      return nuevoCarrito
    })
  }, [])

  const limpiarCarrito = useCallback(() => {
    setCarrito({})
  }, [])

  const totalItems = Object.values(carrito).reduce((sum, item) => {
    return sum + item.cantidad
  }, 0)

  const estaVacio = Object.keys(carrito).length === 0

  const getCantidad = useCallback((productoId) => {
    return carrito[productoId]?.cantidad || 0
  }, [carrito])

  const getObservacion = useCallback((productoId) => {
    return carrito[productoId]?.observaciones || ''
  }, [carrito])

  const getDatosBackend = useCallback(() => {
    return Object.values(carrito).map(item => ({
      productoId: item.producto.id,
      cantidad: item.cantidad,
      observaciones: item.observaciones || ''
    }))
  }, [carrito])

  return {
    agregarProducto,
    removerProducto,
    limpiarCarrito,
    getCantidad,
    actualizarObservacion,
    getDatosBackend,
    getObservacion,
    totalItems,
    estaVacio,
    carrito
  }
}
