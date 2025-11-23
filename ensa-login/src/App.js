import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import BiometriaPage from "./pages/BiometriaPage";

function App() {
  const [etapa, setEtapa] = useState("login");

  return (
    <div className="min-h-screen w-full">
      {etapa === "login" && (
        <LoginPage onLoginSuccess={() => setEtapa("biometria")} />
      )}

      {etapa === "biometria" && <BiometriaPage />}
    </div>
  );
}

export default App;
