import { Routes, Route } from "react-router";
import { SideBarLayout } from "./sideBar/Layout/SideBarLayout";
import { UsuarioPage } from "./Admin/usuarios/page/UsuarioPage";
import { UsuarioLayout } from "./Admin/usuarios/layout/UsuarioLayout";
export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/home" element={<SideBarLayout />}>
        <Route path="usuarios" element={<UsuarioLayout />}>
          <Route index element={<UsuarioPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
