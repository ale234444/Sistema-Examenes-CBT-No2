import { useState } from "react";
import { api } from "../Api";

export default function Login({ setUser }) {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("auth/login.php", { matricula, password });
      if (res.data.success) {
        const userData = res.data.user;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Error de conexión al servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div
        className="w-full max-w-md rounded-2xl shadow-xl p-8 bg-white border"
        style={{ borderColor: "#7A0019", borderWidth: "3px" }}
      >
        <h1
          className="text-3xl font-bold text-center mb-3 tracking-tight"
          style={{ color: "#7A0019" }}
        >
          Sistema de Exámenes CBT No.2 San Felipe del Progreso
        </h1>

        <p className="text-center mb-8" style={{ color: "#6A0015" }}>
          Inicia sesión para acceder a tu cuenta
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#7A0019" }}
            >
              Matrícula
            </label>
            <input
              placeholder="Ej. 202400123"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              className="w-full p-3 rounded-lg focus:ring-2 focus:outline-none"
              style={{
                border: "2px solid #C9A84E",
              }}
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#7A0019" }}
            >
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg focus:ring-2 focus:outline-none"
              style={{
                border: "2px solid #C9A84E",
              }}
              required
            />
          </div>

          {error && (
            <div className="p-2 rounded-lg text-center text-sm bg-red-100 text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 text-white rounded-lg font-semibold transition-all duration-200 shadow-md"
            style={{ backgroundColor: "#7A0019" }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#5E0013")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#7A0019")}
          >
            Entrar
          </button>
        </form>

        <p
          className="text-center mt-6 text-xs"
          style={{ color: "#6A0015" }}
        >
          © 2025 CBT — Sistema de Exámenes Institucional
        </p>
      </div>
    </div>
  );
}
