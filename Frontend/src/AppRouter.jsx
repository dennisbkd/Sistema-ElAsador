import { Routes, Route } from "react-router";
import { SideBarLayout } from "./sideBar/Layout/SideBarLayout";
import { UsuarioPage } from "./Admin/usuarios/page/UsuarioPage";
import { UsuarioLayout } from "./Admin/usuarios/layout/UsuarioLayout";
import PuntoVentaUI from "./Admin/punto_de_Venta/PuntoVentaUI";
import { PuntoVentaLayout } from "./Admin/punto_de_Venta/layout/puntoVentaLayout";
import { PuntoVenta } from "./Admin/punto_de_Venta/page/PuntoVenta";
import { ProductoProvider } from "./Admin/punto_de_Venta/context/productoProvider";
import { CategoriaPage } from "./Admin/gestion-items/categoria/page/CategoriaPage";
import { CategoriaLayout } from "./Admin/gestion-items/categoria/layout/CategoriaLayout";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/home" element={<SideBarLayout />}>
        <Route path="usuarios" element={<UsuarioLayout />}>
          <Route index element={<UsuarioPage />} />
        </Route>
        <Route path="pedido" element={
          <ProductoProvider>
            <PuntoVentaLayout />
          </ProductoProvider>
        }>
          <Route path="listar" element={<PuntoVenta />} />
        </Route>
        <Route path="punto-de-venta" element={<PuntoVentaUI />} />
        <Route path="categoria" element={<CategoriaLayout />} >
          <Route index element={<CategoriaPage />} />
        </Route>
      </Route>

    </Routes>
  )
}
