import { LayoutDashboard, Archive, Tag, FileCog, HandCoins, UserCog } from "lucide-react";

export  const menuItems = [
    { title: "Dashboard", path: "/home", icon: LayoutDashboard, exact: true },
    {
      title: "Gestionar Usuarios",path: "/home/usuarios", icon: UserCog, key: "usuarios"
    },
    { 
      title: "Gestinar Pedidos", path:"/home/ajustes-venta", icon: FileCog, key:"ventas",
     },
    { 
      title: "Modo Cajero", path: "/cajero", icon: HandCoins, key: "cajero",
    },
    {
      title: "Gestión Producto", icon: Archive, key: "productos",
      subItems: [
        { title: "Productos", path: "/home/productos", icon: Archive },
        { title: "Categorías", path: "/home/categoria", icon: Tag }
      ]
    }
  ]