import { useStore } from "@tanstack/react-form"
import { useFormContext } from "."


export const BotonSubmit = ({ children,
  type,
  onClick,
  icon: Icon,
  variant = "primary",
  isLoading }) => {
  const form = useFormContext()

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white"
  }


  const [isSubmitting, canSubmit] = useStore(form.store, (state) => [
    state.isSubmitting,
    state.canSubmit,
  ])
  return (
    <button
      onClick={onClick}
      type={type || "submit"}
      disabled={isSubmitting || !canSubmit}
      className={`flex items-center justify-center gap-2 px-4 py-2 sm:px-6 
      sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg
      text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {Icon && <Icon size={18} />}
      {isLoading ? "Cargando..." : children}
    </button>
  )
}
