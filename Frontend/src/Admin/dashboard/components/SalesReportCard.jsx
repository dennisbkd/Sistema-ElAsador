import { useState } from 'react'
import { motion } from 'motion/react'
import { FileText, Download, FileSpreadsheet, Calendar, Loader2, X } from 'lucide-react'
import { useDashboardReporteVentas } from '../hooks/useDashboardQueries'
import { dashboardApi } from '../api/dashboardApi'

const obtenerFechaHoy = () => {
  const hoy = new Date()
  return hoy.toISOString().split('T')[0]
}

const obtenerFechaPrimerDiaMes = () => {
  const hoy = new Date()
  const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  return primerDia.toISOString().split('T')[0]
}

export const SalesReportCard = () => {
  const [fechaInicio, setFechaInicio] = useState(obtenerFechaPrimerDiaMes())
  const [fechaFin, setFechaFin] = useState(obtenerFechaHoy())
  const [descargando, setDescargando] = useState(null) // 'pdf' | 'excel' | null
  const [buscar, setBuscar] = useState(false)

  const reporteQuery = useDashboardReporteVentas({
    fechaInicio,
    fechaFin,
    enabled: buscar
  })

  const handleBuscarReporte = () => {
    setBuscar(true)
  }

  const descargarArchivo = (blob, nombreArchivo) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = nombreArchivo
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handleDescargarPDF = async () => {
    try {
      setDescargando('pdf')
      const blob = await dashboardApi.descargarReportePDF({ fechaInicio, fechaFin })
      descargarArchivo(blob, `reporte-ventas-${fechaInicio}-${fechaFin}.pdf`)
    } catch (error) {
      console.error('Error al descargar PDF:', error)
      alert('Error al descargar el reporte PDF')
    } finally {
      setDescargando(null)
    }
  }

  const handleDescargarExcel = async () => {
    try {
      setDescargando('excel')
      const blob = await dashboardApi.descargarReporteExcel({ fechaInicio, fechaFin })
      descargarArchivo(blob, `reporte-ventas-${fechaInicio}-${fechaFin}.xlsx`)
    } catch (error) {
      console.error('Error al descargar Excel:', error)
      alert('Error al descargar el reporte Excel')
    } finally {
      setDescargando(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <FileText className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Reporte de Ventas</h3>
          <p className="text-sm text-gray-600">Consulta y descarga reportes detallados</p>
        </div>
      </div>

      {/* Selector de fechas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Fecha Inicio
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            max={fechaFin}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Fecha Fin
          </label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            min={fechaInicio}
            max={obtenerFechaHoy()}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-end space-x-1">
          <button
            onClick={handleBuscarReporte}
            disabled={reporteQuery.isLoading}
            className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {reporteQuery.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Consultando...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Consultar
              </>
            )}
          </button>
          {/* boton para cerrar el reporte */}
          {buscar && (
            <button
              onClick={() => setBuscar(false)}
              className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Resultados */}
      {buscar && reporteQuery.data && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Resumen */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
            <h4 className="font-semibold text-indigo-900 mb-3">Resumen del Periodo</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-indigo-600">Total Ventas</p>
                <p className="text-2xl font-bold text-indigo-900">
                  Bs {reporteQuery.data.resumen.totalVentas.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-indigo-600">Categorías</p>
                <p className="text-2xl font-bold text-indigo-900">
                  {reporteQuery.data.resumen.totalCategorias}
                </p>
              </div>
              <div>
                <p className="text-sm text-indigo-600">Productos</p>
                <p className="text-2xl font-bold text-indigo-900">
                  {reporteQuery.data.resumen.totalProductos}
                </p>
              </div>
            </div>
          </div>

          {/* Detalle por categorías */}
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Categoría</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Producto</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Cantidad</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">P/U</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reporteQuery.data.categorias.map((categoria) => (
                  categoria.productos.map((producto, idx) => (
                    <tr key={`${categoria.categoriaId}-${producto.productoId}`} className="hover:bg-gray-50">
                      {idx === 0 && (
                        <td
                          rowSpan={categoria.productos.length}
                          className="px-4 py-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200"
                        >
                          <div>
                            <p className="font-semibold">{categoria.categoria}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              Total: Bs {categoria.totalCategoria.toFixed(2)}
                            </p>
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-3 text-gray-700">{producto.nombre}</td>
                      <td className="px-4 py-3 text-right text-gray-900 font-medium">
                        {producto.cantidadVendida}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        Bs {producto.precioUnitario.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 font-semibold">
                        Bs {producto.totalProducto.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>

          {/* Botones de descarga */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleDescargarPDF}
              disabled={descargando !== null}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {descargando === 'pdf' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Descargando...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Descargar PDF
                </>
              )}
            </button>

            <button
              onClick={handleDescargarExcel}
              disabled={descargando !== null}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {descargando === 'excel' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Descargando...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-5 h-5" />
                  Descargar Excel
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Error */}
      {buscar && reporteQuery.isError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
        >
          <p className="text-red-800 font-medium">
            Error al cargar el reporte
          </p>
          <p className="text-sm text-red-600 mt-1">
            {reporteQuery.error?.message || 'Intenta de nuevo más tarde'}
          </p>
        </motion.div>
      )}

      {/* Sin resultados */}
      {buscar && reporteQuery.data && reporteQuery.data.categorias.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center"
        >
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-700 font-medium">No hay ventas en el periodo seleccionado</p>
          <p className="text-sm text-gray-500 mt-1">Selecciona otro rango de fechas</p>
        </motion.div>
      )}
    </motion.div>
  )
}
