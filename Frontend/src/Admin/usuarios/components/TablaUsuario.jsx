import { motion } from "motion/react";
import { FilaUsuarios } from "./FilaUsuarios";
import { BotonPaginacion } from "../../../components/BotonPaginacion";
import { UsersIcon } from "lucide-react";

export const TablaUsuario = ({ usuarios = [], editar, cambiarEstado, isLoading, page, siguiente, anterior, eliminar }) => {

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
              <th className="text-left p-4 font-semibold">#ID</th>
              <th className="text-left p-4 font-semibold">Nombre</th>
              <th className="text-left p-4 font-semibold">Usuario</th>
              <th className="text-left p-4 font-semibold">Rol</th>
              <th className="text-left p-4 font-semibold">Registro</th>
              <th className="text-left p-4 font-semibold">Estado</th>
              <th className="text-center p-4 font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-20">
            {
              usuarios.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <UsersIcon size={48} className="text-gray-300" />
                      <div className="font-semibold">No hay usuarios disponibles</div>
                    </div>
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <FilaUsuarios
                    key={usuario.id}
                    usuario={usuario}
                    editar={editar}
                    eliminar={eliminar}
                    cambiarEstado={cambiarEstado}
                    estaCambiandoEstado={isLoading}
                  />
                ))
              )
            }
          </tbody>
        </table>
        <BotonPaginacion
          anterior={anterior}
          siguiente={siguiente}
          pagina={page}
        />
      </div>
    </motion.div>
  )
}
