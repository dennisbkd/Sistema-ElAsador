import { useState } from "react"
import { ChevronDown } from "lucide-react"

const roles = ["Administrador", "Cajero", "Mesero"]

export default function SelectAnimado({ value, onChange }) {
  const [open, setOpen] = useState(false)

  const handleSelect = (role) => {
    onChange(role)
    setOpen(false)
  }

  return (
    <div className="relative w-35">
      {/* Select oculto para formularios */}
      <select name="rol" value={value} hidden readOnly>
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      {/* Botón visible */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full py-1 px-2 border-1 border-gray-300 rounded-lg bg-white flex items-center justify-between shadow-sm"
      >
        <span>{value}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Opciones animadas */}
      {open && (
        <div className="absolute left-0 mt-1 w-full rounded-lg bg-white border border-gray-200 shadow-lg z-50">
          {roles.map((role) => (
            <div
              key={role}
              onClick={() => handleSelect(role)}
              className="cursor-pointer px-3 py-1 hover:bg-slate-100"
            >
              {role}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
