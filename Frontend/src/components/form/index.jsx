import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { TextField } from "./TextField";
import { BotonSubmit } from "./BotonSubmit";
import { SelectField } from "./SelectFiled";
import { BotonAccion } from "../../ui/boton/BotonAccion";
import { SelectIcon } from "./SelectIcon";
import { CheckBox } from "./CheckBox";
import { InputImage } from "./InputImage";

export const { fieldContext, useFieldContext, useFormContext, formContext } = createFormHookContexts()
export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
    SelectIcon,
    CheckBox,
    InputImage
  },
  formComponents: {
    BotonSubmit,
    BotonAccion
  },
  fieldContext,
  formContext
})

