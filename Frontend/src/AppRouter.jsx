import { BrowserRouter, Route, Routes } from "react-router"
import UsuarioPage from "./usuario/page/UsuarioPage"
import { AdministracionLayout } from "./admin/layout/AdministracionLayout"
import UsuarioLayout from "./usuario/layouts/UsuarioLayout"


export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdministracionLayout />}>
          <Route path="usuario" element={<UsuarioLayout />} >
            <Route index element={<UsuarioPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
