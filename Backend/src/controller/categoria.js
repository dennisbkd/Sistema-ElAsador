export class ControladorCategoria {
  constructor ({ categoriaServicio }) {
    this.categoriaServicio = categoriaServicio
  }

  #manejarRespuesta = (servicioFn, statusCode = 200) => async (req, res) => {
    try {
      const respuesta = await servicioFn(req)
      if (respuesta?.error) return res.status(respuesta?.statusError || 400).json({ error: respuesta.error })
      return res.status(statusCode).json(respuesta)
    } catch (error) {
      return res.status(500).json({ error: 'error al procesar la solicitud' })
    }
  }

  obtenerCategorias = this.#manejarRespuesta((req) =>
    this.categoriaServicio.obtenerCategorias({
      offset: req.query.offset,
      limit: req.query.limit,
      filtroTipo: req.query.filtroTipo
    })
  )

  crearCategoria = this.#manejarRespuesta((req) =>
    this.categoriaServicio.crearCategoria({ body: req.body }), 201)

  actualizarCategoria = this.#manejarRespuesta((req) =>
    this.categoriaServicio.actualizarCategoria({ id: req.params.id, body: req.body }))

  eliminarCategoria = this.#manejarRespuesta((req) =>
    this.categoriaServicio.eliminarCategoria({ id: req.params.id }))
}
