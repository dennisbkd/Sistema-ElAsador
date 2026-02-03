import React from 'react'
import { useAjusteVentaId } from './useAjustesQuery'

export const useAjusteVentaIdManager = (ventaId) => {
  const { isError, isLoading, venta } = useAjusteVentaId(ventaId)


  return {
    venta,
    isLoading,
    isError
  }
}
