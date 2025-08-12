import { BrowserRouter, Route, Routes } from "react-router"
import DashLayout from "./dashboard/layout/dashLayout"
import UsuarioPage from "./usuario/page/UsuarioPage"

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashLayout />}>

        </Route>
        <Route path="/administracion" element={<UsuarioPage />} />
      </Routes>
    </BrowserRouter>
  )
}
