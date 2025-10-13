import { motion } from "motion/react";

export const BotonCategoria = ({
  esMobile,
  activa,
  titulo,
  icon,
  cambiarCategoria,
  index
}) => {
  const Icon = icon;
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => cambiarCategoria(titulo)}
      className={`group flex items-center gap-2 rounded-lg
            ${esMobile ? "flex-col px-4 py-3" : "px-6 py-4"}
            ${activa ? "bg-blue-100 border-b-2 group text-blue-600 border-blue-600" : "text-gray-700"}
            `}
    >
      <div className={`p-2  rounded-lg ${activa ? "bg-blue-600 text-white" : "bg-gray-300"}`}>
        <Icon size={esMobile ? 16 : 20} />
      </div>
      <span className="group-hover:text-blue-600 font-medium">{titulo}</span>
    </motion.button>
  )
}
