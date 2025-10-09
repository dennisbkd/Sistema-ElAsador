import { useState } from "react"

export const useModal = (estadoInicial = false) => {
  const [isOpen, setIsOpen] = useState(estadoInicial);
  const [data, setData] = useState(null);

  const abrir = (data = null) => {
    setData(data);
    setIsOpen(true);  
  };
  const cerrar = () =>{
    setIsOpen(false)
    setData(null)
  }

  return {
    isOpen,
    data,
    abrir,
    cerrar,
    setIsOpen
  }
}

