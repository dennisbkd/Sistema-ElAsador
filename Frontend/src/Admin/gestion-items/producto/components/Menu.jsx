import { BotonMenu } from "../../../../components/BotonMenu"
import { BotonMenuSkeleton } from "../../../../components/BotonMenuSkeleton"


export const Menu = ({ categorias, categoriaId, setCategoriaId, isLoading }) => {
  return (
    <div className='flex flex-wrap gap-4 '>
      {isLoading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <BotonMenuSkeleton key={index} index={index} />
        ))
      ) : (
        categorias.map((categoria, index) => (
          <BotonMenu
            index={index}
            key={categoria.id}
            valor={{ icono: categoria.icono, text: categoria.nombre }}
            activo={categoriaId === categoria.id}
            onSelect={() => setCategoriaId(categoria.id)}
          />
        ))
      )}
    </div>
  )
}
