
import { Save } from "lucide-react";
import { useAppForm } from ".";

export const FormProvider = ({ isLoading, onSubmit, defaultValues, children, mostrarAcciones = true, onClose }) => {
  const form = useAppForm({
    defaultValues,
    onSubmit: ({ value }) => {
      console.log('Form submitted with values:', value);
      onSubmit(value)
    }
  })

  const handleClose = () => {
    if (isLoading) return null
    form.reset()
    onClose?.()
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      {children(form)}

      {mostrarAcciones && (
        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
          <form.AppForm>
            <form.BotonSubmit type="button" variant="secondary" onClick={handleClose}>Cancelar</form.BotonSubmit>
            <form.BotonSubmit icon={Save}>Guardar</form.BotonSubmit>
          </form.AppForm>
        </div>
      )}
    </form>
  )
}
