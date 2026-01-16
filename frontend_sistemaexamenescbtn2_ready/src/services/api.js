import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api", // URL del backend
});

// 🔹 Interceptor para agregar token automáticamente
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
