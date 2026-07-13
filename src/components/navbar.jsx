import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <span className="navbar-logo">🎬 FrameBox</span>

      <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Menú">
        ☰
      </button>

      <div className={`navbar-links${open ? " open" : ""}`} onClick={() => setOpen(false)}>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/movies" className={({ isActive }) => (isActive ? "active" : "")}>
          Películas
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => (isActive ? "active" : "")}>
          Favoritas
        </NavLink>
        <NavLink to="/genres" className={({ isActive }) => (isActive ? "active" : "")}>
          Géneros
        </NavLink>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
