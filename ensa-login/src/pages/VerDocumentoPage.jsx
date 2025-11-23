import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PenTool, Download, Calendar, User, FileText } from "lucide-react";
import Menu from "../components/Menu";

function VerDocumentoPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState("contratos");
  const [documento, setDocumento] = useState(null);

  useEffect(() => {
    // Simular carga de documento
    // En producción, esto vendría de una API
    setDocumento({
      id: parseInt(id),
      numero: `DOC-${String(id).padStart(3, "0")}`,
      titulo: "Contrato de Servicios Eléctricos",
      tipo: "Contrato",
      estado: "pendiente",
      contenido: "Este es el contenido del documento. Aquí se mostraría el PDF o el contenido del contrato completo.",
      fechaCreacion: "2024-01-15",
      fechaVencimiento: "2024-02-15",
      creadoPor: "Juan Pérez",
      requiereFirma: true,
      firmantes: [
        { nombre: "Juan Pérez", rol: "Gerente", firmado: false },
        { nombre: "María González", rol: "Director", firmado: false }
      ]
    });
  }, [id]);

  if (!documento) {
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
      firmado: "bg-green-100 text-green-700 border-green-200",
      rechazado: "bg-red-100 text-red-700 border-red-200",
      vencido: "bg-gray-100 text-gray-700 border-gray-200"
    };
    return badges[estado] || badges.pendiente;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Menu activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 ml-56 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/contratos")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
            >
              <ArrowLeft size={20} />
              Volver a Documentos
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {documento.numero}
                </h1>
                <p className="text-gray-600">{documento.titulo}</p>
              </div>
              {documento.estado === "pendiente" && documento.requiereFirma && (
                <button
                  onClick={() => navigate(`/contratos/${id}/firmar`)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                >
                  <PenTool size={18} />
                  Firmar Documento
                </button>
              )}
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Estado</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(documento.estado)}`}>
                  {documento.estado.toUpperCase()}
                </span>
              </div>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Download size={18} />
                Descargar PDF
              </button>
            </div>
          </div>

          {/* Document Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-900">Vista Previa del Documento</h2>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[400px] bg-gray-50">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {documento.contenido}
              </p>
              <p className="text-gray-500 text-sm mt-4 italic">
                En producción, aquí se mostraría el PDF o el contenido completo del documento.
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Información del Documento</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <FileText className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="text-gray-900 font-medium">{documento.tipo}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Fecha de Creación</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(documento.fechaCreacion).toLocaleDateString("es-ES", {
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
                  <p className="text-sm text-gray-600">Fecha de Vencimiento</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(documento.fechaVencimiento).toLocaleDateString("es-ES", {
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
                  <p className="text-gray-900 font-medium">{documento.creadoPor}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Firmantes */}
          {documento.firmantes && documento.firmantes.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Firmantes</h2>
              <div className="space-y-3">
                {documento.firmantes.map((firmante, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{firmante.nombre}</p>
                      <p className="text-sm text-gray-600">{firmante.rol}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      firmante.firmado 
                        ? "bg-green-100 text-green-700" 
                        : "bg-orange-100 text-orange-700"
                    }`}>
                      {firmante.firmado ? "Firmado" : "Pendiente"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerDocumentoPage;

