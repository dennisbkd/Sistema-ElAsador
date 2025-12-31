import { motion } from "motion/react"
import { FilaCategoria } from "./FilaCategoria"


export const TablaCategoria = ({ categorias, editar, eliminar }) => {
  return (
    <motion.table
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
    >
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="text-left p-4 font-semibold">#ID</th>
          <th className="text-left p-4 font-semibold">Nombre</th>
          <th className="text-left p-4 font-semibold">Tipo</th>
          <th className="text-left p-4 font-semibold">Registro</th>
          <th className="font-semibold">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {categorias.length === 0 ? (
          <tr>
            <td colSpan={5} className="p-4 text-center text-gray-500">
              No hay categorías disponibles
            </td>
          </tr>
        ) : (
          categorias.map((categoria) => (
            <FilaCategoria
              key={categoria.id}
              categoria={categoria}
              editar={editar}
              eliminar={eliminar}
            />
          ))
        )}
      </tbody >
    </motion.table >
  )
}
