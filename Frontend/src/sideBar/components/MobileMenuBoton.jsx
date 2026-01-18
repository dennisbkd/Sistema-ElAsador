import { Menu, X } from 'lucide-react'

export const MobileMenuBoton = ({ isAbierto, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className='fixed top-4 left-4 z-40 bg-blue-600
       text-white p-2 rounded-lg shadow-lg md:hidden'
    >
      {isAbierto ? <X size={20} /> : <Menu size={20} />}
    </button>
  )
}
