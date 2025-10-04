import { Ellipsis } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export const Acciones = ({ opciones = [], onSelect, estado = Boolean }) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  // Cerrar si se hace click afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="hover:bg-green-800 py-1 px-2 hover:text-white rounded-lg"
      >
        <Ellipsis />
      </button>

      {open && (
        <div className="absolute rounded-lg left-0 mt-1 w-36 bg-white border border-gray-200 shadow-lg z-50">
          {opciones.map(({ accion, icon }) => (
            <div
              key={accion}
              onClick={() => {
                onSelect?.(accion)
                setOpen(false)
              }}
              className="flex gap-2 items-center cursor-pointer px-3 py-1 hover:bg-slate-100 ">
              {icon}
              {accion === 'Suspender' && !estado ? <span>Habilitar</span> : <span>{accion}</span>}
            </div>
          ))}
        </div>
      )
      }
    </div >
  )
}
