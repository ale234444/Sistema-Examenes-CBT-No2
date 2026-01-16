import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.137.1/sistemaexamenescbtn2_ready1/sistemaexamenescbtn2_ready/backend/",
  //baseURL: "http://localhost/sistemaexamenescbtn2_ready1/sistemaexamenescbtn2_ready/backend/",
  headers: {
    "Content-Type": "application/json",
  },
});





















// Agrega interceptores para debug
api.interceptors.request.use(
  (config) => {
    console.log("🔄 Enviando request:", config.method?.toUpperCase(), config.url);
    console.log("📤 Datos:", config.data);
    return config;
  },
  (error) => {
    console.error("❌ Error en request:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ Response recibido:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("❌ Error en response:", error);
    if (error.response) {
      console.error("📊 Error data:", error.response.data);
      console.error("📊 Error status:", error.response.status);
    }
    return Promise.reject(error);
  }
);