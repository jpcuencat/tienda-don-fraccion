import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Fraction from "fraction.js";
import { PizzaPiece } from "./PizzaPiece";
import { PizzaDropZone } from "./PizzaDropZone";
import { Link } from "react-router-dom";

const STORAGE_KEY = "simulador_fracciones_progreso";

export const PizzaSimulator = () => {
  const [slices, setSlices] = useState<{ id: string; value: Fraction; color: string }[]>([]);
  const [total, setTotal] = useState<Fraction>(new Fraction(0));
  const [colorIndex, setColorIndex] = useState(0);
  const [target, setTarget] = useState(new Fraction(3, 4));
  const [maxPieces, setMaxPieces] = useState(2);
  

  const getInitialProgress = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return { intentos: 0, aciertos: 0, historial: [] };
      const parsed = JSON.parse(saved);
      return {
        intentos: typeof parsed.intentos === "number" ? parsed.intentos : 0,
        aciertos: typeof parsed.aciertos === "number" ? parsed.aciertos : 0,
        historial: Array.isArray(parsed.historial) ? parsed.historial : [],
      };
    } catch (e) {
      console.error("Error leyendo progreso inicial:", e);
      return { intentos: 0, aciertos: 0, historial: [] };
    }
  };

  const initialProgress = getInitialProgress();
  const [intentos, setIntentos] = useState(initialProgress.intentos);
  const [aciertos, setAciertos] = useState(initialProgress.aciertos);
  const [historial, setHistorial] = useState(initialProgress.historial);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const pieces = [
    { id: "p1", fraction: "1/2" },
    { id: "p2", fraction: "1/3" },
    { id: "p3", fraction: "1/4" },
    { id: "p4", fraction: "1/5" },
    { id: "p5", fraction: "1/6" },
    { id: "p6", fraction: "1/8" },
    { id: "p7", fraction: "2/3" },
    { id: "p8", fraction: "3/4" },
  ];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.intentos === "number") setIntentos(parsed.intentos);
        if (typeof parsed.aciertos === "number") setAciertos(parsed.aciertos);
        if (Array.isArray(parsed.historial)) setHistorial(parsed.historial);
      } catch (e) {
        console.error("Error al cargar datos guardados:", e);
      }
    }
  }, []);

  useEffect(() => {
    const data = { intentos, aciertos, historial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [intentos, aciertos, historial]);

  const handleReset = () => {
    setSlices([]);
    setTotal(new Fraction(0));
    setColorIndex(0);
    setFloatingText("✔️ ¡Resuelve y registra el reto o Intenta cambiando a nuevo reto!");
  };

const [hintText, setHintText] = useState("");

useEffect(() => {
  const getHintText = (target: Fraction, total: Fraction): string => {
    const tStr = `${target.n}/${target.d}`;
    const hints: Record<string, string> = {
      "1/2": "✨ 1/4 + 1/4 o 1/3 + 1/6 también suman 1/2.",
      "2/3": "🔎 Usa dos piezas de 1/3 o una de 1/6 y una de 1/2.",
      "3/4": "🍕 1/2 + 1/4 es una combinación sencilla y común.",
      "5/6": "🧠 Intenta con 1/2 + 1/3 o tres piezas de 1/6.",
      "4/5": "📏 Puedes combinar 1/5 + 3/5 si están disponibles.",
      "7/8": "🥧 1/2 + 1/4 + 1/8 puede ayudarte a lograrlo.",
      "2/5": "📐 1/5 + 1/5 es una buena opción si hay piezas pequeñas.",
      "3/8": "🍰 Usa 1/8 tres veces o combina 1/4 + 1/8 si tienes suerte.",
      "5/8": "🍕 Prueba 1/2 + 1/8 o 1/4 + 1/4 + 1/8.",
      "3/5": "🔢 Combina 1/5 + 2/5 o usa una de 1/2 y una más pequeña.",
    };

    if (total.compare(target) > 0) return "🚫 Te pasaste, prueba con fracciones más pequeñas.";
    if (total.compare(target) < 0 && !total.equals(0)) return "⏳ Aún te falta un poco. ¿Qué podrías sumar?";
    if (total.equals(target)) return "🎯 ¡Bien hecho! Puedes registrar tu intento.";
    return hints[tStr] || "💡 Prueba diferentes combinaciones y observa el total.";
  };

  setHintText(getHintText(target, total));
}, [target, total]);


  const handleDrop = (fraction: string) => {
    setFloatingText(getHintText(target, total));
  };

  const generarNuevoDesafio = () => {
    const opciones = [
      new Fraction(1, 2), new Fraction(2, 3), new Fraction(3, 4),
      new Fraction(5, 6), new Fraction(4, 5), new Fraction(7, 8),
    ];
    const nuevo = opciones[Math.floor(Math.random() * opciones.length)];
    const max = Math.floor(Math.random() * 3) + 2; // entre 2 y 4
    setTarget(nuevo);
    setMaxPieces(max);
    handleReset();
  };

  const evaluarDesafio = () => {
    const esCorrecto = total.equals(target) && slices.length <= maxPieces;
    setIntentos((prev) => prev + 1);
    if (esCorrecto) setAciertos((prev) => prev + 1);
    setFloatingText(esCorrecto ? "🎉 ¡Bien hecho! Has acertado." : "❌ No es correcto. ¡Intenta otra combinación!");
    setHistorial((prev) => [
      { objetivo: `${target.n}/${target.d}`, resultado: esCorrecto ? "✔️ Correcto" : "❌ Incorrecto" },
      ...prev.slice(0, 4),
    ]);
    generarNuevoDesafio();
  };

  const borrarProgreso = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIntentos(0);
    setAciertos(0);
    setHistorial([]);
  };

  

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gradient-to-br from-pink-800 to-yellow-700 p-6 gap-6">
        <aside className="w-full lg:w-80 bg-white/10 backdrop-blur-md rounded-xl text-white p-4 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">📊 Progreso</h2>
          <p>🎯 Intentos: {intentos}</p>
          <p>🏅 Aciertos: {aciertos}</p>
          <div className="mt-4 flex flex-col gap-2">
            <button onClick={generarNuevoDesafio} className="bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-2 rounded">🔄 Cambiar de desafío</button>
            <button onClick={handleReset} className="bg-yellow-600 hover:bg-yellow-700 transition text-white px-3 py-2 rounded">♻️ Reiniciar Desafío Actual</button>
            <button onClick={evaluarDesafio} className="bg-green-600 hover:bg-green-700 transition text-white px-3 py-2 rounded">✅ Registrar intento en Historial</button>
            <button onClick={borrarProgreso} className="bg-red-600 hover:bg-red-700 transition text-white px-3 py-2 rounded text-sm">🗑 Borrar Historial</button>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold text-sm text-white mb-2">🧾 Historial:</h3>
            <div className={`overflow-y-auto border border-white/20 rounded-lg ${mostrarHistorial ? "h-auto max-h-[320px]" : "h-[120px]"} transition-all duration-300`}>
              <table className="w-full text-xs text-white text-left table-fixed">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-2 py-1 w-1/2">Objetivo</th>
                    <th className="px-2 py-1 w-1/2">Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.length === 0 ? (
                    <tr><td colSpan={2} className="px-2 py-2 italic text-center">No hay intentos aún.</td></tr>
                  ) : (
                    historial.map((item, idx) => (
                      <tr key={idx} className="odd:bg-white/5 even:bg-white/0">
                        <td className="px-2 py-1">{item.objetivo}</td>
                        <td className="px-2 py-1">{item.resultado}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {historial.length > 5 && (
              <div className="text-center mt-2">
                <button onClick={() => setMostrarHistorial((prev) => !prev)} className="text-xs text-blue-300 hover:underline">
                  {mostrarHistorial ? "🔽 Ver menos" : "🔼 Ver todo"}
                </button>
              </div>
            )}
          </div>
          <Link to="/" className="mt-4 text-sm text-white underline hover:text-yellow-300">⬅ Volver al inicio</Link>
        </aside>

        <main className="flex-1 flex flex-col items-center justify-start gap-6">
          <div className="text-white text-center">
            <h1 className="text-3xl font-bold">🧩 Simulador de Fracciones</h1>
            <p className="text-sm">
              Reto: forma <strong>{target.n}/{target.d}</strong> con máximo <strong>{maxPieces}</strong> porciones
            </p>
        
            {hintText && (
                <div className="mt-2 text-white bg-black/30 p-2 rounded shadow text-sm max-w-md">
                {hintText}
                </div>
            )}

          </div>

          <PizzaDropZone
            onDropFraction={handleDrop}
            slices={slices}
            setSlices={setSlices}
            total={total}
            setTotal={setTotal}
            colorIndex={colorIndex}
            setColorIndex={setColorIndex}
            target={target}
            maxPieces={maxPieces}
          />

          <div className="flex gap-3 flex-wrap justify-center mt-4">
            {pieces.map((p) => (
              <PizzaPiece key={p.id} id={p.id} fraction={p.fraction} />
            ))}
          </div>
        </main>
      </div>
    </DndProvider>
  );
};
