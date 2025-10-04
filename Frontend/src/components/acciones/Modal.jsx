// components/ui/Modal.jsx
export const Modal = ({ open, onClose, children }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 h-full flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="rounded-lg shadow-lg w-full max-w-md relative">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="bg-slate-100 border-1 border-slate-300 cursor-pointer font-bold hover:bg-slate-300 h-10 w-10 rounded-full absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}
