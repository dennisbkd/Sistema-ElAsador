import { motion } from 'motion/react'

import {
  useDashboardResumen,
  useDashboardVentasPorHora,
  useDashboardProductosMasVendidos,
  useDashboardPedidosEnTiempoReal,
  useDashboardActividadReciente,
  useDashboardVentasPorTipo,
  useDashboardVentasPorEstado
} from '../hooks/useDashboardQueries'
import { DashboardSummary } from '../components/DashboardSummary'
import { SalesByHourChart } from '../components/SalesByHourChart'
import { TopProductsTable } from '../components/TopProductsTable'
import { LiveOrdersSection } from '../components/LiveOrdersCard'
import { SalesByTypeCard } from '../components/SalesByTypeCard'
import { SalesByStateCard } from '../components/SalesByStateCard'
import { SalesReportCard } from '../components/SalesReportCard'
import {
  DashboardHeader,
  RefreshButton,
  DashboardError
} from '../components/index'
import { RefreshCw } from 'lucide-react'

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
}

export function DashboardPage() {

  // Queries
  const resumenQuery = useDashboardResumen()
  const ventasQuery = useDashboardVentasPorHora()
  const productosQuery = useDashboardProductosMasVendidos(10)
  const pedidosQuery = useDashboardPedidosEnTiempoReal()
  const actividadQuery = useDashboardActividadReciente(20)
  const ventasPorTipoQuery = useDashboardVentasPorTipo()
  const ventasPorEstadoQuery = useDashboardVentasPorEstado()

  // Estados de carga y error
  const isLoading = [
    resumenQuery,
    ventasQuery,
    productosQuery,
    pedidosQuery,
    actividadQuery,
    ventasPorTipoQuery,
    ventasPorEstadoQuery
  ].some((q) => q.isLoading)

  const hasError = [
    resumenQuery,
    ventasQuery,
    productosQuery,
    pedidosQuery,
    actividadQuery,
    ventasPorTipoQuery,
    ventasPorEstadoQuery
  ].some((q) => q.isError)

  // Refetch automático cada 60 segundos
  const handleRefresh = () => {
    resumenQuery.refetch()
    ventasQuery.refetch()
    productosQuery.refetch()
    pedidosQuery.refetch()
    actividadQuery.refetch()
    ventasPorTipoQuery.refetch()
    ventasPorEstadoQuery.refetch()
  }

  if (hasError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <DashboardHeader
          title="Dashboard"
          subtitle="Resumen de métricas del día"
          action={<RefreshButton onClick={handleRefresh} isLoading={isLoading} />}
        />
        <DashboardError
          error={{ message: 'No pudimos cargar los datos del dashboard' }}
          onRetry={handleRefresh}
        />
      </motion.div>
    )
  }
  console.log('data', resumenQuery.data)
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={CONTAINER_VARIANTS}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <DashboardHeader
        title="Dashboard"
        subtitle={`Última actualización: ${new Date().toLocaleTimeString('Bolivia', { hour: '2-digit', minute: '2-digit' })}`}
        action={<RefreshButton onClick={handleRefresh} isLoading={isLoading} />}
      />

      {/* Resumen General */}
      <motion.div variants={ITEM_VARIANTS}>
        <DashboardSummary
          data={resumenQuery.data}
          isLoading={resumenQuery.isLoading}
        />
      </motion.div>

      {/* Reporte de Ventas */}
      <motion.div variants={ITEM_VARIANTS}>
        <SalesReportCard />
      </motion.div>

      {/* Gráfico de ventas por hora - Ancho completo */}
      <motion.div variants={ITEM_VARIANTS}>
        <SalesByHourChart
          data={ventasQuery.data}
          isLoading={ventasQuery.isLoading}
        />
      </motion.div>

      {/* Grid: Tipos y Estados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={ITEM_VARIANTS}>
          <SalesByTypeCard
            data={ventasPorTipoQuery.data}
            isLoading={ventasPorTipoQuery.isLoading}
          />
        </motion.div>

        <motion.div variants={ITEM_VARIANTS}>
          <SalesByStateCard
            data={ventasPorEstadoQuery.data}
            isLoading={ventasPorEstadoQuery.isLoading}
          />
        </motion.div>
      </div>

      {/* Top Productos */}
      <motion.div variants={ITEM_VARIANTS}>
        <TopProductsTable
          data={productosQuery.data?.slice(0, 10)}
          isLoading={productosQuery.isLoading}
        />
      </motion.div>

      {/* Pedidos en Tiempo Real */}
      <motion.div variants={ITEM_VARIANTS}>
        <LiveOrdersSection
          data={pedidosQuery.data}
          isLoading={pedidosQuery.isLoading}
        />
      </motion.div>

      {/* Footer */}
      <motion.div
        variants={ITEM_VARIANTS}
        className="text-center text-sm text-gray-500 pt-6 border-t border-gray-200"
      >
        <p>
          Los datos se actualizan automáticamente. Presiona{' '}
          <RefreshCw className="inline w-4 h-4" /> para actualizar manualmente.
        </p>
      </motion.div>
    </motion.div>
  )
}

export default DashboardPage
