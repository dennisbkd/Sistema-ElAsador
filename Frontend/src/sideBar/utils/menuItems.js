import { LayoutDashboard, UserCheck, Users, ShoppingCart, ClipboardPenLine, ClipboardList, Warehouse, Archive, Tag } from "lucide-react";

export  const menuItems = [
    { title: "Dashboard", path: "/home", icon: LayoutDashboard, exact: true },
    {
      title: "Gestión Usuarios", icon: UserCheck, key: "usuarios",
      subItems: [
        { title: "Usuarios", path: "/home/usuarios", icon: Users }
      ]
    },
    { title: "Gestión Ventas", icon: ShoppingCart, key:"ventas",
      subItems:[
        {title: "Realizar Pedidos", path: "/home/pedido/listar", icon: ClipboardPenLine},
        {title: "Ver Pedidos", path:"/home/pedido/ver-pedidos", icon: ClipboardList}
      ]
     },
    { title: "Gestión Inventario", path: "/home/inventario", icon: Warehouse },
    {
      title: "Gestión Producto", icon: Archive, key: "productos",
      subItems: [
        { title: "Productos", path: "/home/productos", icon: Archive },
        { title: "Categorías", path: "/home/categorias", icon: Tag }
      ]
    }
  ]