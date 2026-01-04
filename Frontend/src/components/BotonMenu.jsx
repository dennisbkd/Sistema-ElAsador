import { motion } from "motion/react"
import * as Icons from "lucide-react"


export const BotonMenu = ({ activo = false, onSelect, valor, index }) => {
  const Icono = Icons[valor.icono]
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => onSelect(valor)}
      className="group flex items-center gap-2 rounded-lg cursor-pointer"
    >
      <div className={` shadow shadow-indigo-200 flex items-center gap-2 rounded-2xl px-3 py-0.5 ${activo ? 'bg-indigo-300' : 'bg-indigo-200'}`}>
        <Icono size={32} className={` bg-indigo-50 p-2 rounded-full ${activo ? 'text-white bg-indigo-600' : 'text-gray-700'}`} />
        <span className={` p-2 font-medium ${activo ? 'text-white' : 'text-gray-700'}`}>{valor.text}</span>
      </div>
    </motion.button>
  )
}
