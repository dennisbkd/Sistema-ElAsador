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
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <FieldErrors
        meta={field.state.meta}
      />
    </div>
  )
}
