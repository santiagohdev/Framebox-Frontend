import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/navbar";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Button from "../components/Button";
import StarRating from "../components/StarRating";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";

const emptyForm = { title: "", year: "", description: "", poster: "", genre: "" };

function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const [ratingMovie, setRatingMovie] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);

  const load = async () => {
    try {
      const [moviesRes, genresRes] = await Promise.all([api.get("/movies"), api.get("/genres")]);
      setMovies(moviesRes.data);
      setGenres(genresRes.data);
    } catch {
      setMessage("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.title.trim()) {
      setFormError("El título es requerido");
      return;
    }

    try {
      await api.post("/movies", {
        title: form.title,
        year: form.year ? Number(form.year) : undefined,
        description: form.description,
        poster: form.poster,
        genre: form.genre || undefined,
        status: "Pendiente",
        rating: 0,
      });
      setForm(emptyForm);
      setShowModal(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Error creando película");
    }
  };

  const deleteMovie = async (id) => {
    try {
      await api.delete(`/movies/${id}`);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error eliminando película");
    }
  };

  const markSeen = (id) => {
    setRatingMovie(id);
    setRatingValue(0);
  };

  const confirmRating = async () => {
    try {
      await api.put(`/movies/${ratingMovie}`, { status: "Vista", rating: ratingValue });
      setRatingMovie(null);
      load();
    } catch {
      setMessage("Error actualizando película");
    }
  };

  const editRating = (movie) => {
    setRatingMovie(movie._id);
    setRatingValue(movie.rating || 0);
  };

  const markPending = async (id) => {
    try {
      await api.put(`/movies/${id}`, { status: "Pendiente", rating: 0 });
      load();
    } catch {
      setMessage("Error cambiando estado");
    }
  };

  const toggleFavorite = async (id) => {
    try {
      await api.put(`/movies/${id}/favorite`);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error cambiando favorito");
    }
  };

  const filtered = movies
    .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
    .filter((m) => !statusFilter || m.status === statusFilter);

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="page container">
        <div className="page-header">
          <h1>Mis películas 🎬</h1>
          <Button onClick={() => setShowModal(true)}>+ Agregar película</Button>
        </div>

        {message && <div className="alert alert-error">{message}</div>}

        <div className="movies-toolbar">
          <input
            className="input"
            style={{ maxWidth: 260 }}
            type="text"
            placeholder="Buscar película..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="select" style={{ maxWidth: 200 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Viendo">Viendo</option>
            <option value="Vista">Vista</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🎬</div>
            <p>No hay películas para mostrar</p>
          </div>
        ) : (
          <div className="movie-grid">
            {filtered.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteMovie}
                onMarkSeen={markSeen}
                onEditRating={editRating}
                onMarkPending={markPending}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Agregar película" onClose={() => setShowModal(false)}>
          {formError && <div className="alert alert-error">{formError}</div>}
          <SearchBar
            placeholder="Buscar en TMDB para autocompletar..."
            onSelect={(item) =>
              setForm((f) => ({
                ...f,
                title: item.title,
                year: item.year || "",
                poster: item.poster || "",
                description: item.description || "",
              }))
            }
          />
          <form onSubmit={handleCreate}>
            <Input label="Título" name="title" value={form.title} onChange={handleChange} placeholder="Título" />
            <Input label="Año" name="year" type="number" value={form.year} onChange={handleChange} placeholder="2024" />
            <Input
              label="Género"
              as="select"
              name="genre"
              value={form.genre}
              onChange={handleChange}
              options={
                <>
                  <option value="">Seleccionar género</option>
                  {genres.map((g) => (
                    <option key={g._id} value={g._id}>{g.name}</option>
                  ))}
                </>
              }
            />
            <Input label="Portada (URL)" name="poster" value={form.poster} onChange={handleChange} placeholder="https://..." />
            <div className="field">
              <label>Descripción</label>
              <textarea
                className="input"
                rows={3}
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <Button block>Guardar</Button>
          </form>
        </Modal>
      )}

      {ratingMovie && (
        <Modal title="Puntuar película" onClose={() => setRatingMovie(null)}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <StarRating value={ratingValue} onChange={setRatingValue} size={32} />
            <Button onClick={confirmRating}>Guardar</Button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default Movies;
