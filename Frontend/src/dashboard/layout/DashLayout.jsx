import { useState } from "react"
import { ChefHat, HandCoins, HandPlatter, LayoutDashboard, ShieldUser, Flame } from "lucide-react";

import { Navegacion } from "../components/Navegacion";

const DashLayout = () => {
  const [visualizar, setVisualizar] = useState(true)

  const paths = [
    { id: 1, nombre: 'Menu', icon: LayoutDashboard },
    { id: 2, nombre: 'Administracion', icon: ShieldUser },
    { id: 3, nombre: 'Cajero', icon: HandCoins },
    { id: 4, nombre: 'Cocinero', icon: ChefHat },
    { id: 5, nombre: 'Mesero', icon: HandPlatter },
  ]

  const mostrarBarra = () => {
    setVisualizar(!visualizar)
  }


  return (
    <div className="bg-slate-50 w-2xs h-dvh text-slate-900 ">
      <div className="justify-items-center text-3xl py-8">
        <Flame className="text-slate-900 w-10 h-10" />
        <h1>El Asador</h1>
      </div>
      <nav >
        {visualizar ? (
          <ul >
            {paths.map(link =>
              (<Navegacion key={link.id} {...link} />)
            )}
          </ul>
        ) : (<div onClick={mostrarBarra} className="text-xl">Mostrar</div>)}
      </nav>
    </div>

  )
}

export default DashLayout