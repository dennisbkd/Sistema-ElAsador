import { motion } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { useFieldContext } from '.'

export const CheckBox = () => {
  const field = useFieldContext()
  const [isOn, setIsOn] = useState(field || false)

  // Sincronizar con el valor del formulario
  useEffect(() => {
    setIsOn(field.state.value || false)
  }, [field.state.value])

  const cambiarEstado = () => {
    const newValue = !isOn
    setIsOn(newValue)
    field.handleChange(newValue)
  }
  return (
    <button
      type='button'
      className={`rounded-full w-12 h-6 flex cursor-pointer 
        ${isOn ? 'justify-end' : 'justify-start'}
        items-center p-1 duration-300 
        ${isOn ? 'bg-blue-500' : 'bg-gray-300'}`}
      onClick={cambiarEstado}
      aria-checked={isOn}
      role="switch"
    >
      <motion.div
        className="bg-white w-4 h-4 rounded-full shadow-md"
        layout
        transition={{
          type: "spring",
          duration: 0.2,
          bounce: 0.2,
        }}
      />
    </button>
  )
}