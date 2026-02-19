import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
]

// Función para verificar si es una IP local válida
const esIpLocal = (origin) => {
  if (!origin) return false

  // Patrones de IP local
  const patronesLocales = [
    /^http:\/\/localhost/,
    /^http:\/\/127\.0\.0\.1/,
    /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}/,
    /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
    /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}/
  ]

  return patronesLocales.some(patron => patron.test(origin))
}

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    // Permitir orígenes configurados
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }

    // Si no hay origin (como en Postman o requests del mismo servidor)
    if (!origin) {
      return callback(null, true)
    }

    // En modo Electron, permitir IPs locales
    if (process.env.ELECTRON_MODE === 'true' && esIpLocal(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
})
