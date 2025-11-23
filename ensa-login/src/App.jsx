import { useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import BiometriaPage from "./pages/BiometriaPage.jsx";

export default function App() {
  const [etapa, setEtapa] = useState("login");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-blue-800 to-sky-700 flex items-center justify-center">
      {etapa === "login" && (
        <LoginPage onLoginSuccess={() => setEtapa("biometria")} />
      )}

      {etapa === "biometria" && <BiometriaPage />}
    </div>
  );
}
