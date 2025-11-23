import { useState } from "react";
import ENSAButton from "../components/ENSAButton.jsx";

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
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-md bg-white/15 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-8 sm:p-10 text-center">
        {/* Logo ENSA */}
        <img
          src="/recursos/ensa-logo.png"
          alt="ENSA logo"
          className="w-28 mx-auto mb-3"
        />

        <h1 className="text-white text-3xl font-bold mb-8 tracking-wide">
          Acceso ENSA
        </h1>

        <div className="space-y-4 text-left">
          <div>
            <label className="block text-sm text-blue-100 mb-1">
              Usuario
            </label>
            <input
              type="text"
              name="user"
              placeholder="Ingrese su usuario"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/90 text-slate-800 text-sm outline-none border border-transparent
                         focus:border-green-400 focus:ring-2 focus:ring-green-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-blue-100 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="pass"
              placeholder="Ingrese su contraseña"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/90 text-slate-800 text-sm outline-none border border-transparent
                         focus:border-green-400 focus:ring-2 focus:ring-green-300 transition-all"
            />
          </div>
        </div>

        <div className="mt-7">
          <ENSAButton text="Iniciar sesión" onClick={handleLogin} />
        </div>

        <p className="mt-4 text-xs text-blue-100/80">
          Sistema de autenticación corporativa – ENSA
        </p>
      </div>
    </div>
  );
}
