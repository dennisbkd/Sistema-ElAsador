import { useQuery } from "@tanstack/react-query"
import { ObtenerUsuarios } from "../api/usuarioPeticion"


export const useUsuario = () => {
  const query = useQuery({
    queryKey: ['obtener'],
    queryFn: ObtenerUsuarios,
    staleTime: 1000 * 60 * 60,
    placeholderData: {
      DtoUsuario: [
        {
          id: 1,
          usuario: "admin",
          nombre: "Admin Principal",
          activo: true,
          rol: "ADMIN",
          createdAt: "2025-09-11T08:48:04.000Z"
        }
      ],
      totales: {
        activos: 1,
        totalAdmin: 1
      }
    }
  })
  const { DtoUsuario = [], totales = {} } = query.data ?? {}

  return {
    query,
    DtoUsuario,
    totales
  }
}
