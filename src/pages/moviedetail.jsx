import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/navbar";
import Loading from "../components/Loading";
import Button from "../components/Button";
import StarRating from "../components/StarRating";

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/movies/${id}`)
      .then((res) => setMovie(res.data))
      .catch(() => setError("No se pudo cargar la película"))
      .finally(() => setLoading(false));
  }, [id]);

  const deleteMovie = async () => {
    if (!confirm("¿Eliminar esta película?")) return;
    await api.delete(`/movies/${id}`);
    navigate("/movies");
  };

  if (loading) return <Loading />;

  if (error || !movie) {
    return (
      <>
        <Navbar />
        <div className="page container">
          <div className="empty-state">
            <div className="icon">🎬</div>
            <p>{error || "Película no encontrada"}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page container">
        <div className="detail-wrap">
          <div className="detail-poster">
            {movie.poster ? <img src={movie.poster} alt={movie.title} /> : "🎬"}
          </div>
          <div className="detail-info">
            <h1>{movie.title}</h1>
            <div className="movie-meta">
              {movie.year && <span>{movie.year}</span>}
              <span>🎭 {movie.genre?.name || "Sin género"}</span>
              <span className={`badge badge-${movie.status?.toLowerCase()}`}>{movie.status}</span>
              {movie.favorite && <span>❤️ Favorita</span>}
            </div>
            {movie.status === "Vista" && <StarRating value={movie.rating || 0} readonly />}
            <p className="desc">{movie.description || "Sin descripción."}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="secondary" onClick={() => navigate("/movies")}>Volver</Button>
              <Button variant="danger" onClick={deleteMovie}>Eliminar</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MovieDetail;
