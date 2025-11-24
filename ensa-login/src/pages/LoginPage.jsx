import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ENSAButton from "../components/ENSAButton.jsx";
import { authAPI } from "../services/api";
import Swal from "sweetalert2";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: "", contrasena: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.correo.trim() || !form.contrasena.trim()) {
      await Swal.fire({
        title: "Error",
        text: "Complete todos los campos",
        icon: "error",
        confirmButtonColor: "#1d4ed8"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.login(form.correo, form.contrasena);
      
      // Guardar token y usuario
      localStorage.setItem("token", response.token);
      localStorage.setItem("usuario", JSON.stringify(response.usuario));
      
      await Swal.fire({
        title: "¡Bienvenido!",
        text: `Hola ${response.usuario.nombre}`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
      
      navigate("/dashboard");
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text: error.message || "Credenciales inválidas",
        icon: "error",
        confirmButtonColor: "#1d4ed8"
      });
    } finally {
      setIsLoading(false);
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
              Correo Electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              placeholder="Ingrese su correo"
              onChange={handleChange}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
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
              name="contrasena"
              value={form.contrasena}
              placeholder="Ingrese su contraseña"
              onChange={handleChange}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 rounded-xl bg-white/90 text-slate-800 text-sm outline-none border border-transparent
                         focus:border-green-400 focus:ring-2 focus:ring-green-300 transition-all"
            />
          </div>
        </div>

        <div className="mt-7">
          <ENSAButton 
            text={isLoading ? "Iniciando sesión..." : "Iniciar sesión"} 
            onClick={handleLogin}
            disabled={isLoading}
          />
        </div>

        <p className="mt-4 text-xs text-blue-100/80">
          Sistema de autenticación corporativa – ENSA
        </p>
      </div>
    </div>
  );
}
