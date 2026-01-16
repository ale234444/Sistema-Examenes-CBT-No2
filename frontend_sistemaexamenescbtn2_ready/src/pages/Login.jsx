import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      //const res = await api.post("/auth/login", { username: matricula, password });
      const res = await api.post("/auth/login", { matricula, password });

      const d = res.data;

      const user = {
        id: d.id || null,
        nombre: d.username,
        role: d.role || d.rol,
        token: d.token,
      };

      localStorage.setItem("token", d.token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      if (user.role?.includes("TEACHER")) navigate("/teacher");
      else navigate("/student");
    } catch (error) {
      console.error("Error en login:", error);
      setErr("Error iniciando sesión. Revisa credenciales o conexión.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Contenedor principal */}
      <div className="flex w-[900px] h-[550px] shadow-2xl rounded-2xl overflow-hidden bg-white">
        {/* Panel azul institucional */}
        <div className="w-1/2 bg-cbtBlue flex flex-col justify-center items-center text-white p-10">
          <img
            src="/logo.png"
            alt="Logo CBT"
            className="w-28 mb-6 drop-shadow-lg"
          />
          <h1 className="text-3xl font-bold mb-2">CBT No. 2</h1>
          <h2 className="text-lg mb-4">San Felipe del Progreso</h2>
          <p className="text-sm text-center opacity-90 leading-relaxed">
            Sistema de Gestión Académica <br />
            Control de exámenes y usuarios
          </p>
        </div>

        {/* Panel del formulario */}
        <div className="w-1/2 flex flex-col justify-center p-10 bg-white">
          <h2 className="text-2xl font-bold text-center text-cbtBlue mb-8">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Matrícula o usuario
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cbtBlue"
                placeholder="Ejemplo: CBT20001"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Contraseña
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cbtBlue"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {err && <div className="text-red-600 text-sm">{err}</div>}

            <button
              type="submit"
              className="w-full bg-cbtBlue text-white py-2 rounded-lg font-semibold hover:bg-blue-900 transition-colors"
            >
              Entrar
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-10">
            © 2025 CBT No. 2 San Felipe del Progreso <br />
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
