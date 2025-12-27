import { CircleQuestionMark, Coins, HandPlatter, ShieldUser, Users } from "lucide-react"

const estilosPorRol = {
  administrador: {
    borde: "border-l-red-700",
    ColorIcono: "text-red-200",
    Icono: ShieldUser
  },
  mesero: {
    borde: "border-l-violet-700",
    ColorIcono: "text-violet-200",
    Icono: HandPlatter
  },
  cajero: {
    borde: "border-l-orange-700",
    ColorIcono: "text-orange-200",
    Icono: Coins
  },
  default: {
    borde: "border-l-gray-700",
    ColorIcono: "text-gray-200",
    Icono: CircleQuestionMark
  }
}

export const CardContador = ({ titulo = "Mesero", cantidad = 5 }) => {
  const rol = titulo.toLowerCase()
  const estilos = estilosPorRol[rol] || estilosPorRol.default
  const Icon = estilos.Icono
  return (
    <div className={`relative border overflow-hidden bg-white border-gray-300 border-l-8 ${estilos.borde} rounded-md shadow-xs`}>
      <Icon className={`absolute z-0 opacity-30  ${estilos.ColorIcono}`} size={120} />
      <div className="flex justify-between p-4 z-10">
        <p className="font-bold">{titulo}</p>
        <h2 className={`font-medium text-6xl`}>{cantidad}</h2>
      </div>
    </div>
  )
}
