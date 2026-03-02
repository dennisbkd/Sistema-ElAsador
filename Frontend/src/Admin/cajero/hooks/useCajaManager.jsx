import React from 'react'
import { useAsignarMeseroAPedido, useCajaQueryAbrir } from './useCajaQuery'

export const useCajaManager = () => {
  const abrirCajaMutation = useCajaQueryAbrir()
  const asignarReservaAMesero = useAsignarMeseroAPedido()

  const abrirCaja = (montoInicial) => {
    return abrirCajaMutation.mutate({ montoInicial })
  }

  const asignarMeseroPedido = ({ ventaId, usuarioId, nroMesa }) => {
    return asignarReservaAMesero.mutate({ ventaId, body: { usuarioId, nroMesa } })
  }

  return {
    abrirCaja,
    isPending: abrirCajaMutation.isPending || asignarReservaAMesero.isPending,
    asignarMeseroPedido
  }
}
