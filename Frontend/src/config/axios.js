import axios from "axios";
export const instancia = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
})