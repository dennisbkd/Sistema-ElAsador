
export const Insignia = ({ texto, color, icon: Icon }) => {

  const colorClases = {
    purple: 'bg-purple-100 text-purple-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-800'
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClases[color]}`}>
      {Icon && <Icon className="mr-1" size={14} />}
      {texto}
    </span>
  )
}
