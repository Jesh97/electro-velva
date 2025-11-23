import { useEffect, useRef, useState } from "react";
import "../styles/ensa.css";

export default function BiometriaPage() {
  const videoRef = useRef(null);
  const [captured, setCaptured] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  const capturar = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    const imageData = canvas.toDataURL("image/png");
    setCaptured(imageData);

    alert("Imagen capturada. Lista para enviar al backend.");
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px"
    }}>
      
      <h1 className="ensa-title">Verificación Biométrica ENSA</h1>

      {!captured ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            style={{
              width: "380px",
              borderRadius: "14px",
              border: "4px solid var(--ensa-blue-dark)"
            }}
          />
          <button className="ensa-button" onClick={capturar} style={{ marginTop: "20px" }}>
            Capturar rostro
          </button>
        </>
      ) : (
        <>
          <img src={captured} alt="captured" width={380} style={{ borderRadius: "14px" }} />
          <p style={{ marginTop: "20px", color: "var(--ensa-blue-dark)", fontWeight: "600" }}>
            Imagen lista para validar biometría.
          </p>
        </>
      )}
    </div>
  );
}
