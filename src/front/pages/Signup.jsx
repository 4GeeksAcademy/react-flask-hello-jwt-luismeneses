import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");

    try {
      await api.signup(email.trim(), password);
      setOk("Cuenta creada correctamente. Redirigiendo...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setErr(error.message || "Error al crear la cuenta");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: "1rem" }}>
      <h2>Registro</h2>
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
          <button type="submit" style={{ width: "100%", padding: "0.5rem" }}>
            Crear cuenta
          </button>
        </div>
      </form>

      {ok && <p style={{ color: "green", marginTop: "1rem" }}>{ok}</p>}
      {err && <p style={{ color: "crimson", marginTop: "1rem" }}>{err}</p>}
    </div>
  );
};

export default Signup;