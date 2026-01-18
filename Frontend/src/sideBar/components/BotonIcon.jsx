/* eslint-disable no-unused-vars */
// components/BotonIcon.jsx - Versión mejorada

export const BotonIcon = ({
  text = '',
  icon: Icon,
  isActive = false,
  size = 24,
  onClick,
  badge,
  notification = false
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center 
        p-3 transition-all duration-200 
        ${isActive
          ? 'text-blue-600 bg-blue-50 rounded-xl'
          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-xl'
        }
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
    >
      {/* Notificación puntito */}
      {notification && (
        <div className="absolute -top-1 -right-1">
          <div className="relative">
            <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></div>
          </div>
        </div>
      )}

      {/* Badge numérico */}
      {badge && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {badge}
        </div>
      )}

      {/* Icono con animación */}
      <div className={`
        rounded-full p-3 mb-1 transition-all duration-300
        ${isActive
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-200'
          : 'bg-gray-100'
        }
        ${isActive ? 'scale-110' : 'scale-100'}
      `}>
        <Icon
          size={size}
          className={`
            transition-colors duration-200
            ${isActive ? 'text-white' : 'text-gray-600'}
          `}
          strokeWidth={isActive ? 2.5 : 2}
        />
      </div>

      {/* Texto */}
      <span className={`
        text-xs font-medium transition-colors duration-200 mt-1
        ${isActive ? 'text-blue-600' : 'text-gray-600'}
      `}>
        {text}
      </span>
    </button>
  )
}