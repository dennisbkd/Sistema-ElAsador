import { useEffect, useState } from "react"
import { EditarUsuario, ObtenerUsuarios } from "../api/usuarioPeticion"

export function useUsuario (){
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(false)

  const actualizarEstadoUsuario = async ({ usuarioId, nuevoEstado })=>{
    const prevUsuario = usuarios
     setUsuarios(usuarios.map((usuario)=>
        usuario.idUsuario === usuarioId ? {...usuario, estado: nuevoEstado} : usuario
    ))
    try {
      setLoading(true)
      await EditarUsuario()
      setLoading(false)
    } catch (error) {
      console.error(error)
      setUsuarios(prevUsuario)
    }
  }

  useEffect(()=>{
    const cargarUsuarios = async () => {
      setLoading(true)
      const usuarios = await ObtenerUsuarios()
      setUsuarios(usuarios.data)
      setLoading(false)
    }
    cargarUsuarios()
  },[])

  return {loading, usuarios, actualizarEstadoUsuario}
}