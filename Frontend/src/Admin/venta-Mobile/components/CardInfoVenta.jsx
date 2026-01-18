import React from 'react'

export const CardInfoVenta = ({ icono, texto, titulo }) => {
  const Icono = icono
  return (
    <div className='bg-white rounded-lg shadow-md mb-4 overflow-hidden'>
      <div className='flex items-center gap-4 p-4'>
        <Icono size={32} color={"#0f66c2"} />
        <div>
          <h3 className='text-[#0f66c2] font-semibold font-sans'>{titulo}</h3>
          <p className='font-bold '>{texto}</p>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-blue-500 to-green-500" />
    </div >
  )
}
