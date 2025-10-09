import { Routes, Route } from "react-router";
import { SideBarLayout } from "./sideBar/Layout/SideBarLayout";
import { UsuarioPage } from "./Admin/usuarios/page/UsuarioPage";
export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/home" element={<SideBarLayout />}>
        <Route path="usuarios" element={<UsuarioPage />} />
      </Route>
    </Routes>
  )
}
