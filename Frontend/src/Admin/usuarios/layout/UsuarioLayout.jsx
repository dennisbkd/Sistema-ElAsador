
import { Outlet } from 'react-router'
import { CabeceraPage } from '../../../ui/cabecera/CabeceraPage'
import { Users } from 'lucide-react'

export const UsuarioLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <CabeceraPage
          titulo={'Gestión de Usuarios'}
          subtitulo={'Administra los usuarios de la plataforma'}
          icono={Users}
        />
        <Outlet />
      </div>
    </div>
  )
}
