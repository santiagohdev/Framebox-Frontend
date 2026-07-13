import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/navbar";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Button from "../components/Button";

function Genres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/genres");
      setGenres(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (genre) => {
    setEditing(genre);
    setName(genre.name);
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("El nombre es requerido");
      return;
    }
    try {
      if (editing) {
        await api.put(`/genres/${editing._id}`, { name });
      } else {
        await api.post("/genres", { name });
      }
      setShowModal(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Error guardando género");
    }
  };

  const deleteGenre = async (id) => {
    if (!confirm("¿Eliminar este género?")) return;
    try {
      await api.delete(`/genres/${id}`);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error eliminando género");
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="page container">
        <div className="page-header">
          <h1>Géneros</h1>
          <Button onClick={openCreate}>+ Nuevo género</Button>
        </div>

        {message && <div className="alert alert-error">{message}</div>}

        {genres.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🎭</div>
            <p>Todavía no creaste géneros</p>
          </div>
        ) : (
          <div className="genre-list">
            {genres.map((g) => (
              <div key={g._id} className="genre-row">
                <span>{g.name}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="secondary" size="sm" onClick={() => openEdit(g)}>Editar</Button>
                  <Button variant="danger" size="sm" onClick={() => deleteGenre(g._id)}>Eliminar</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? "Editar género" : "Nuevo género"} onClose={() => setShowModal(false)}>
          {formError && <div className="alert alert-error">{formError}</div>}
          <form onSubmit={handleSubmit}>
            <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Terror" />
            <Button block>Guardar</Button>
          </form>
        </Modal>
      )}
    </>
  );
}

export default Genres;
