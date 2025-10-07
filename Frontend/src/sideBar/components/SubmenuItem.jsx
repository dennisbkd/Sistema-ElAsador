import { motion } from 'motion/react'
import { NavLink } from 'react-router'

export const SubmenuItem = ({
  subItem, estaActivo, cerrarMobile
}) => {
  const SubIcon = subItem.icon
  return (
    <NavLink to={subItem.path} onClick={cerrarMobile}>
      <motion.div
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center p-2 rounded-lg transition-all
          ${estaActivo
            ? "bg-blue-500 text-white shadow-md"
            : "text-blue-200 hover:bg-blue-400 hover:text-white"
          }`}
      >
        {
          SubIcon && (
            <SubIcon className="w-3 h-3 mr-2 flex-shrink-0" />
          )
        }
        <span className="text-xs font-medium truncate">
          {subItem.title}
        </span>
      </motion.div>
    </NavLink>
  )
}
