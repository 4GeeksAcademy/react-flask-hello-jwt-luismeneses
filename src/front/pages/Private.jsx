import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

const Private = () => {
  const [secret, setSecret] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const data = await api.private();
        setSecret(data.secret || "Sin contenido");
      } catch (error) {
        setErr(error.message || "No autorizado o token inválido");
      } finally {
        setLoading(false);
      }
    };

    fetchSecret();
  }, []);

  return (
    <div style={{ maxWidth: 640, margin: "40px auto" }}>
      <h2>Zona privada</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : err ? (
        <p style={{ color: "crimson" }}>{err}</p>
      ) : (
        <p>{secret}</p>
      )}
    </div>
  );
};

export default Private;