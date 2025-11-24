import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Home,
  ClipboardList,
  FileText,
  User,
  LogOut,
  PlusCircle
} from "lucide-react";

function Menu({ activeSection = "inicio", onSectionChange }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Cargar usuario desde localStorage (solo front)
  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) setUsuario(JSON.parse(userData));
    setTimeout(() => setIsVisible(true), 150);
  }, []);

  const handleNavigation = (section, route) => {
    if (onSectionChange) onSectionChange(section);
    navigate(route);
  };

  // Logout SOLO FRONTEND
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Se cerrará tu sesión actual.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cerrar sesión",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      background: "#ffffff",
      color: "#1e293b",
      confirmButtonColor: "#1d4ed8",
      cancelButtonColor: "#94a3b8",
    });

    if (result.isConfirmed) {
      // Eliminar datos locales
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      setUsuario(null);

      await Swal.fire({
        title: "Sesión cerrada",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

      navigate("/login");
    }
  };

  return (
    <div
      className={`w-56 bg-white h-screen border-r border-gray-200 fixed top-0 left-0 z-50 flex flex-col justify-between shadow-sm transform transition-all duration-500 ${
        isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
      }`}
    >
      {/* --------- LOGO --------- */}
      <div
        className="p-5 pb-7 flex items-center justify-center cursor-pointer"
        onClick={() => handleNavigation("inicio", "/dashboard")}
      >
        <img
          src="/recursos/ENSA logo.png"
          alt="ENSA"
          className="w-20 opacity-90 hover:opacity-100 transition"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* --------- OPCIONES --------- */}
      <div className="px-5 flex-1 overflow-y-auto scrollbar-hide">
        <nav className="space-y-1">
          {[
            { icon: Home, label: "Inicio", route: "/dashboard", key: "inicio" },
            {
              icon: ClipboardList,
              label: "Incidentes",
              route: "/incidentes",
              key: "incidentes",
            },
            {
              icon: FileText,
              label: "Contratos",
              route: "/contratos",
              key: "contratos",
            },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavigation(item.key, item.route)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium shadow-inner"
                    : "text-gray-700 hover:text-blue-700 hover:bg-gray-100"
                } hover:translate-x-1`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* --------- NUEVO INCIDENTE --------- */}
        <button
          onClick={() => handleNavigation("nuevo-incidente", "/crear_incidente")}
          className="w-full flex items-center justify-center gap-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-200 text-sm"
        >
          <PlusCircle size={16} />
          <span>Crear nuevo incidente</span>
        </button>
      </div>

      {/* --------- PERFIL + LOGOUT --------- */}
      <div className="p-4 border-t border-gray-200">
        <div
          className="flex items-center cursor-pointer hover:bg-gray-100 rounded p-2 transition"
          onClick={() => handleNavigation("perfil", "/perfil")}
        >
          <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={17} className="text-gray-600" />
          </div>
          <div className="ml-2 text-sm">
            <div className="font-medium text-gray-900 truncate max-w-[120px]">
              {usuario?.NOMBRE || "Usuario"}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 mt-3 text-red-600 border border-red-300 hover:border-red-500 py-2 rounded-md text-sm transition-all hover:scale-[1.03]"
        >
          <LogOut size={15} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}

export default Menu;
