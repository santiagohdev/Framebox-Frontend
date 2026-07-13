import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/Input";
import Button from "../components/Button";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name.trim()) return "El nombre es requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Email inválido";
    if (form.password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/register", form);
      setSuccess(`Usuario creado: ${response.data.user.email}. Revisá tu correo para verificar la cuenta.`);
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card card">
        <h1>FrameBox 🎬</h1>
        <p className="sub">Creá tu cuenta gratis</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Nombre"
            name="name"
            placeholder="Tu nombre"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Contraseña"
            type="password"
            name="password"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={handleChange}
          />
          <Button block disabled={loading}>
            {loading ? "Creando..." : "Registrarme"}
          </Button>
        </form>

        <p className="auth-footer">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
