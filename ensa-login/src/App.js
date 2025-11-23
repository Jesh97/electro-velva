import { useState } from "react";
import LoginPage from "../../ensa-login/src/pages/LoginPage";
import BiometriaPage from "../../ensa-login/src/pages/BiometriaPage";

function App() {
  const [etapa, setEtapa] = useState("login");

  return (
    <>
      {etapa === "login" && (
        <LoginPage onLoginSuccess={() => setEtapa("biometria")} />
      )}

      {etapa === "biometria" && <BiometriaPage />}
    </>
  );
}

export default App;
