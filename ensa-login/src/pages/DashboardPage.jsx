import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ClipboardAlert, 
  FileText, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Menu from "../components/Menu";

function DashboardPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("inicio");
  const [stats, setStats] = useState({
    incidentesPendientes: 0,
    incidentesResueltos: 0,
    documentosPendientes: 0,
    documentosFirmados: 0
  });

  useEffect(() => {
    // Simular carga de estadísticas
    // En producción, esto vendría de una API
    setStats({
      incidentesPendientes: 5,
      incidentesResueltos: 23,
      documentosPendientes: 3,
      documentosFirmados: 45
    });
  }, []);

  const statCards = [
    {
      title: "Incidentes Pendientes",
      value: stats.incidentesPendientes,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      onClick: () => navigate("/incidentes")
    },
    {
      title: "Incidentes Resueltos",
      value: stats.incidentesResueltos,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      onClick: () => navigate("/incidentes")
    },
    {
      title: "Documentos Pendientes",
      value: stats.documentosPendientes,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      onClick: () => navigate("/contratos")
    },
    {
      title: "Documentos Firmados",
      value: stats.documentosFirmados,
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      onClick: () => navigate("/contratos")
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Menu activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 ml-56 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Resumen de incidentes y documentos
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  onClick={stat.onClick}
                  className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg bg-white`}>
                      <Icon size={24} />
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    {stat.title}
                  </h3>
                  <p className={`${stat.color} text-3xl font-bold`}>
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incidentes Recientes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <ClipboardAlert size={20} className="text-blue-600" />
                  Incidentes Recientes
                </h2>
                <button
                  onClick={() => navigate("/incidentes")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Ver todos →
                </button>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                    onClick={() => navigate("/incidentes")}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          Incidente #{1000 + item}
                        </p>
                        <p className="text-sm text-gray-600">
                          Falla en sistema eléctrico
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                        Pendiente
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documentos Pendientes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FileText size={20} className="text-blue-600" />
                  Documentos Pendientes
                </h2>
                <button
                  onClick={() => navigate("/contratos")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Ver todos →
                </button>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                    onClick={() => navigate("/contratos")}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          Contrato #{2000 + item}
                        </p>
                        <p className="text-sm text-gray-600">
                          Requiere firma digital
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        Pendiente
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

