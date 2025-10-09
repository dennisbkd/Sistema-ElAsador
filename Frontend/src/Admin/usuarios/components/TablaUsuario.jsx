import { motion } from "motion/react";
import { FilaUsuarios } from "./FilaUsuarios";

export const TablaUsuario = ({ usuarios = [], editar, cambiarEstado, isLoading }) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full ">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="text-left p-4 font-semibold">Nombre</th>
              <th className="text-left p-4 font-semibold">Usuario</th>
              <th className="text-left p-4 font-semibold">Rol</th>
              <th className="text-left p-4 font-semibold">Registro</th>
              <th className="text-left p-4 font-semibold">Estado</th>
              <th className="text-left p-4 font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {
              usuarios.map((usuario) => (
                <FilaUsuarios
                  key={usuario.id}
                  usuario={usuario}
                  editar={editar}
                  cambiarEstado={cambiarEstado}
                  estaCambiandoEstado={isLoading}
                />
              ))
            }
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
