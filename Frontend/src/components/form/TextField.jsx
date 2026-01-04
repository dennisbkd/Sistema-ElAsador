import { useFieldContext } from "."
import { FieldErrors } from "./FieldErrors"


export const TextField = ({ label, type = "text", icon: Icon, placeholder = "" }) => {
  const field = useFieldContext()

  return (
    <div>
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        )}
        <input
          type={type}
          id={field.name}
          value={field.state.value ?? ""}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          className="w-full pl-2 py-2  border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     transition-all duration-200 outline-none"
        />
      </div>
      <FieldErrors
        meta={field.state.meta}
      />
    </div>
  )
}
