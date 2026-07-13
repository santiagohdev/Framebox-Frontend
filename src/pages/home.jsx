import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="landing-hero">
      <div className="landing-logo">🎬 FrameBox</div>
      <p className="tagline">
        Tu biblioteca personal de películas. Organizá lo que viste, lo que querés ver,
        puntuá y armá tu colección favorita.
      </p>

      <div className="landing-actions">
        <Link to="/login">
          <button className="btn btn-secondary">Iniciar sesión</button>
        </Link>
        <Link to="/register">
          <button className="btn btn-primary">Registrarse</button>
        </Link>
      </div>

      <div className="landing-features">
        <div className="card">
          <div className="icon">📚</div>
          <p>Tu colección, ordenada por estado y género</p>
        </div>
        <div className="card">
          <div className="icon">⭐</div>
          <p>Puntuá y llevá tu propio ranking</p>
        </div>
        <div className="card">
          <div className="icon">❤️</div>
          <p>Marcá tus favoritas para encontrarlas rápido</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
