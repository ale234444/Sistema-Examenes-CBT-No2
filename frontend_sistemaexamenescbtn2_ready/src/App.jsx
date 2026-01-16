import { useState } from "react";
//import Login from "./pages/Login"
import Login from "./components/Login";
import DashboardAdmin from "./components/DashboardAdmin";
import DashboardTeacher from "./components/DashboardTeacher";
import DashboardStudent from "./components/DashboardStudent";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Limpiar sesión
  };

  if (!user) return <Login setUser={setUser} />;

  switch (user.role) {
    case "ROLE_ADMIN":
      return <DashboardAdmin user={user} onLogout={handleLogout} />;
    case "ROLE_TEACHER":
      return <DashboardTeacher user={user} onLogout={handleLogout} />;
    case "ROLE_STUDENT":
      return <DashboardStudent user={user} onLogout={handleLogout} />;
    default:
      return <p>Rol no reconocido</p>;
  }
}


export default App;
