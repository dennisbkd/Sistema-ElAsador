export const CajaStats = ({ totalPendiente, totalPagado, cantidadPendientes }) => (
  <div className="px-6 pb-4">
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-white p-3 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">Pendiente</p>
        <p className="text-lg font-bold text-yellow-600">
          Bs {totalPendiente.toFixed(2)}
        </p>
      </div>
      <div className="bg-white p-3 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">Ventas hoy</p>
        <p className="text-lg font-bold text-blue-600">
          Bs {totalPagado.toFixed(2)}
        </p>
      </div>
      <div className="bg-white p-3 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">Por cobrar</p>
        <p className="text-lg font-bold text-gray-900">
          {cantidadPendientes}
        </p>
      </div>
    </div>
  </div>
)