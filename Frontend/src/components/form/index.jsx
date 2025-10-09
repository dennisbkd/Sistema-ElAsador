import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { TextField } from "./TextField";
import { BotonSubmit } from "./BotonSubmit";
import { SelectField } from "./SelectFiled";
import { BotonAccion } from "../../ui/boton/BotonAccion";

export const { fieldContext, useFieldContext, useFormContext, formContext } = createFormHookContexts()
export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
  },
  formComponents: {
    BotonSubmit,
    BotonAccion
  },
  fieldContext,
  formContext
})

