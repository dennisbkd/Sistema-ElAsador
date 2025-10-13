
import { useState } from "react"
import { useVerificarMobile } from "../../../hooks/useVerificarMobile"
import { BotonCategoria } from "../components/boton/BotonCategoria"
import { Categorias } from "../utils/categorias"
import { TarjetaProducto } from "../components/Tarjeta/TarjetaProducto"
import { Utensils } from "lucide-react"
import { motion } from "motion/react"

const productos = {
  principales: [
    { id: 1, nombre: 'Hamburguesa', descripcion: 'Deliciosa hamburguesa de carne', precio: 5.99 },
    { id: 2, nombre: 'Pizza', descripcion: 'Pizza con ingredientes frescos', precio: 8.99 },
    { id: 3, nombre: 'Pasta', descripcion: 'Pasta al dente con salsa especial', precio: 7.99 },
    { id: 7, nombre: 'Ensalada César', descripcion: 'Ensalada fresca con aderezo César', precio: 6.49 },
    { id: 8, nombre: 'Sándwich Club', descripcion: 'Sándwich con pollo, tocino y vegetales', precio: 6.99 },
    { id: 9, nombre: 'Tacos', descripcion: 'Tacos de carne con salsa picante', precio: 4.99 },
  ],
  postres: [
    { id: 4, nombre: 'Helado', descripcion: 'Helado de vainilla con chocolate', precio: 3.99 },
    { id: 5, nombre: 'Tarta', descripcion: 'Tarta de frutas frescas', precio: 4.99 },
    { id: 6, nombre: 'Brownie', descripcion: 'Brownie de chocolate con nueces', precio: 4.49 },
  ]
}

export const PuntoVenta = () => {
  const categorias = Categorias
  const [activo, setActivo] = useState('Principales')
  const esMobile = useVerificarMobile()
  return (
    <div className="flex-1 py-4 sm:py-6 overflow-y-auto ">
      <div className="flex border-b border-gray-300 pb-2 overflow-x-auto">
        {categorias.map((categoria, index) => {
          return (
            <BotonCategoria
              key={categoria.titulo}
              esMobile={esMobile}
              activa={activo === categoria.titulo}
              index={index}
              icon={categoria.icono}
              titulo={categoria.titulo}
              cambiarCategoria={setActivo}
            />
          )
        })}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-2 md:mt-4">
        {productos[activo.toLocaleLowerCase()]?.map((producto, index) => (
          <TarjetaProducto
            key={producto.id}
            producto={producto}
            esMobile={esMobile}
            index={index}
            icon={Utensils}
          />
        ))}
      </div>
    </div >
  )
}
