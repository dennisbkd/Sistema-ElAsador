import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  CheckCircle,
  Trash2,
  AlertCircle,
  Package,
  Clock,
  Filter,
  Box
} from 'lucide-react';
import { useNotificacion } from '../../../hooks/useNotificacion';

const NotificacionesPage = () => {
  const {
    notificacion,
    reiniciarNotificaciones,
    marcarComoLeidas,
    notificacionesNoLeidas,
    hayNuevasNotificaciones,
  } = useNotificacion();

  // Marcar todas como leídas al entrar si hay nuevas
  useEffect(() => {
    if (hayNuevasNotificaciones) {
      marcarComoLeidas();
    }
  }, [hayNuevasNotificaciones, marcarComoLeidas]);

  const formatearFecha = (timestamp) => {
    const ahora = new Date();
    const fecha = new Date(timestamp);
    const diffMs = ahora - fecha;
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMin < 1) return 'Ahora mismo';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHoras < 24) return `Hace ${diffHoras} h`;

    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const borrarNotificacion = () => {
    reiniciarNotificaciones()
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-4">
      {/* Contenido principal */}
      <main className="p-4">
        <AnimatePresence mode="wait">
          {notificacion.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Bell className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No hay notificaciones
              </h3>
              <p className="text-gray-500 max-w-sm">
                Las notificaciones aparecerán aquí cuando haya actualizaciones en los productos.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <AnimatePresence>
                {notificacion.map((noti, index) => {

                  return (
                    <motion.div
                      key={noti.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-white rounded-xl shadow-sm border overflow-hidden`}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full bg-amber-50`}>
                              <Box className={`h-5 w-5 text-blue-600`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-semibold text-gray-700`}>
                                  {noti.nombre || 'Sistema'}
                                </h3>
                                {!noti.leida && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="h-2 w-2 bg-blue-500 rounded-full"
                                  />
                                )}
                              </div>
                              <p className={`text-sm text-gray-700`}>
                                {noti.mensaje}
                              </p>
                            </div>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => borrarNotificacion(noti.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-full"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </motion.button>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{formatearFecha(noti.id)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-blue-600">
                              <Bell className="h-3 w-3" />
                              <span>Nueva</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {!noti.leida && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          className="h-1 bg-gradient-to-r from-blue-500 to-blue-400"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Acciones flotantes */}
      <div className="fixed bottom-24 right-4 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          {notificacionesNoLeidas > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={marcarComoLeidas}
              className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl"
            >
              <CheckCircle className="h-5 w-5" />
            </motion.button>
          )}

          {hayNuevasNotificaciones && (
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: 2
              }}
              className="absolute -top-1 -right-1"
            >
              <div className="h-3 w-3 bg-red-500 rounded-full ring-2 ring-white" />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Indicador de nuevas notificaciones */}
      <AnimatePresence>
        {hayNuevasNotificaciones && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-36 left-4 right-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 rounded-xl shadow-xl z-10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 animate-pulse" />
                <div>
                  <p className="font-semibold">¡Nuevas notificaciones!</p>
                  <p className="text-sm opacity-90">Hay {notificacionesNoLeidas} alertas sin leer</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={marcarComoLeidas}
                className="text-sm font-medium bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30"
              >
                Marcar como leídas
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificacionesPage;