import { useState } from "react";
import ENSAButton from "../components/ENSAButton";
import "../styles/ensa.css";

export default function LoginPage({ onLoginSuccess }) {
  const [form, setForm] = useState({ user: "", pass: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    if (form.user.trim() && form.pass.trim()) {
      onLoginSuccess();
    } else {
      alert("Complete los campos");
    }
  };

  return (
    <div className="pantalla-centrada">
      <div className="ensa-card">
        
        {/* LOGO ENSA */}
        <img
          className="ensa-logo"
          src="/recursos/ENSA logo.png"
          alt="ENSA Logo"
        />

        <h1 className="ensa-title">Acceso ENSA</h1>

        <input
          className="ensa-input"
          type="text"
          name="user"
          placeholder="Usuario"
          onChange={handleChange}
        />

        <input
          className="ensa-input"
          type="password"
          name="pass"
          placeholder="Contraseña"
          onChange={handleChange}
        />

        <ENSAButton text="Iniciar sesión" onClick={handleLogin} />
      </div>
    </div>
  );
}
