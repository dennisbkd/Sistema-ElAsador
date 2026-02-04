import axios from "axios";
const instancia = axios.create({
  baseURL:import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
  withCredentials: true,
})

instancia.interceptors.request.use((config)=>{
  const token = localStorage.getItem('token')
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
    window.location.href = '/'
  }
    return Promise.reject(error)
  }
)

export {instancia}