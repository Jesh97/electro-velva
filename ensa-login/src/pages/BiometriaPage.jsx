import { useEffect, useRef, useState } from "react";

export default function BiometriaPage() {
  const videoRef = useRef(null);
  const [captured, setCaptured] = useState(null);

  useEffect(() => {
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error al acceder a la cámara:", err);
        alert("No se pudo acceder a la cámara");
      }
    }

    enableCamera();
  }, []);

  const capturar = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");
    setCaptured(imageData);
  };

  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-xl bg-white/15 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-6 sm:p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Verificación biométrica</h2>
        <p className="text-sm text-blue-100 mb-6">
          Mire de frente a la cámara y mantenga su rostro dentro del recuadro.
        </p>

        {!captured ? (
          <>
            <div className="flex justify-center mb-6">

              <div className="
      relative w-[320px] h-[420px]
      rounded-[200px] overflow-hidden
      border-[6px] border-blue-300
      shadow-[0_0_40px_rgba(0,126,255,0.5)]
      bg-black
      transition-all duration-300 ease-out
    "
              >

                {/* Glow dinámico */}
                <div
                  className={`
        absolute inset-0 rounded-[200px] z-10 
        pointer-events-none
        transition-all duration-300
        ${captured ? "shadow-[0_0_40px_15px_rgba(34,197,94,0.8)]" : "shadow-[0_0_30px_8px_rgba(56,189,248,0.6)]"}
      `}
                ></div>

                {/* Video en vivo */}
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-full h-full object-cover"
                />

              </div>

              {/* Indicador cuadrado de seguimiento estilo Face ID */}
              <div className="
    absolute z-20 inset-0 flex items-center justify-center
    pointer-events-none
">
                <div className="
      w-40 h-40 border-4 
      rounded-2xl border-white/60 
      animate-pulse
    "
                ></div>
              </div>

            </div>

            <div className="mt-4 mb-2 text-sm text-blue-100 font-medium">
              {captured
                ? "✔ Rostro capturado correctamente"
                : "Acerca tu rostro al área y mantén la posición"}
            </div>




            <button
              onClick={capturar}
              className="px-6 py-3 bg-green-500 hover:bg-green-400 active:scale-95 rounded-xl font-semibold text-sm shadow-md transition-all"
            >
              Capturar rostro
            </button>
          </>
        ) : (
          <>
            <p className="mb-4 text-sm text-blue-100">
              Captura realizada. Esta imagen está lista para ser enviada al
              backend para validar la biometría.
            </p>
            <img
              src={captured}
              alt="Rostro capturado"
              className="w-full max-w-md rounded-2xl shadow-lg border border-white/40 mx-auto"
            />
          </>
        )}
      </div>
    </div>
  );
}
