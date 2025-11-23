import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Calendar, User, MapPin, Tag } from "lucide-react";
import Menu from "../components/Menu";

function VerIncidentePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState("incidentes");
  const [incidente, setIncidente] = useState(null);

  useEffect(() => {
    // Simular carga de incidente
    // En producción, esto vendría de una API
    setIncidente({
      id: parseInt(id),
      numero: `INC-${String(id).padStart(3, "0")}`,
      titulo: "Falla en sistema eléctrico",
      descripcion: "Corte de energía en el sector norte debido a una falla en el transformador principal. Se requiere intervención inmediata para restaurar el servicio.",
      estado: "pendiente",
      prioridad: "alta",
      categoria: "Eléctrico",
      ubicacion: "Sector Norte - Subestación Principal",
      fechaCreacion: "2024-01-15",
      fechaActualizacion: "2024-01-16",
      creadoPor: "Juan Pérez",
      observaciones: "El transformador muestra signos de sobrecalentamiento. Se recomienda revisión completa del sistema de distribución."
    });
  }, [id]);

  if (!incidente) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Menu activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="flex-1 ml-56 p-8 flex items-center justify-center">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (estado) => {
    const badges = {
      pendiente: "bg-orange-100 text-orange-700 border-orange-200",
      en_proceso: "bg-blue-100 text-blue-700 border-blue-200",
      resuelto: "bg-green-100 text-green-700 border-green-200",
      cerrado: "bg-gray-100 text-gray-700 border-gray-200"
    };
    return badges[estado] || badges.pendiente;
  };

  const getPriorityBadge = (prioridad) => {
    const badges = {
      alta: "bg-red-100 text-red-700",
      media: "bg-yellow-100 text-yellow-700",
      baja: "bg-gray-100 text-gray-700"
    };
    return badges[prioridad] || badges.media;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Menu activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 ml-56 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/incidentes")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
            >
              <ArrowLeft size={20} />
              Volver a Incidentes
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {incidente.numero}
                </h1>
                <p className="text-gray-600">{incidente.titulo}</p>
              </div>
              <button
                onClick={() => navigate(`/incidentes/${id}/editar`)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
              >
                <Edit size={18} />
                Editar
              </button>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-2">Estado</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(incidente.estado)}`}>
                {incidente.estado.replace("_", " ").toUpperCase()}
              </span>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-2">Prioridad</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadge(incidente.prioridad)}`}>
                {incidente.prioridad.toUpperCase()}
              </span>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-2">Categoría</p>
              <span className="text-gray-900 font-medium">{incidente.categoria || "N/A"}</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{incidente.descripcion}</p>

            {incidente.observaciones && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">Observaciones</h2>
                <p className="text-gray-700 leading-relaxed">{incidente.observaciones}</p>
              </>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Detallada</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Ubicación</p>
                  <p className="text-gray-900 font-medium">{incidente.ubicacion || "No especificada"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Fecha de Creación</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(incidente.fechaCreacion).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Última Actualización</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(incidente.fechaActualizacion).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <User className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Creado por</p>
                  <p className="text-gray-900 font-medium">{incidente.creadoPor}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerIncidentePage;

