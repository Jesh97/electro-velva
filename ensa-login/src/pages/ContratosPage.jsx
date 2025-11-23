import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Filter,
  Eye,
  FileText,
  Calendar,
  User,
  CheckCircle,
  Clock,
  PenTool
} from "lucide-react";
import Menu from "../components/Menu";

function ContratosPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("contratos");
  const [documentos, setDocumentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  useEffect(() => {
    // Simular carga de documentos
    // En producción, esto vendría de una API
    setDocumentos([
      {
        id: 1,
        numero: "DOC-001",
        titulo: "Contrato de Servicios Eléctricos",
        tipo: "Contrato",
        estado: "pendiente",
        fechaCreacion: "2024-01-15",
        fechaVencimiento: "2024-02-15",
        creadoPor: "Juan Pérez",
        requiereFirma: true
      },
      {
        id: 2,
        numero: "DOC-002",
        titulo: "Acuerdo de Mantenimiento",
        tipo: "Acuerdo",
        estado: "firmado",
        fechaCreacion: "2024-01-10",
        fechaVencimiento: "2024-12-31",
        creadoPor: "María González",
        requiereFirma: false
      },
      {
        id: 3,
        numero: "DOC-003",
        titulo: "Orden de Trabajo #1234",
        tipo: "Orden",
        estado: "pendiente",
        fechaCreacion: "2024-01-12",
        fechaVencimiento: "2024-01-25",
        creadoPor: "Carlos Rodríguez",
        requiereFirma: true
      }
    ]);
  }, []);

  const getStatusBadge = (estado) => {
    const badges = {
      pendiente: "bg-orange-100 text-orange-700 border-orange-200",
      firmado: "bg-green-100 text-green-700 border-green-200",
      rechazado: "bg-red-100 text-red-700 border-red-200",
      vencido: "bg-gray-100 text-gray-700 border-gray-200"
    };
    return badges[estado] || badges.pendiente;
  };

  const getStatusIcon = (estado) => {
    if (estado === "firmado") {
      return <CheckCircle size={16} />;
    }
    return <Clock size={16} />;
  };

  const filteredDocumentos = documentos.filter(doc => {
    const matchesSearch = 
      doc.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === "todos" || doc.estado === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleView = (id) => {
    navigate(`/contratos/${id}`);
  };

  const handleSign = (id) => {
    navigate(`/contratos/${id}/firmar`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Menu activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 ml-56 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Firma de Documentos
            </h1>
            <p className="text-gray-600">
              Gestiona y firma documentos digitales
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por número, título o tipo..."
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
                  <option value="firmado">Firmado</option>
                  <option value="rechazado">Rechazado</option>
                  <option value="vencido">Vencido</option>
                </select>
              </div>
            </div>
          </div>

          {/* Documentos Table */}
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
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fecha Creación
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Vencimiento
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocumentos.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        No se encontraron documentos
                      </td>
                    </tr>
                  ) : (
                    filteredDocumentos.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">
                            {doc.numero}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {doc.titulo}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {doc.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(doc.estado)}`}>
                            {getStatusIcon(doc.estado)}
                            {doc.estado.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(doc.fechaCreacion).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(doc.fechaVencimiento).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(doc.id)}
                              className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition"
                              title="Ver documento"
                            >
                              <Eye size={18} />
                            </button>
                            {doc.estado === "pendiente" && doc.requiereFirma && (
                              <button
                                onClick={() => handleSign(doc.id)}
                                className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded transition"
                                title="Firmar documento"
                              >
                                <PenTool size={18} />
                              </button>
                            )}
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

export default ContratosPage;

