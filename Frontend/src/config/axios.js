import axios from "axios";
export const instancia = axios.create({
  baseURL:import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
  withCredentials: true,
})