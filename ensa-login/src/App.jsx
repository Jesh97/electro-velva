import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import BiometriaPage from "./pages/BiometriaPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import IncidentesPage from "./pages/IncidentesPage.jsx";
import CrearIncidentePage from "./pages/CrearIncidentePage.jsx";
import VerIncidentePage from "./pages/VerIncidentePage.jsx";
import EditarIncidentePage from "./pages/EditarIncidentePage.jsx";
import ContratosPage from "./pages/ContratosPage.jsx";
import VerDocumentoPage from "./pages/VerDocumentoPage.jsx";
import FirmarDocumentoPage from "./pages/FirmarDocumentoPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/biometria" element={<BiometriaPage />} />
        
        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/incidentes"
          element={
            <ProtectedRoute>
              <IncidentesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crear_incidente"
          element={
            <ProtectedRoute>
              <CrearIncidentePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/incidentes/:id"
          element={
            <ProtectedRoute>
              <VerIncidentePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/incidentes/:id/editar"
          element={
            <ProtectedRoute>
              <EditarIncidentePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contratos"
          element={
            <ProtectedRoute>
              <ContratosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contratos/:id"
          element={
            <ProtectedRoute>
              <VerDocumentoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contratos/:id/firmar"
          element={
            <ProtectedRoute>
              <FirmarDocumentoPage />
            </ProtectedRoute>
          }
        />
        
        {/* Ruta por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
