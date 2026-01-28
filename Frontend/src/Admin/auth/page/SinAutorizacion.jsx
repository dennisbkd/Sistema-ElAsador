import React from 'react'
import { motion } from 'motion/react'
import { Lock, Home, LogOut, AlertCircle, RefreshCw, ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router'

export const SinAutorizacion = () => {
  const navigate = useNavigate()

  const handleVolverInicio = () => {
    navigate('/')
  }

  const handleCerrarSesion = () => {
    // Lógica para cerrar sesión
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/')
  }

  const handleRecargar = () => {
    window.location.reload()
  }


  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-dvh bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
    >
      <div className="max-w-2xl w-full">
        {/* Card principal */}
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.1
          }}
          className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/5 border border-gray-200/50 dark:border-gray-700/50 p-8 md:p-12"
        >
          {/* Efecto de fondo decorativo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          />

          {/* Icono animado */}
          <motion.div
            initial={{ rotate: -10, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            className="relative mb-8 flex justify-center"
          >
            <div className="relative">
              {/* Anillo exterior animado */}
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
                className="absolute -inset-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-sm"
              />

              {/* Icono con pulso */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(239, 68, 68, 0.4)",
                    "0 0 0 20px rgba(239, 68, 68, 0)",
                    "0 0 0 0 rgba(239, 68, 68, 0)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="relative p-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full shadow-lg"
              >
                <ShieldAlert className="w-16 h-16 text-white" />
              </motion.div>

              {/* Icono de candado pequeño */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg border"
              >
                <Lock className="w-5 h-5 text-red-500" />
              </motion.div>
            </div>
          </motion.div>

          {/* Contenido de texto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Acceso Restringido
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-300 text-lg mb-2"
            >
              ⚠️ Permisos insuficientes
            </motion.p>

            <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-xl mx-auto">
              No tienes los permisos necesarios para acceder a esta sección.
              Esta área está restringida a usuarios con roles específicos.
            </p>
          </motion.div>

          {/* Información adicional */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                  ¿Necesitas acceso?
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Contacta al administrador del sistema o solicita los permisos correspondientes.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Botones de acción */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVolverInicio}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative z-10 flex items-center gap-3"
              >
                <Home className="w-5 h-5" />
                <span>Volver al Inicio</span>
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCerrarSesion}
              className="group relative overflow-hidden bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="relative z-10 flex items-center gap-3"
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>

          {/* Acciones de solución */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
              Si crees que esto es un error, intenta:
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRecargar}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Recargar Página
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Mensaje de ayuda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Código de error: <span className="font-mono font-bold">403</span> - Forbidden</span>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 text-gray-400 dark:text-gray-500 text-sm italic"
          >
            El acceso ha sido denegado por restricciones de permisos
          </motion.p>
        </motion.div>

        {/* Partículas decorativas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-red-400/30 to-orange-400/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{
                y: [null, -20, 20, -10],
                scale: [0, 1, 1, 0],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.main>
  )
}