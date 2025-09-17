import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setToken, isAuthenticated } from "../lib/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/private");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    if (!email.includes("@") || password.length < 6) {
      setErr("Email inválido o contraseña demasiado corta");
      setLoading(false);
      return;
    }

    try {
      const data = await api.token(email.trim(), password);
      if (data?.token) {
        setToken(data.token); 
        navigate("/private"); 
      } else {
        throw new Error("Token no recibido");
      }
    } catch (error) {
      setErr(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: "1rem" }}>
      <h2>Inicio de sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
      {err && <p style={{ color: "crimson", marginTop: "1rem" }}>{err}</p>}
    </div>
  );
};

export default Login;