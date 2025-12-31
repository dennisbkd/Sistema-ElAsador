import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { TextField } from "./TextField";
import { BotonSubmit } from "./BotonSubmit";
import { SelectField } from "./SelectFiled";
import { BotonAccion } from "../../ui/boton/BotonAccion";
import { SelectIcon } from "./SelectIcon";

export const { fieldContext, useFieldContext, useFormContext, formContext } = createFormHookContexts()
export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
    SelectIcon
  },
  formComponents: {
    BotonSubmit,
    BotonAccion
  },
  fieldContext,
  formContext
})

