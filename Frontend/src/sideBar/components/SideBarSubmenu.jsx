import { AnimatePresence, motion } from 'motion/react'
import { SubmenuItem } from './SubmenuItem'

export const SidebarSubMenu = ({
  subItems, estaExpandido, cerrarMobile, location
}) => {

  return (
    <AnimatePresence>
      {
        estaExpandido && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="ml-4 pl-6 border-l-2 border-blue-400 flex 
            flex-col space-y-1 overflow-hidden mt-1"
          >
            {
              subItems.map((subItem) => {
                const subActivo = location.pathname === subItem.path
                return (
                  <SubmenuItem
                    key={subItem.title}
                    subItem={subItem}
                    estaActivo={subActivo}
                    cerrarMobile={cerrarMobile}
                  />
                )
              })
            }
          </motion.div>
        )}
    </AnimatePresence>
  )
}
