
import { useEffect, useState } from 'react'
import { useLocation } from "react-router";
import { menuItems } from '../utils/menuItems';
import { motion } from "motion/react";
import { SideBarCabecera } from './SideBarCabecera';
import { MobileMenuBoton } from './MobileMenuBoton';
import { MenuItem } from './MenuItem';
import { CerrarSesion } from '../../components/CerrarSesion';

export const SideBar = () => {
  const location = useLocation()
  const [isAbierto, setAbierto] = useState(true)
  const [isMobile, setMobile] = useState(false)
  const [mobileAbierto, setMobileAbierto] = useState(false)
  const [abrirSubMenus, setAbrirSubMenus] = useState({
    usuarios: location.pathname.startsWith('/home/usuarios') || location.pathname.startsWith('/home/')
  })

  const cambiarSubmenu = (key) => {
    if (!isMobile && !isAbierto) {
      setAbierto(true)
      setTimeout(() => setAbrirSubMenus(datosAnteriores => ({ ...datosAnteriores, [key]: true })), 300)
    } else {
      setAbrirSubMenus(datosAnteriores => ({ ...datosAnteriores, [key]: !datosAnteriores[key] }))
    }
  }

  const cerrarMobileMenu = () => {
    if (isMobile) {
      setMobileAbierto(false)
    }
  }

  const estaActivo = (item) => {
    if (item.exact) {
      return location.pathname === item.path
    }
    return location.pathname.startsWith(item.path)
  }

  const mostrarExpandido = () => {
    return isMobile ? mobileAbierto : isAbierto
  }

  useEffect(() => {
    const verificarMobile = () => {
      const mobile = window.innerWidth < 768
      console.log(mobile)
      setMobile(mobile)
      setAbierto(!mobile)
    }
    verificarMobile()
    window.addEventListener("resize", verificarMobile)
    return () => window.removeEventListener("resize", verificarMobile)
  }, [])

  // realizar el cerrar sesion con tokens, se trabajara con localstorage

  return (
    <>
      {isMobile && (
        <MobileMenuBoton
          isAbierto={mobileAbierto}
          onToggle={() => setMobileAbierto(!mobileAbierto)}
        />
      )}

      {isMobile && mobileAbierto && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileAbierto(false)}
        />
      )}

      <motion.div
        animate={{
          width: isMobile ? (mobileAbierto ? 280 : 0) : (isAbierto ? 280 : 80),
          x: isMobile ? (mobileAbierto ? 0 : -280) : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className='fixed md:relative bg-gradient-to-b
         from-blue-700 to-blue-600 text-white h-full 
         flex flex-col z-40 shadow-xl overflow-hidden'>

        <SideBarCabecera
          expandido={mostrarExpandido()}
          onToggle={() => setAbierto(!isAbierto)}
          isMobile={isMobile}
        />


        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <MenuItem
              key={item.title}
              item={item}
              estaExpandido={mostrarExpandido()}
              estaSubMenuAbierto={!!item.key && abrirSubMenus[item.key]}
              onToggleSubmenu={cambiarSubmenu}
              cerrarMobile={cerrarMobileMenu}
              location={location}
              estaActivo={estaActivo}
            />
          ))}
        </nav>
        <CerrarSesion
          variant='button'
          className='mb-4 px-4 mx-4'
        />
      </motion.div>
    </>

  )
}
