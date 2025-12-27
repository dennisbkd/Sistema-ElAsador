// SelectField.jsx
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { useFieldContext } from '.';
import { FieldErrors } from './FieldErrors';

export const SelectField = ({ label, options = [], placeholder = "Seleccionar..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const field = useFieldContext()
  const selectRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    field.handleChange(value);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value.toLowerCase() === field.state.value.toLowerCase());

  return (
    <div ref={selectRef} className="relative inset-0 z-50">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Select Trigger */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 text-left border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${field.state.meta.errors?.length > 0
          ? 'border-red-300 bg-red-50'
          : 'border-gray-300 bg-white'
          }`}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="flex justify-between items-center">
          <span className={`block truncate ${selectedOption ? 'text-gray-900' : 'text-gray-500'
            }`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-3 py-2 text-left transition-colors hover:bg-gray-100 ${field.state.value === option.value
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'text-gray-900'
                  } ${index === 0 ? 'rounded-t-lg' : ''} ${index === options.length - 1 ? 'rounded-b-lg' : ''
                  } border-b border-gray-100 last:border-b-0`}
                transition={{ duration: 0.1 }}
              >
                <span className="block truncate">{option.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <FieldErrors
        meta={field.state.meta}
      />
    </div>
  );
};