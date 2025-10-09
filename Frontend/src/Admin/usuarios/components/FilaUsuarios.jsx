import { motion } from 'motion/react'
import { Insignia } from '../../../ui/Insignia'
import { EstadoEtiqueta } from '../../../ui/EstadoEtiqueta'
import { Calendar, CheckCircle, Edit, XCircle, User, ShieldCheck } from 'lucide-react'

export const FilaUsuarios = ({ usuario, editar, cambiarEstado, estaCambiandoEstado }) => {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hover:bg-blue-50 transition-colors"
    >
      {/* nombre */}
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="text-blue-600" size={18} />
          </div>
          <div>
            <div className="font-semibold text-gray-800">{usuario.nombre}</div>
            <div className="text-sm text-gray-500">ID: {usuario.id}</div>
          </div>
        </div>
      </td>
      {/* usuario */}
      <td className="p-4">
        <div className="font-semibold text-gray-800">{usuario.usuario}</div>
      </td>
      {/* rol */}
      <td className="p-4">
        <Insignia icon={ShieldCheck} texto={usuario.rol} color={usuario.rol.toLowerCase() === 'administrador' ? 'red' : 'blue'} />
      </td>

      {/* registro */}
      <td className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={14} />
          <div className="flex flex-col">
            <div className="font-semibold text-gray-800">{usuario.fechaRegistro}</div>
            <div className="text-xs text-gray-500">{usuario.hora}</div>
          </div>
        </div>
      </td>

      {/* estado */}
      <td className="p-4">
        <EstadoEtiqueta activo={usuario.activo}
          iconos={{
            activo: CheckCircle,
            inactivo: XCircle
          }} />
      </td>

      {/* acciones */}
      <td className="p-4">
        <div className="flex gap-2">
          <button
            onClick={() => editar(usuario)}
            className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm"
          >
            <Edit size={14} />
            Editar
          </button>
          <button onClick={() => cambiarEstado(usuario)}
            disabled={estaCambiandoEstado}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${usuario.activo
              ? 'text-red-600 hover:bg-red-100'
              : 'text-green-600 hover:bg-green-100'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {usuario.activo ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </td>
    </motion.tr>
  )
}
