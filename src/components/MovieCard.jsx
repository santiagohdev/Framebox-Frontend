import { Link } from "react-router-dom";
import StarRating from "./StarRating";

const statusClass = {
  Pendiente: "badge-pendiente",
  Viendo: "badge-viendo",
  Vista: "badge-vista",
};

function MovieCard({ movie, onToggleFavorite, onDelete, onMarkSeen, onEditRating, onMarkPending }) {
  return (
    <div className="movie-card">
      <div className="movie-poster">
        {movie.poster ? <img src={movie.poster} alt={movie.title} /> : "🎬"}
        <button
          className="movie-fav-btn"
          onClick={() => onToggleFavorite(movie._id)}
          aria-label="Favorito"
        >
          {movie.favorite ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="movie-body">
        <Link to={`/movies/${movie._id}`}>
          <h3>{movie.title}</h3>
        </Link>

        <div className="movie-meta">
          {movie.year && <span>{movie.year}</span>}
          <span>🎭 {movie.genre?.name || "Sin género"}</span>
          <span className={`badge ${statusClass[movie.status] || ""}`}>{movie.status}</span>
        </div>

        {movie.status === "Vista" ? (
          <StarRating value={movie.rating || 0} readonly size={16} />
        ) : null}

        <div className="movie-actions">
          {movie.status !== "Vista" ? (
            <button className="btn btn-secondary btn-sm" onClick={() => onMarkSeen(movie._id)}>
              Marcar vista
            </button>
          ) : (
            <>
              <button className="btn btn-secondary btn-sm" onClick={() => onEditRating(movie)}>
                Editar rating
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => onMarkPending(movie._id)}>
                A pendiente
              </button>
            </>
          )}
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(movie._id)}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
