// import { useState } from "react"
import { LayoutDashboard, Flame, ChevronFirst, ChevronLast, Package, ClipboardList, Coins, Users, ShoppingCart, ChartNoAxesCombined } from "lucide-react";
import { SideBarItem } from "../components/sideBarItem";
import { useState } from "react";
import { SideBarContext } from "../context/sideBarContext";

export default function SideBar() {
  const [expandido, setExpandido] = useState(true)

  const paths = [
    { id: 1, nombre: 'dashboard', labels: 'Dashboard', icon: LayoutDashboard },
    { id: 2, nombre: 'venta', labels: 'Punto de Venta', icon: ShoppingCart },
    { id: 3, nombre: 'Pedidos', labels: 'Pedidos', icon: ClipboardList },
    { id: 4, nombre: 'caja', labels: 'Cierre de caja', icon: Coins },
    { id: 5, nombre: 'Inventario', labels: 'Inventario', icon: Package },
    { id: 6, nombre: 'usuario', labels: 'Usuarios', icon: Users },
    { id: 7, nombre: 'estadisticas', labels: 'Estadisticas', icon: ChartNoAxesCombined },
  ]




  return (
    <aside className="h-screen">
      <nav className="h-full inline-flex flex-col bg-white border-r-slate-200 shadow-sm">
        <div className={`flex h-40 justify-between items-center p-2 pb-2 ${expandido ? 'justify-center' : 'justify-start'}`}>
          <div
            className={`grid justify-items-center overflow-hidden mr-2 transition-all duration-500 ${expandido ?
              'w-32 opacity-100 blur-0' : 'w-0 opacity-0 blur-3xl'
              }`}>
            <Flame size={50} />
            <p className="text-lg font-semibold">El Asador</p>
          </div>
          <button onClick={() => setExpandido(!expandido)} className="p-1.5 bg-slate-100 rounded-lg hover:bg-slate-300 transition-all">
            {expandido ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <SideBarContext.Provider value={{ expandido }}>
          <ul className="flex flex-col gap-2 p-2">
            {paths.map(link =>
              <SideBarItem key={link.id} {...link} />
            )}
          </ul>
        </SideBarContext.Provider>
      </nav>
    </aside>
  );
}

