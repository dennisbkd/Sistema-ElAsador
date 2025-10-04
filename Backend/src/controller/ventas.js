export class ControladorVenta {
  constructor ({ ventaServicio }) {
    this.ventaServicio = ventaServicio
  }

  ventasDelDiaDetallado = async (req, res) => {
    try {
      const respuesta = await this.ventaServicio.ventasDelDiaDetallado()
      if (respuesta.error) return res.status(200).json(respuesta.error)
      return res.status(200).json(respuesta)
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
