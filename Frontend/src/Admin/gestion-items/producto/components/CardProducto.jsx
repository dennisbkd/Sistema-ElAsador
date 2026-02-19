import { motion } from 'motion/react'
import { Insignia } from '../../../../ui/Insignia'
import * as Icons from 'lucide-react';
import { BotonAccion } from '../../../../ui/boton/BotonAccion';
import { Link } from 'react-router';
import { getProductImageUrl } from '../../../../utils/imageURL';

export const CardProducto = ({ productos, isEliminando, eliminarProducto, cambiarEstadoProducto }) => {
  const Icon = Icons[productos?.categoria?.icono || 'Package'];
  const pathImagen = getProductImageUrl(productos.imagen);
  const esBajoStock = productos?.stock?.cantidad <= productos?.stock?.cantidadMinima;
  const esSinStock = productos?.stock?.cantidad === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 flex flex-col h-full"
    >
      {/* Header con estado */}
      <div className="relative">
        <div className="absolute top-3 left-3 z-10">
          <Insignia
            size={16}
            color={esSinStock ? 'red' : esBajoStock ? 'yellow' : 'green'}
            texto={esSinStock ? 'Sin Stock' : esBajoStock ? 'Bajo Stock' : 'Disponible'}
            icon={esSinStock ? Icons.XCircle : esBajoStock ? Icons.AlertTriangle : Icons.CheckCircle}
          />
        </div>

        {productos?.esPreparado && (
          <div className="absolute top-3 right-3 z-10">
            <Insignia
              size={14}
              color="purple"
              texto="Preparado"
              icon={Icons.ChefHat}
            />
          </div>
        )}

        {/* Imagen */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={pathImagen}
            alt={productos.nombre}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Categoría */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <div className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg">
              <Icon className="h-4 w-4 text-gray-700" />
            </div>
            <span className="text-xs font-semibold text-white bg-black/50 px-2 py-1 rounded-full">
              {productos?.categoria?.nombre}
            </span>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Nombre y Precio */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {productos.nombre}
          </h3>
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold text-green-600">
              {parseFloat(productos.precio).toLocaleString('es-BO', {
                style: 'currency',
                currency: 'BOB'
              })}
            </span>
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-4 flex-1">
          <p className="text-sm text-gray-600 line-clamp-2">
            {productos.descripcion}
          </p>
        </div>

        {/* Estadísticas de Stock */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Stock Actual</span>
              <span className={`text-sm font-bold ${esBajoStock ? 'text-orange-600' : 'text-green-600'}`}>
                {productos?.stock?.cantidad}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${esSinStock ? 'bg-red-500' : esBajoStock ? 'bg-orange-500' : 'bg-green-500'}`}
                style={{
                  width: `${Math.min((productos?.stock?.cantidad / (productos?.stock?.cantidadMinima * 3)) * 100, 100)}%`
                }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Mínimo</span>
              <span className="text-sm font-bold text-amber-600">
                {productos?.stock?.cantidadMinima}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-full bg-amber-200 rounded-full" />
            </div>
          </div>
        </div>

        {/* Fecha de actualización */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Icons.Calendar className="h-3 w-3" />
            <span>{productos.fecha}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icons.Clock className="h-3 w-3" />
            <span>{productos.hora}</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <Link to={`/home/productos/editar/${productos.id}`}>
            <BotonAccion
              label="Editar"
              icon={Icons.Edit3}
              variant="edit"
              size="sm"
              className="flex-1"
            />
          </Link>
          <BotonAccion
            label="Eliminar"
            onClick={() => eliminarProducto({ id: productos.id, nombre: productos.nombre })}
            isLoading={isEliminando}
            icon={Icons.Trash2}
            variant="danger"
            size="sm"
            className="flex-1"
          />
          <button onClick={() => cambiarEstadoProducto(productos.id, !productos.activo)} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            {productos.activo ? (
              <Icons.EyeOff color='red' className="h-5 w-5 text-gray-600" />
            ) : (
              <Icons.Eye color='green' className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}