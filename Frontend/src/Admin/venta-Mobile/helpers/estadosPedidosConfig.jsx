import {
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export const getEstadoConfig = (estado) => {
  const configs = {
    PENDIENTE: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
      text: 'Pendiente',
      dotColor: 'bg-yellow-500'
    },
    LISTO: {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
      text: 'Completado',
      dotColor: 'bg-green-500'
    },
    CANCELADO: {
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: AlertCircle,
      text: 'Cancelado',
      dotColor: 'bg-red-500'
    }
  }
  return configs[estado] || configs.PENDIENTE
}