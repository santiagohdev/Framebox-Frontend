import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/navbar";
import Loading from "../components/Loading";
import MovieCard from "../components/MovieCard";

function Favorites() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/movies");
      setMovies(res.data.filter((m) => m.favorite));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleFavorite = async (id) => {
    await api.put(`/movies/${id}/favorite`);
    load();
  };

  const deleteMovie = async (id) => {
    await api.delete(`/movies/${id}`);
    load();
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="page container">
        <div className="page-header">
          <h1>❤️ Favoritas</h1>
        </div>

        {movies.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🤍</div>
            <p>Todavía no marcaste ninguna película como favorita</p>
          </div>
        ) : (
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteMovie}
                onMarkSeen={() => {}}
                onEditRating={() => {}}
                onMarkPending={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Favorites;
