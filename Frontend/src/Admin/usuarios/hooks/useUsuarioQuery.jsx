import { useMutation, useQuery } from "@tanstack/react-query";
import { ObtenerUsuarios } from "../api/usuarioApi";

export const useUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: ObtenerUsuarios,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

export const useCrearUsuario = () => {
  return useMutation({
    mutationKey: ['crear-usuario'],
    mutationFn: (data) => console.log(data)
  })
}
