import React from 'react'
import { useCajaQueryAbrir } from './useCajaQuery'

export const useCajaManager = () => {
  const abrirCajaMutation = useCajaQueryAbrir()

  const abrirCaja = (montoInicial) => {
    return abrirCajaMutation.mutate({ montoInicial })
  }

  return {
    abrirCaja,
    isPending: abrirCajaMutation.isPending
  }
}
