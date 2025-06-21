import { useEffect, useState } from "react";
import { Fraction } from "fraction.js";
import { DraggableFraction } from "./DraggableFraction";
import { FractionDropZone } from "./FractionDropZone";
import confetti from "canvas-confetti";

interface FractionData {
  id: string;
  value: Fraction;
}

export const FractionStaircase = () => {
  const [level, setLevel] = useState<"facil" | "intermedio" | "dificil">("facil");
  const [fractions, setFractions] = useState<FractionData[]>([]);
  const [sorted, setSorted] = useState<FractionData[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const generarFracciones = () => {
    const count = level === "facil" ? 5 : level === "intermedio" ? 7 : 10;
    const generated: FractionData[] = [];
    while (generated.length < count) {
      const numerator = Math.floor(Math.random() * 9) + 1;
      const denominator = Math.floor(Math.random() * 9) + 1;
      if (numerator < denominator) {
        const frac = new Fraction(numerator, denominator);
        if (!generated.find((f) => f.value.equals(frac))) {
          generated.push({
            id: `${numerator}/${denominator}-${Date.now()}-${Math.random()}`,
            value: frac,
          });
        }
      }
    }
    setFractions(generated);
    setSorted([]);
    setFeedback(null);
    setShake(false);
  };

  useEffect(() => {
    generarFracciones();
  }, [level]);

  const handleDrop = (fraction: FractionData) => {
    setSorted((prev) => [...prev, fraction]);
    setFractions((prev) => prev.filter((f) => f.id !== fraction.id));
  };

  const verificarOrden = () => {
    const ordenado = [...sorted].sort((a, b) => a.value.compare(b.value));
    const correcto = sorted.every((f, i) => f.value.equals(ordenado[i].value));

    if (correcto) {
      setFeedback("✅ ¡Correcto! 🎉");
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      setShake(false);
    } else {
      const pista = generarPista(sorted);
      setFeedback("❌ Revisa el orden.\n" + pista);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const generarPista = (lista: FractionData[]): string => {
    const ordenado = [...lista].sort((a, b) => a.value.compare(b.value));
    const errores = lista.filter((f, i) => !f.value.equals(ordenado[i].value));

    if (errores.length > 0) {
      const fracs = errores.map((f) => f.value.toFraction(true)).join(", ");
      return `📌 Tip: Observa bien las fracciones ${fracs}. ¿Puedes compararlas con 1/2 o convertirlas a decimales?`;
    }

    return "📌 Tip: Intenta usar la comparación con 1/2 o convertir fracciones a decimales para comparar.";
  };

  const reiniciarOrganizacion = () => {
    setFractions([...fractions, ...sorted]);
    setSorted([]);
    setFeedback(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-pink-800 to-yellow-700 p-6">
      <h1 className="text-white text-3xl font-bold mb-6">🪜 Escalera de Fracciones</h1>

      <div className="flex flex-col lg:flex-row w-full gap-4 justify-between items-start">
        {/* IZQUIERDA: Botones de acción */}
        <div className="flex flex-col gap-2 w-full lg:w-1/4">
          <button onClick={verificarOrden} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">
            ✅ Verificar Orden
          </button>
          <button onClick={generarFracciones} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
            🔄 Reiniciar Tarjetas
          </button>
          <button onClick={reiniciarOrganizacion} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm">
            ↩ Reorganizar Fracciones
          </button>
        </div>

        {/* CENTRO: Drag y Drop */}
        <div className="w-full lg:w-2/4">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {fractions.map((f) => (
              <DraggableFraction key={f.id} id={f.id} value={f.value} />
            ))}
          </div>

          <div className="bg-white/10 p-4 rounded shadow-lg">
            <FractionDropZone onDrop={handleDrop}>
              <h2 className="text-white text-xl font-semibold mb-2 text-center">📈 Ordena aquí las fracciones</h2>
              <ul className={`flex flex-col gap-2 transition ${shake ? "animate-shake" : ""}`}>
                {sorted.map((f) => (
                  <li key={f.id} className="bg-white/20 p-2 rounded text-white text-center">
                    {f.value.toFraction(true)}
                  </li>
                ))}
              </ul>
            </FractionDropZone>

            {feedback && (
              <p className="mt-2 text-lg text-white whitespace-pre-line text-center">{feedback}</p>
            )}
          </div>
        </div>

        {/* DERECHA: Botones de nivel */}
        <div className="flex flex-col gap-2 w-full lg:w-1/4">
          {(["facil", "intermedio", "dificil"] as const).map((nivel) => (
            <button
              key={nivel}
              onClick={() => setLevel(nivel)}
              className={`px-4 py-2 rounded ${level === nivel ? "bg-blue-600 text-white" : "bg-white/20 text-white hover:bg-white/30"}`}
            >
              Nivel {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
