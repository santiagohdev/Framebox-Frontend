import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/navbar";
import Loading from "../components/Loading";

function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/movies")
      .then((res) => setMovies(res.data))
      .finally(() => setLoading(false));
  }, []);

  const total = movies.length;
  const vistas = movies.filter((m) => m.status === "Vista").length;
  const pendientes = movies.filter((m) => m.status === "Pendiente").length;
  const favoritas = movies.filter((m) => m.favorite).length;
  const recientes = [...movies]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="page container">
        <div className="page-header">
          <h1>Bienvenido a FrameBox 🎬</h1>
        </div>

        <div className="stats-grid">
          <div className="card stat-card">
            <span className="value">{total}</span>
            <span className="label">Total de películas</span>
          </div>
          <div className="card stat-card">
            <span className="value">{vistas}</span>
            <span className="label">Vistas</span>
          </div>
          <div className="card stat-card">
            <span className="value">{pendientes}</span>
            <span className="label">Pendientes</span>
          </div>
          <div className="card stat-card">
            <span className="value">{favoritas}</span>
            <span className="label">Favoritas</span>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Accesos rápidos</h2>
          <div className="quick-actions">
            <Link to="/movies"><button className="btn btn-primary">Mis películas</button></Link>
            <Link to="/favorites"><button className="btn btn-secondary">Favoritas</button></Link>
            <Link to="/genres"><button className="btn btn-secondary">Géneros</button></Link>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Últimas agregadas</h2>
          {recientes.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🎬</div>
              <p>Todavía no agregaste películas</p>
            </div>
          ) : (
            <ul className="genre-list">
              {recientes.map((m) => (
                <li key={m._id} className="genre-row">
                  <span>{m.title} {m.year && `(${m.year})`}</span>
                  <span className={`badge badge-${m.status.toLowerCase()}`}>{m.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
