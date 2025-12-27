import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'

const MotionChevronDown = motion.create(ChevronDown)

export const SelectOption = ({ props, value, label, options = [], placeholder = "seleccionar...", selectValue }) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (value) => {
    selectValue(value)
    setIsOpen(false)
  }
  const selectedOption = options.find(opt => opt.value.toLowerCase() === value.toLowerCase())

  return (
    <div ref={selectRef} className={`relative inset-0 z-50 ${props?.className || ''}`}>
      {label && (
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {label}
        </label>
      )}

      <motion.button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 text-left rounded-lg shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          border-gray-300 bg-white
          `}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className='flex items-center justify-between w-full'>
          <span className={`truncate ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <MotionChevronDown
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className='text-gray-400 ml-2 flex-shrink-0'
            size={16}
            fill='none'
          />

        </div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className='absolute z-50 w-full mt-1 bg-white border border-gray-200
            rounded-lg shadow-lg overflow-auto max-h-60'
          >
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                type='button'
                onClick={() => handleSelect(option.value)}
                className={`w-full px-3 py-2 text-left transition-colors hover:bg-gray-100
                  ${value === option.value ? 'bg-blue-50 text-blue-600 border-blue-200'
                    : 'text-gray-900'}
                    ${index === 0 ? 'rounded-t-lg' : ''}
                    ${index === options.length - 1 ? 'rounded-b-lg' : ''}
                    border-b border-gray-100  last:border-0`}
                transition={{ duration: 0.1 }}
              >
                <span className='block truncate'>{option.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
