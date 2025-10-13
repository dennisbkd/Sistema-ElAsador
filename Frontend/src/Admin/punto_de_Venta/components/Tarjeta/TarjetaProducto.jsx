import { Plus } from "lucide-react"
import { motion } from "motion/react"

export const TarjetaProducto = ({
  producto,
  esMobile,
  index = 0,
  imagen = null,
  icon = null }) => {
  const Icon = icon ? icon : null
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: esMobile ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer">
      <div className="h-24 md:h-32 bg-gradient-to-br from-blue-50 to-blue-100 bg-blue-100 text-blue-600  flex items-center justify-center">
        {imagen && <img
          src={imagen}
          alt={producto ? producto.nombre : "Producto"}
        />}
        {Icon && <Icon size={esMobile ? 30 : 40} />}
      </div>
      <div className={`p-4 ${esMobile && "p-3"}`}>
        <h3 className="font-semibold text-gray-800">{producto.nombre}</h3>
        <p className={`text-gray-600 mt-1 ${esMobile ? "text-xs" : "text-sm"}`}>{producto.descripcion}</p>
      </div>
      <div className="flex justify-between items-center p-4 border-t border-gray-200">
        <span className="font-bold text-blue-600 text-lg sm:text-2xl">{producto.precio} bs</span>
        <motion.button className="bg-blue-600 text-white rounded-md p-2 cursor-pointer" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          {<Plus size={esMobile ? 14 : 18} />}
        </motion.button>
      </div>
    </motion.div>
  )
}
