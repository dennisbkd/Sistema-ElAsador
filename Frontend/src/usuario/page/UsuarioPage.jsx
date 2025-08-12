import { useUsuario } from "../hooks/useUsuario"


const UsuarioPage = () => {
  const { usuarios, actualizarEstadoUsuario } = useUsuario()
  console.log(usuarios)
  return (
    <div>UsuarioPage</div>
  )
}

export default UsuarioPage