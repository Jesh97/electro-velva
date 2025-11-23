import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PenTool, CheckCircle, X } from "lucide-react";
import Menu from "../components/Menu";
import Swal from "sweetalert2";

function FirmarDocumentoPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState("contratos");
  const [documento, setDocumento] = useState(null);
  const [firmaCanvas, setFirmaCanvas] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature, setSignature] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simular carga de documento
    setDocumento({
      id: parseInt(id),
      numero: `DOC-${String(id).padStart(3, "0")}`,
      titulo: "Contrato de Servicios Eléctricos",
      tipo: "Contrato"
    });

    // Inicializar canvas de firma
    const canvas = document.getElementById("signatureCanvas");
    if (canvas) {
      setFirmaCanvas(canvas);
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }, [id]);

  const startDrawing = (e) => {
    if (!firmaCanvas) return;
    setIsDrawing(true);
    const rect = firmaCanvas.getBoundingClientRect();
    const ctx = firmaCanvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
  };

  const draw = (e) => {
    if (!isDrawing || !firmaCanvas) return;
    const rect = firmaCanvas.getBoundingClientRect();
    const ctx = firmaCanvas.getContext("2d");
    ctx.lineTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (firmaCanvas) {
      const dataURL = firmaCanvas.toDataURL();
      setSignature(dataURL);
    }
  };

  const clearSignature = () => {
    if (firmaCanvas) {
      const ctx = firmaCanvas.getContext("2d");
      ctx.clearRect(0, 0, firmaCanvas.width, firmaCanvas.height);
      setSignature(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!signature) {
      await Swal.fire({
        title: "Firma requerida",
        text: "Por favor, proporciona tu firma antes de continuar",
        icon: "warning",
        confirmButtonColor: "#1d4ed8"
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Confirmar firma?",
      text: "Esta acción no se puede deshacer",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmar Firma",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280"
    });

    if (result.isConfirmed) {
      setIsSubmitting(true);

      // Simular envío de firma
      // En producción, esto enviaría la firma a la API
      setTimeout(async () => {
        setIsSubmitting(false);
        await Swal.fire({
          title: "¡Firma exitosa!",
          text: "El documento ha sido firmado correctamente",
          icon: "success",
          confirmButtonColor: "#1d4ed8"
        });
        navigate(`/contratos/${id}`);
      }, 1500);
    }
  };

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Menu activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 ml-56 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/contratos/${id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
            >
              <ArrowLeft size={20} />
              Volver al Documento
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Firmar Documento
            </h1>
            <p className="text-gray-600">
              {documento.numero} - {documento.titulo}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="space-y-6">
              {/* Información del documento */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Documento a firmar</h3>
                <p className="text-blue-800 text-sm">
                  Al firmar este documento, confirmas que has leído y aceptas los términos y condiciones establecidos.
                </p>
              </div>

              {/* Canvas de firma */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Firma Digital <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                  <canvas
                    id="signatureCanvas"
                    width="600"
                    height="200"
                    className="border border-gray-200 rounded cursor-crosshair w-full"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      const mouseEvent = new MouseEvent("mousedown", {
                        clientX: touch.clientX,
                        clientY: touch.clientY
                      });
                      startDrawing(mouseEvent);
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      const mouseEvent = new MouseEvent("mousemove", {
                        clientX: touch.clientX,
                        clientY: touch.clientY
                      });
                      draw(mouseEvent);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      stopDrawing();
                    }}
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Dibuja tu firma en el área de arriba
                    </p>
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      <X size={16} />
                      Limpiar
                    </button>
                  </div>
                </div>
              </div>

              {/* Vista previa de firma */}
              {signature && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Vista previa de tu firma:</p>
                  <img src={signature} alt="Firma" className="border border-gray-300 rounded bg-white p-2 max-w-xs" />
                </div>
              )}

              {/* Checkbox de confirmación */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="confirmacion"
                  required
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="confirmacion" className="text-sm text-gray-700">
                  Confirmo que he leído y entendido el contenido del documento y estoy de acuerdo con los términos establecidos.
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/contratos/${id}`)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !signature}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PenTool size={18} />
                {isSubmitting ? "Firmando..." : "Confirmar Firma"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FirmarDocumentoPage;

