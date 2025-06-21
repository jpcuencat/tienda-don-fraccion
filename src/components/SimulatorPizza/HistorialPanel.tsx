import { useState } from "react";

const HistorialPanel = ({
  historial,
}: {
  historial: { objetivo: string; resultado: string }[];
}) => {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const historialMostrado = mostrarHistorial
    ? historial
    : historial.slice(0, 5);

  return (
    <div className="mt-4">
      <h3 className="font-semibold text-sm text-white">🧾 Historial:</h3>

      <ul className="list-disc list-inside text-xs text-white mt-1 max-h-40 overflow-y-auto pr-2">
        {historial.length === 0 && <li>No hay intentos aún.</li>}
        {historialMostrado.map((item, idx) => (
          <li key={idx}>
            {item.objetivo} → {item.resultado}
          </li>
        ))}
      </ul>

      {historial.length >= 5 && (
        <div className="mt-2 text-center">
          <button
            onClick={() => setMostrarHistorial((prev) => !prev)}
            className="text-xs text-blue-300 hover:underline"
          >
            {mostrarHistorial ? "🔽 Ver menos" : "🔼 Ver todo"}
          </button>
        </div>
      )}
    </div>
  );
};

export default HistorialPanel;
