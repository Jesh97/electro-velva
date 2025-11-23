import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import Menu from "../components/Menu";
import Swal from "sweetalert2";

function EditarIncidentePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState("incidentes");
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    prioridad: "media",
    estado: "pendiente",
    categoria: "",
    ubicacion: "",
    observaciones: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simular carga de incidente
    // En producción, esto vendría de una API
    setFormData({
      titulo: "Falla en sistema eléctrico",
      descripcion: "Corte de energía en el sector norte debido a una falla en el transformador principal.",
      prioridad: "alta",
      estado: "pendiente",
      categoria: "Eléctrico",
      ubicacion: "Sector Norte - Subestación Principal",
      observaciones: "El transformador muestra signos de sobrecalentamiento."
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validación
    if (!formData.titulo.trim() || !formData.descripcion.trim()) {
      await Swal.fire({
        title: "Error",
        text: "Por favor completa todos los campos requeridos",
        icon: "error",
        confirmButtonColor: "#1d4ed8"
      });
      setIsSubmitting(false);
      return;
    }

    // Simular guardado
    setTimeout(async () => {
      setIsSubmitting(false);
      await Swal.fire({
        title: "¡Éxito!",
        text: "El incidente ha sido actualizado correctamente",
        icon: "success",
        confirmButtonColor: "#1d4ed8"
      });
      navigate(`/incidentes/${id}`);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Menu activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 ml-56 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/incidentes/${id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
            >
              <ArrowLeft size={20} />
              Volver al Incidente
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Editar Incidente
            </h1>
            <p className="text-gray-600">
              Modifica la información del incidente
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Incidente <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Falla en sistema eléctrico"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe el incidente en detalle..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Prioridad y Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="prioridad"
                    value={formData.prioridad}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="resuelto">Resuelto</option>
                    <option value="cerrado">Cerrado</option>
                  </select>
                </div>
              </div>

              {/* Categoría y Ubicación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <input
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    placeholder="Ej: Eléctrico, Mecánico, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    placeholder="Ej: Sector Norte, Edificio A"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones Adicionales
                </label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Información adicional relevante..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/incidentes/${id}`)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarIncidentePage;

