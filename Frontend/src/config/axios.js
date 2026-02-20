import axios from "axios";
import { getBackendUrl } from "../utils/networkUtils";
import { getValidToken } from "../utils/tokenUtils";

// Crear instancia sin baseURL inicial
const instancia = axios.create({
  withCredentials: false,
})

// Interceptor para agregar baseURL dinámicamente en cada request
instancia.interceptors.request.use((config)=>{
  // Agregar baseURL dinámicamente (lazy loading)
  if (!config.url.startsWith('http')) {
    config.baseURL = getBackendUrl()
  }
  
  // Obtener y validar token
  const token = getValidToken()
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
},(error)=> Promise.reject(error))

instancia.interceptors.response.use(
  (response)=>response,
  (error)=>{
  if(error.response?.status === 403){
    window.location.href = '/autorizacion-restringida'
    return Promise.reject(error)
  }

  if(error.response?.status === 401 && window.location.pathname !=='/'){
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    // Disparar evento personalizado para desconectar el socket
    window.dispatchEvent(new Event('auth-logout'))
    window.location.href = '/'
  }
    return Promise.reject(error)
  }
)

export {instancia}