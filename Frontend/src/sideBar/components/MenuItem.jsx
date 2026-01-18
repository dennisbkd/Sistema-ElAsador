import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { NavLink } from 'react-router'
import { SidebarSubMenu } from "./SideBarSubMenu";

export const MenuItem = ({
  item,
  estaExpandido,
  estaSubMenuAbierto,
  onToggleSubmenu,
  cerrarMobile,
  location,
  estaActivo
}) => {
  const Icon = item.icon
  const tieneSub = !!item.subItems
  const activo = estaActivo(item)

  return (
    <div>
      {
        tieneSub ? (
          <motion.div
            whileHover={{ scale: estaExpandido ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${activo ? "bg-white text-blue-700 shadow-lg" : "text-blue-100 hover:bg-blue-500 hover:text-white"
              } ${!estaExpandido ? 'justify-center' : ''}`}
            onClick={() => item.key && onToggleSubmenu(item.key)}
          >
            <div className={`flex items-center ${estaExpandido ? 'gap-3' : 'justify-center'} min-w-0`}>
              <div className={`p-2 rounded-lg ${activo ? "bg-blue-100" : "bg-blue-500"
                } ${!estaActivo ? 'mx-auto' : ''}`}>
                <Icon size={20} />
              </div>
              <AnimatePresence>
                {estaExpandido && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-sm font-medium truncate"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            {estaExpandido && (
              <motion.div
                animate={{ rotate: estaSubMenuAbierto ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <ChevronDown size={20} />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <NavLink to={item.path} onClick={cerrarMobile}>
            <motion.div
              whileHover={{ scale: estaExpandido ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-all 
                ${activo
                  ? "bg-white text-blue-700 shadow-lg"
                  : "text-blue-100 hover:bg-blue-500 hover:text-white"
                } ${!estaExpandido ? 'justify-center' : ''}`}
            >
              <div className={`p-2 rounded-lg 
              ${activo
                  ? "bg-blue-100"
                  : "bg-blue-500"
                } ${!estaExpandido ? 'mx-auto' : ''}`}>
                <Icon size={20} />
              </div>
              <AnimatePresence>
                {
                  estaExpandido && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-medium ml-3 truncate"
                    >
                      {item.title}
                    </motion.span>
                  )}
              </AnimatePresence>
            </motion.div>
          </NavLink>
        )}
      {tieneSub && item.subItems && item.key && (
        <SidebarSubMenu
          subItems={item.subItems}
          estaExpandido={estaSubMenuAbierto && estaExpandido}
          cerrarMobile={cerrarMobile}
          location={location}
        />
      )}
    </div>
  )
}
