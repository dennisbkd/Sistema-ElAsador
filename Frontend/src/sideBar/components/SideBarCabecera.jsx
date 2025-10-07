import { ChevronFirst, ChevronLast, Flame } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export const SideBarCabecera = ({
  expandido,
  onToggle,
  isMobile
}) => {

  return (
    <div className="p-4 border-b border-blue-500 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`${expandido ? 'w-10 h-10' : 'w-8 h-8 mx-auto'} bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 transition-all`}>
          <Flame className={`${expandido ? 'w-6 h-6' : 'w-5 h-5'} text-blue-600`} />
        </div>
        <AnimatePresence mode="wait">
          {
            expandido && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="min-w-0"
              >
                <h1 className="text-xl font-bold truncate">El Asador</h1>
                <p className="text-blue-100 text-sm truncate">Restaurante Premium</p>
              </motion.div>
            )}
        </AnimatePresence>
      </div>
      {
        !isMobile && expandido && onToggle && (
          <button
            onClick={onToggle}
            className="text-blue-100 hover:text-white
            hover:bg-blue-500 rounded-lg p-1 transition-colors
              flex-shrink-0">
            {isMobile ? <ChevronLast /> : <ChevronFirst />}
          </button>
        )
      }
    </div >
  )
}
