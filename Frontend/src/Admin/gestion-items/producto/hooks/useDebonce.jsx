import { useEffect } from 'react'
import { useState } from 'react'

export const useDebonce = ({ value, delay = 500 }) => {
  const [debonceValue, setDebonceValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebonceValue(value)
    }, delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debonceValue
}
