import { motion } from "motion/react";

export const BotonMenuSkeleton = ({ index }) => {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      disabled
      className="group flex items-center gap-2 rounded-lg cursor-wait"
    >
      <div className="shadow shadow-indigo-200 flex items-center gap-2 rounded-2xl px-3 py-1 bg-indigo-200 animate-pulse">
        {/* Placeholder para icono */}
        <div className="w-8 h-8 rounded-full bg-indigo-50" />
        {/* Placeholder para texto */}
        <div className="w-20 h-6 rounded bg-indigo-50" />
      </div>
    </motion.button>
  );
};
