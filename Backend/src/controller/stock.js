export class ControladorStock {
  constructor ({ stockServicio }) {
    this.stockServicio = stockServicio
  }

  obtenerEstadoStock = async (req, res) => {
    try {
      const respuesta = await this.stockServicio.obtenerEstadoStock()
      if (respuesta.error) return res.status(400).json({ error: respuesta.error })
      return res.status(200).json(respuesta)
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  movimientoStock = async (req, res) => {
    try {
      const respuesta = await this.stockServicio.movimientoStock()
      if (respuesta.error) return res.status(400).json({ error: respuesta.error })
      return res.status(200).json(respuesta)
    } catch (error) {
      return res.status(500).json({ error: 'Error en el servidor' + error.message })
    }
  }
}
