import { Filter, Lock, RefreshCw } from 'lucide-react'
import { CajaStats } from './CajaStats'
import { useAjustesManager } from '../../ajustes/hooks/useAjustesManager'

export const CajaHeader = ({ onRefresh, onCerrarCaja, isLoading, setMostrarFiltros, mostrarFiltros }) => {
  const { totalesDiarios, isErrorTotalesDiarios, isLoadingTotalesDiarios } = useAjustesManager({})
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Caja</h1>
          <p className="text-gray-600">Sistema de cobros y pagos</p>
        </div>
        {/* Estadísticas */}
        <div className="flex-1 mx-4">
          <CajaStats
            totalPendiente={totalesDiarios?.totalPendiente || 0}
            totalPagados={totalesDiarios?.totalPagados || 0}
            totalPedidos={totalesDiarios?.totalPedidos}
            totalPendientes={totalesDiarios?.totalPendientes || 0}
            isLoading={isLoadingTotalesDiarios}
            isError={isErrorTotalesDiarios}
            montoPendiente={totalesDiarios?.montoPendiente}
            montoDiario={totalesDiarios?.montoDiario || 0}
            montoPagado={totalesDiarios?.montoPagado || 0}
            montoLlevar={totalesDiarios?.montoLlevar || 0}
            totalReservas={totalesDiarios?.totalReservas || 0}
            totalLlevar={totalesDiarios?.totalLlevar || 0}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>

          <button
            onClick={onCerrarCaja}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Cerrar Caja
          </button>
        </div>
      </div>
    </div>
  )
}