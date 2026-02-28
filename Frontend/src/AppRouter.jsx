import { Routes, Route, Navigate } from "react-router";
import { SideBarLayout } from "./sideBar/Layout/SideBarLayout";
import { UsuarioPage } from "./Admin/usuarios/page/UsuarioPage";
import { UsuarioLayout } from "./Admin/usuarios/layout/UsuarioLayout";
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
import { PedidosPageAdmin } from "./Admin/ajustes/page/PedidosPageAdmin";
import { PedidoDetallePage } from "./Admin/ajustes/page/PedidoDetallePage";
import { CajaPage } from "./Admin/cajero/page/CajaPage";
import { CajeroLayout } from "./Admin/cajero/layout/CajeroLayout";
import { VentaDetallePage } from "./Admin/cajero/page/VentaDetallePage";
import { NuevaReservaPage } from "./Admin/cajero/page/NuevaReservaPage";
import DashboardPage from "./Admin/dashboard/page/DashboardPage";

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
        <Route index element={<DashboardPage />} />
        <Route path="productos" element={<ProductoLayout />} >
          <Route index element={<ProductoPage />} />
          <Route path="nuevo" element={<NuevoProductoPage />} />
          <Route path="editar/:productoId" element={<EditarProductoPage />} />
        </Route>
        <Route path="categoria" element={<CategoriaLayout />} >
          <Route index element={<CategoriaPage />} />
        </Route>
        {/* Rutas para ajustes de la venta solo para admin  */}
        <Route path="ajustes-venta" >
          <Route index element={<PedidosPageAdmin />} />
          <Route path="pedido/:pedidoId" element={<PedidoDetallePage />} />
        </Route>
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
      {/* Rutas para cajero */}
      <Route path="cajero" element={
        <Rutaprotegida rolesPermitidos={['CAJERO']}>
          <CajeroLayout />
        </Rutaprotegida>
      }>
        <Route index element={<Navigate to="caja" replace />} />
        <Route path="caja" element={<CajaPage />} />
        <Route path="venta/:ventaId" element={<VentaDetallePage />} />
        <Route path="reserva" element={<NuevaReservaPage />} />
      </Route>

      <Route path="/autorizacion-restringida" element={<SinAutorizacion />} />
    </Routes>
  )
}
