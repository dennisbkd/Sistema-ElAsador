import { BoxIcon } from "lucide-react"
import { CabeceraPage } from "../../../../ui/cabecera/CabeceraPage"
import { Outlet } from "react-router"

export const ProductoLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <CabeceraPage
          titulo={'Gestión de Productos'}
          subtitulo={'Administra las propiedades para los productos'}
          icono={BoxIcon}
        />
        <Outlet />
      </div>
    </div >
  )
}
