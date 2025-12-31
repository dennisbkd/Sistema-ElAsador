import { Calendar, Trash2, Edit } from 'lucide-react'
import { motion } from 'motion/react'
import { BotonAccion } from '../../../../ui/boton/BotonAccion'
import * as Icons from 'lucide-react'

export const FilaCategoria = ({ categoria, editar, eliminar }) => {

  const IconoCategoria = ({ icono }) => {
    const Icon = Icons[icono] || Icons.Folder
    return <Icon size={24} color="indigo" />
  }

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hover:bg-blue-50 transition-colors border-b border-gray-200"
    >
      <td className="p-4 text-gray-600 font-bold">#{categoria.id}</td>
      <td className="p-4 font-semibold text-gray-800"><div className='flex items-center gap-2 '><IconoCategoria icono={categoria.icono} /> {categoria.nombre}</div> </td>
      <td className="p-4 font-semibold text-gray-800">
        {categoria.tipo}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={14} />
          <div className="flex flex-col">
            <p className="font-semibold text-gray-800">{categoria.fecha}</p>
            <p className="text-xs text-gray-500">{categoria.hora}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex justify-center gap-2">
          <BotonAccion
            onClick={() => editar(categoria)}
            variant='primary'
            icon={Edit}
            label="Editar"
          />
          <BotonAccion
            onClick={() => eliminar(categoria.id)}
            variant='danger'
            icon={Trash2}
            label="Eliminar"
          />
        </div>
      </td>
    </motion.tr>
  )
}
