export class ProductoControlador {
  constructor ({ productoServicio }) {
    this.productoServicio = productoServicio
  }

  #manejarRespuesta = (servicioFn, statusCode = 200) => async (req, res) => {
    try {
      const respuesta = await servicioFn(req)
      if (respuesta?.error) return res.status(respuesta?.statusError || 400).json({ error: respuesta.error })
      return res.status(statusCode).json(respuesta)
    } catch (error) {
      console.error('Error en el controlador:', error)
      return res.status(500).json({ error: 'error al procesar la solicitud' })
    }
  }

  obtenerProductos = this.#manejarRespuesta((req) =>
    this.productoServicio.obtenerProductos({
      offset: req.query.offset,
      limit: req.query.limit,
      filtros: { categoriaId: req.query.filtroCategoria, activo: req.query.filtroActivo }
    }))

  crearProducto = this.#manejarRespuesta((req) =>
    this.productoServicio.crearProducto({ body: req.body, file: req.file }), 201)

  editarProducto = this.#manejarRespuesta((req) =>
    this.productoServicio.editarProducto({
      id: req.params.id,
      body: req.body,
      file: req.file,
      io: req.app.get('io')
    }))

  obtenerProductoId = this.#manejarRespuesta((req) =>
    this.productoServicio.obtenerProductoId({ id: req.params.id }))

  eliminarProducto = this.#manejarRespuesta((req) =>
    this.productoServicio.eliminarProducto({ id: req.params.id }))

  busquedaProductoNombre = this.#manejarRespuesta((req) =>
    this.productoServicio.busquedaProductoNombre({ nombre: req.query.nombre }))

  cambiarEstadoProducto = this.#manejarRespuesta((req) =>
    this.productoServicio.cambiarEstadoProducto({ id: req.params.id, activo: req.body.activo }))
}
