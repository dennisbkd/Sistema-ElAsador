import React from 'react'
import { AnimatePresence, motion } from 'motion/react'

export const FiltroEstadoVenta = ({ mostrarFiltros, estados, tiposVenta, filtroEstado, filtroTipo, handleCambiarFiltro, cargando }) => {
  return (
    <AnimatePresence>
      {mostrarFiltros && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Filtro por estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado del Pedido</label>
                <div className="flex flex-wrap gap-2">
                  {estados.map(estado => (
                    <button
                      key={estado.valor}
                      onClick={() => handleCambiarFiltro(estado.valor, filtroTipo)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
                          ${filtroEstado === estado.valor
                          ? estado.color.replace('100', '600').replace('800', '50') + ' text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      disabled={cargando}
                    >
                      <estado.icon className="w-4 h-4" />
                      {estado.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro por tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Venta</label>
                <div className="flex flex-wrap gap-2">
                  {tiposVenta.map(tipo => (
                    <button
                      key={tipo.valor}
                      onClick={() => handleCambiarFiltro(filtroEstado, tipo.valor)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
                          ${filtroTipo === tipo.valor
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      disabled={cargando}
                    >
                      <tipo.icon className="w-4 h-4" />
                      {tipo.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
