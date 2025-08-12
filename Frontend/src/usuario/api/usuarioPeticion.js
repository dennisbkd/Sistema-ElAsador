import instancia from "../../config/axios";

export const ObtenerUsuarios = async ()=>  instancia.get("/usuario/obtener")

export const EditarUsuario = async ({ id, body}) => { instancia.patch(`/usuario/actualizar/${id}`, body) }