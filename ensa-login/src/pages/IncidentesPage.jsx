import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import Menu from "../components/Menu";
import Swal from "sweetalert2";

function IncidentesPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("incidentes");
  const [incidentes, setIncidentes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  useEffect(() => {
    // Simular carga de incidentes
    // En producción, esto vendría de una API
    setIncidentes([
      {
        id: 1,
        numero: "INC-001",
        titulo: "Falla en sistema eléctrico",
        descripcion: "Corte de energía en el sector norte",
        estado: "pendiente",
        prioridad: "alta",
        fechaCreacion: "2024-01-15",
        fechaActualizacion: "2024-01-16",
        creadoPor: "Juan Pérez"
      },
      {
        id: 2,
        numero: "INC-002",
        titulo: "Mantenimiento preventivo",
        descripcion: "Revisión de equipos de distribución",
        estado: "en_proceso",
        prioridad: "media",
        fechaCreacion: "2024-01-14",
        fechaActualizacion: "2024-01-16",
        creadoPor: "María González"
      },
      {
        id: 3,
        numero: "INC-003",
        titulo: "Reparación de transformador",
        descripcion: "Transformador dañado en subestación",
        estado: "resuelto",
        prioridad: "alta",
        fechaCreacion: "2024-01-10",
        fechaActualizacion: "2024-01-15",
        creadoPor: "Carlos Rodríguez"
      }
    ]);
  }, []);

  const getStatusBadge = (estado) => {
    const badges = {
      pendiente: "bg-orange-100 text-orange-700 border-orange-200",
      en_proceso: "bg-blue-100 text-blue-700 border-blue-200",
      resuelto: "bg-green-100 text-green-700 border-green-200",
      cerrado: "bg-gray-100 text-gray-700 border-gray-200"
    };
    return badges[estado] || badges.pendiente;
  };

  const getStatusIcon = (estado) => {
    if (estado === "resuelto" || estado === "cerrado") {
      return <CheckCircle size={16} />;
    } else if (estado === "en_proceso") {
      return <Clock size={16} />;
    }
    return <AlertCircle size={16} />;
  };

  const getPriorityBadge = (prioridad) => {
    const badges = {
      alta: "bg-red-100 text-red-700",
      media: "bg-yellow-100 text-yellow-700",
      baja: "bg-gray-100 text-gray-700"
    };
    return badges[prioridad] || badges.media;
  };

  const filteredIncidentes = incidentes.filter(incidente => {
    const matchesSearch = 
      incidente.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incidente.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incidente.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === "todos" || incidente.estado === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleView = (id) => {
    navigate(`/incidentes/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/incidentes/${id}/editar`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar incidente?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280"
    });

    if (result.isConfirmed) {
      setIncidentes(incidentes.filter(inc => inc.id !== id));
      Swal.fire("Eliminado", "El incidente ha sido eliminado", "success");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Menu activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 ml-56 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestión de Incidentes
              </h1>
              <p className="text-gray-600">
                Administra y sigue el estado de los incidentes
              </p>
            </div>
            <button
              onClick={() => navigate("/crear_incidente")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
            >
              <Plus size={20} />
              Nuevo Incidente
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por número, título o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="resuelto">Resuelto</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Incidentes Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Número
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Prioridad
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Creado por
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIncidentes.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        No se encontraron incidentes
                      </td>
                    </tr>
                  ) : (
                    filteredIncidentes.map((incidente) => (
                      <tr key={incidente.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">
                            {incidente.numero}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {incidente.titulo}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {incidente.descripcion}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(incidente.estado)}`}>
                            {getStatusIcon(incidente.estado)}
                            {incidente.estado.replace("_", " ").toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(incidente.prioridad)}`}>
                            {incidente.prioridad.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(incidente.fechaCreacion).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {incidente.creadoPor}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(incidente.id)}
                              className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition"
                              title="Ver detalles"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(incidente.id)}
                              className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded transition"
                              title="Editar"
                            >
                              <Edit size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentesPage;

