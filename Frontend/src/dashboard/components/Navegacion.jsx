import { NavLink } from "react-router";

export const Navegacion = ({ icon, nombre }) => {
  const Icon = icon
  return (
    <li className="m-3" >
      <NavLink
        to={`/dashboard/${nombre}`}
        className="group flex w-4/5 items-center justify-start p-3 rounded-xl shadow hover:shadow-md hover:bg-slate-900 transition-all"
      >
        <Icon className="text-slate-900  w-5 h-5 transition-colors group-hover:text-slate-300" />
        <h2 className="mx-2 text-slate-900 transition-colors group-hover:text-slate-300">
          {nombre}
        </h2>
      </NavLink>
    </li>
  )
}
