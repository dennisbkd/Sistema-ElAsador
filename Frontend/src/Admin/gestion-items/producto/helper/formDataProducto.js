export const construirFormDataProducto = (datos) => {
  const formData = new FormData()

  formData.append('nombre', datos.nombre)
  formData.append('descripcion', datos.descripcion ?? '')
  formData.append('precio', datos.precio)
  formData.append('esPreparado', datos.esPreparado)
  formData.append('categoriaId', datos.categoriaId)

  // stock (objeto)
  formData.append('stock[cantidad]', datos.stock?.cantidad)
  formData.append('stock[cantidadMinima]', datos.stock?.cantidadMinima)
  // imagen SOLO si es File
  if (datos.imagen instanceof File) {
    formData.append('imagen', datos.imagen)
  }

  return formData
}
