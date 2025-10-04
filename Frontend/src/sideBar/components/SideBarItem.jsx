
import { useContext } from "react";
import { NavLink } from "react-router";
import { SideBarContext } from "../context/sideBarContext";

export const SideBarItem = ({ icon, nombre, alerta, labels }) => {
  const Icon = icon
  const { expandido } = useContext(SideBarContext)
  alerta = false
  return (
    <li className={`relative bg-slate-100 flex items-center py-2 pl-5 my-1 
        font-medium rounded-md cursor-pointer
        transition-colors group hover:text-slate-100 hover:bg-slate-800 ${expandido ? 'pr-13' : 'pr-3'}`}>
      <NavLink to={`/${nombre.toLowerCase()}`}>
        <div className=" relative flex items-center">
          <Icon size={26} />
          <span className={`mx-2 text-slate-900 text-nowrap group-hover:text-slate-300 overflow-hidden transition-all duration-500
           ${expandido ? 'w-32 opacity-100 blur-0' : 'w-0 h-0 opacity-0 blur-3xl'}`}>
            {labels}
          </span>
        </div>
        {alerta && (
          <div className={`absolute w-1 h-1 p-1 right-2 bg-slate-400 rounded-full
           ${expandido ? 'top-4' : 'animate-ping top-2'}`}>
          </div>
        )}
        {!expandido && (
          <div
            className={`absolute left-full top-2 text-nowrap rounded-md px-2 py-1 ml-6
             bg-slate-200 text-slate-900 text-sm invisible opacity-20 translate-x-3
             transition-all group-hover:opacity-100 group-hover:translate-x-0
             group-hover:visible`}
          >
            {labels}
          </div>
        )}
      </NavLink>
    </li>
  )
}
