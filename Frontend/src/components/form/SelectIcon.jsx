import * as Icons from "lucide-react"
import { useFieldContext } from "."
import { FieldErrors } from "./FieldErrors"


export const SelectIcon = ({ iconos = [] }) => {
  const field = useFieldContext()

  const handleSelect = (icono) => {
    field.handleChange(icono)
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {iconos.map((icono) => {
        const Icono = Icons[icono]

        if (!Icono) return null

        const activo = field.state.value === icono

        return (<button
          key={icono}
          type="button"
          onBlur={field.handleBlur}
          onClick={() => handleSelect(icono)}
          className={`p-3 rounded-xl border transition-colors flex justify-center
            ${activo
              ? "bg-indigo-100 border-indigo-500 text-indigo-600"
              : "bg-white border-gray-200 hover:bg-gray-100"}
            `}
        >
          <Icono size={24} />
        </button>)
      })
      }
      <FieldErrors meta={field.state.meta} />
    </div>
  )
}
