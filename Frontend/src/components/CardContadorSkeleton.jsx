import { motion } from "motion/react"

export const CardContadorSkeleton = () => {
  return (
    <div className="relative overflow-hidden bg-white border border-gray-300 border-l-8 rounded-md shadow-xs">

      {/* Icono fantasma */}
      <div className="absolute right-0 top-0 opacity-20">
        <motion.div
          className="w-[120px] h-[120px] bg-gray-200 rounded-full"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      <div className="flex justify-between p-4">

        {/* Título */}
        <motion.div
          className="h-5 w-24 bg-gray-200 rounded"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Número */}
        <motion.div
          className="h-16 w-16 bg-gray-200 rounded"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    </div>
  )
}
