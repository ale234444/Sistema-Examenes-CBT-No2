import { useState } from "react";
import { api } from "../Api";

import Swal from "sweetalert2";


export default function DashboardAdmin({ user, onLogout }) {
  const [username, setUsername] = useState("");
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ROLE_TEACHER");
  const [message, setMessage] = useState("");

  const [semestre, setSemestre] = useState("");
  const [grupo, setGrupo] = useState("");
  const [selectedTeacherGroups, setSelectedTeacherGroups] = useState([]);

  const semestres = ["1", "2", "3", "4", "5", "6"];
  const grupos = [
    "1 de Administración",
    "2 de Administración",
    "3 de Administración",
    "1 de Informática",
    "2 de Informática",
    "3 de Informática",
  ];

  const handleCheckbox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedTeacherGroups((prev) => [...prev, value]);
    } else {
      setSelectedTeacherGroups((prev) => prev.filter((v) => v !== value));
    }
  };

  const handleRegister = async () => {
  if (!username || !matricula || !password || !role) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor llena todos los campos obligatorios.",
      confirmButtonColor: "#3085d6",
    });
    return;
  }

  const payload = { username, matricula, password, role };

  if (role === "ROLE_STUDENT") {
    if (!semestre || !grupo) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos del alumno",
        text: "Debes seleccionar semestre y grupo.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    payload.semester = semestre;
    payload.group_name = grupo;
  } else if (role === "ROLE_TEACHER") {
    payload.grupos_asignados = selectedTeacherGroups;
  }

  try {
    const res = await api.post("admin/create_user.php", payload);

    if (res.data.success) {
      await Swal.fire({
        icon: "success",
        title: "Usuario registrado",
        text: "El usuario se ha creado correctamente.",
        confirmButtonColor: "#3085d6",
      });

      // Reinicia el formulario
      setUsername("");
      setMatricula("");
      setPassword("");
      setSemestre("");
      setGrupo("");
      setSelectedTeacherGroups([]);
      setRole("ROLE_TEACHER");
      setMessage("");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: res.data.message || "Ocurrió un error al registrar el usuario.",
        confirmButtonColor: "#d33",
      });
    }
  } catch (error) {
    console.error("💥 Error en create_user:", error);
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor.",
      confirmButtonColor: "#d33",
    });
  }
};


  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-100 via-white to-gray-50 p-4">
      {/* ENCABEZADO */}
      <header className="w-full max-w-3xl flex justify-between items-center bg-[#7D1431] text-white px-5 py-3 rounded-lg shadow-md mt-4">

        <h2 className="text-base font-medium">
          Bienvenido Admin:{" "}
          <span className="font-semibold text-blue-200">{user.username}</span>
        </h2>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md text-sm font-semibold transition-all"
        >
          Cerrar Sesión
        </button>
      </header>

      {/* CONTENEDOR PRINCIPAL MÁS CHICO */}
      <div className="w-full max-w-3xl bg-white mt-6 p-6 rounded-xl shadow-lg animate-fadeIn">
        <h3 className="text-xl font-semibold text-center text-blue-800 mb-4">
          Registrar Usuario
        </h3>

        <div className="grid gap-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Nombre completo
            </label>
            <input
              className="w-full border rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
              placeholder="Ej. Juan Pérez"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Matrícula y Contraseña */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Matrícula
              </label>
              <input
                className="w-full border rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                placeholder="Ej. CBT2025A"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                className="w-full border rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Rol del usuario
            </label>
            <select
              className="w-full border rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ROLE_TEACHER">Docente</option>
              <option value="ROLE_STUDENT">Alumno</option>
            </select>
          </div>

          {/* Campos para ALUMNO */}
          {role === "ROLE_STUDENT" && (
            <div className="grid grid-cols-2 gap-3">
              <select
                className="border rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                value={semestre}
                onChange={(e) => setSemestre(e.target.value)}
              >
                <option value="">Selecciona semestre</option>
                {semestres.map((s) => (
                  <option key={s} value={s}>
                    {s}° Semestre
                  </option>
                ))}
              </select>

              <select
                className="border rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                value={grupo}
                onChange={(e) => setGrupo(e.target.value)}
              >
                <option value="">Selecciona grupo</option>
                {grupos.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Campos para DOCENTE */}
          {role === "ROLE_TEACHER" && (
            <div className="border rounded-md p-3 bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-2 text-sm">
                Asignar grupos al docente (opcional)
              </h4>
              <div className="grid grid-cols-2 gap-1.5 text-sm">
                {grupos.map((g) => (
                  <label key={g} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={g}
                      onChange={handleCheckbox}
                      checked={selectedTeacherGroups.includes(g)}
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Botón */}
          <button
  onClick={handleRegister}
  className="w-full py-2.5 bg-[#7D1431] hover:bg-[#5c1026] text-white rounded-md font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
>
  Registrar Usuario
</button>


          {message && (
            <p className="text-center mt-2 text-sm font-medium text-gray-600">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
