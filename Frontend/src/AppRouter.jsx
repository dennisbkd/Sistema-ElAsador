import { Routes, Route, Navigate } from "react-router";
import { SideBarLayout } from "./sideBar/Layout/SideBarLayout";
import { UsuarioPage } from "./Admin/usuarios/page/UsuarioPage";
import { UsuarioLayout } from "./Admin/usuarios/layout/UsuarioLayout";
// import PuntoVentaUI from "./Admin/punto_de_Venta/PuntoVentaUI";
// import { PuntoVentaLayout } from "./Admin/punto_de_Venta/layout/puntoVentaLayout";
// import { PuntoVenta } from "./Admin/punto_de_Venta/page/PuntoVenta";
// import { ProductoProvider } from "./Admin/punto_de_Venta/context/productoProvider";
import { CategoriaPage } from "./Admin/gestion-items/categoria/page/CategoriaPage";
import { CategoriaLayout } from "./Admin/gestion-items/categoria/layout/CategoriaLayout";
import { ProductoPage } from "./Admin/gestion-items/producto/page/ProductoPage";
import { ProductoLayout } from "./Admin/gestion-items/producto/layouts/ProductoLayout";
import { NuevoProductoPage } from "./Admin/gestion-items/producto/page/NuevoProductoPage";
import { EditarProductoPage } from "./Admin/gestion-items/producto/page/EditarProductoPage";
import { SideBarMobileLayout } from "./sideBar/Layout/SideBarMobileLayout";
import { PedidosPage } from "./Admin/venta-Mobile/page/ListaPedidosMobilePage";
import { NuevaVentaMobilePage } from "./Admin/venta-Mobile/page/NuevaVentaMobilePage";
import { AgregarProductoOrdenPage } from "./Admin/venta-Mobile/page/AgregarProductoOrdenPage";
import { VisualizarPedido } from "./Admin/venta-Mobile/page/VisualizarPedido";
import { LoginPage } from "./Admin/auth/page/LoginPage";
import { SinAutorizacion } from "./Admin/auth/page/SinAutorizacion";
import { Rutaprotegida } from "./Admin/components/Rutaprotegida";
import NotificacionesPage from "./Admin/venta-Mobile/page/NotificacionPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={
        <Rutaprotegida rolesPermitidos={['ADMINISTRADOR']}>
          <SideBarLayout />
        </Rutaprotegida>}>
        <Route path="usuarios" element={<UsuarioLayout />} >
          <Route index element={<UsuarioPage />} />
        </Route>
        {/* <Route path="pedido" element={
          <ProductoProvider>
            <PuntoVentaLayout />
          </ProductoProvider>
        }>
          <Route path="listar" element={<PuntoVenta />} />
        </Route> */}
        {/* <Route path="punto-de-venta" element={<PuntoVentaUI />} /> */}
        <Route path="productos" element={<ProductoLayout />} >
          <Route index element={<ProductoPage />} />
          <Route path="nuevo" element={<NuevoProductoPage />} />
          <Route path="editar/:productoId" element={<EditarProductoPage />} />
        </Route>
        <Route path="categoria" element={<CategoriaLayout />} >
          <Route index element={<CategoriaPage />} />
        </Route>
        <Route path="venta-mobile" element={<SideBarMobileLayout />} />
      </Route>
      {/* Rutas para meseros */}
      <Route path="mesero" element={
        <Rutaprotegida rolesPermitidos={['MESERO']}>
          <SideBarMobileLayout />
        </Rutaprotegida>
      }>
        <Route index element={<Navigate to="nueva-orden" replace />} />
        <Route path="pedidos" element={<PedidosPage />} />
        <Route path="nueva-orden" element={<NuevaVentaMobilePage />} />
        <Route path="pedidos/:ventaId/agregar-producto" element={<AgregarProductoOrdenPage />} />
        <Route path="pedidos/:ventaId/visualizar-pedido" element={<VisualizarPedido />} />
        <Route path="notificaciones" element={<NotificacionesPage />} />
      </Route>
      <Route path="/autorizacion-restringida" element={<SinAutorizacion />} />
    </Routes>
  )
}
