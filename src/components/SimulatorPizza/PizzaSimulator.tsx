import { useCallback, useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Fraction from "fraction.js";
import { PizzaPiece } from "./PizzaPiece";
import { PizzaDropZone } from "./PizzaDropZone";
import { Link } from "react-router-dom";

const STORAGE_KEY = "simulador_fracciones_progreso";
const INTRO_KEY   = "simulador_fracciones_intro_visto";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type HistorialEntry = {
  objetivo: string;
  resultado: "✔️ Correcto" | "❌ Incorrecto";
  piezas: number;
  ecuacion: string;
};

export type Slice = { id: string; value: Fraction; color: string };

// ─── Fracción inline ─────────────────────────────────────────────────────────

export const FI = ({ n, d }: { n: number | bigint; d: number | bigint }) => (
  <span className="inline-flex flex-col items-center leading-none mx-0.5 align-middle">
    <span className="border-b border-current px-0.5 text-sm font-bold leading-none">{String(n)}</span>
    <span className="px-0.5 text-sm font-bold leading-none">{String(d)}</span>
  </span>
);

// ─── Constantes ───────────────────────────────────────────────────────────────

const PIECES = [
  { id: "p1", fraction: "1/2" },
  { id: "p2", fraction: "1/3" },
  { id: "p3", fraction: "1/4" },
  { id: "p4", fraction: "1/5" },
  { id: "p5", fraction: "1/6" },
  { id: "p6", fraction: "1/8" },
  { id: "p7", fraction: "2/3" },
  { id: "p8", fraction: "3/4" },
];

const PIECE_VALUES = PIECES.map((p) => p.fraction);

const COLORS = [
  "#facc15", "#f97316", "#4ade80", "#60a5fa",
  "#f472b6", "#c084fc", "#fb923c", "#a78bfa",
];

const CHALLENGE_POOL = [
  new Fraction(1, 2), new Fraction(2, 3), new Fraction(3, 4),
  new Fraction(5, 6), new Fraction(7, 8), new Fraction(4, 5),
  new Fraction(5, 8), new Fraction(3, 8), new Fraction(7, 12),
];

const MIN_PIECES = 2;

// ─── Pistas dinámicas ─────────────────────────────────────────────────────────

const getSmartHint = (
  target: Fraction,
  total: Fraction,
  available: string[],
  slicesCount: number,
  minPieces: number
): string => {
  if (total.compare(target) > 0)
    return "🚫 Te pasaste. Haz clic en una porción de la pizza para quitarla.";
  if (total.equals(target) && slicesCount < minPieces)
    return `⚠️ Llegaste al objetivo con ${slicesCount} pieza. Necesitas al menos ${minPieces}. Quita la pieza y usa una combinación equivalente.`;
  if (total.equals(target))
    return "🎯 ¡Solución encontrada! Presiona el botón verde para registrar tu logro.";

  const remaining = target.sub(total);

  for (const p of available) {
    if (new Fraction(p).equals(remaining))
      return `💡 Una pieza de ${p} completa exactamente el objetivo.`;
  }

  for (const p1 of available) {
    const need = remaining.sub(new Fraction(p1));
    if (need.s > 0 && need.n > 0) {
      for (const p2 of available) {
        if (new Fraction(p2).equals(need))
          return `💡 Pista: ${p1} + ${p2} podría completar el objetivo.`;
      }
    }
  }

  return `⏳ Faltan ${remaining.n}/${remaining.d} para el objetivo. Prueba otra combinación.`;
};

// ─── Confetti ────────────────────────────────────────────────────────────────

const triggerConfetti = () => {
  import("canvas-confetti")
    .then(({ default: confetti }) => confetti({ particleCount: 130, spread: 80, origin: { y: 0.55 } }))
    .catch(() => { /* sin confetti disponible */ });
};

// ─── Modal onboarding ────────────────────────────────────────────────────────

const OnboardingModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-gray-800 shadow-2xl">
      <h2 className="text-xl font-bold text-center mb-4">🍕 ¿Cómo jugar?</h2>
      <ol className="space-y-3 text-sm">
        <li className="flex gap-3">
          <span className="w-7 h-7 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold shrink-0">1</span>
          <span>Mira la <strong>fracción objetivo</strong> arriba (ej: 3/4).</span>
        </li>
        <li className="flex gap-3">
          <span className="w-7 h-7 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold shrink-0">2</span>
          <span><strong>Arrastra</strong> porciones al círculo o <strong>tócalas</strong> en tablet. Usa mínimo 2 porciones.</span>
        </li>
        <li className="flex gap-3">
          <span className="w-7 h-7 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold shrink-0">3</span>
          <span>Cuando sumes exactamente el objetivo, el botón se pone verde: presiona <strong>Registrar</strong>. Clic en la pizza para quitar porciones.</span>
        </li>
      </ol>
      <button
        onClick={onClose}
        className="mt-5 w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl transition-all"
      >
        ¡Empezar! →
      </button>
    </div>
  </div>
);

// ─── Componente principal ─────────────────────────────────────────────────────

export const PizzaSimulator = () => {
  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem(INTRO_KEY));

  const [slices, setSlices]         = useState<Slice[]>([]);
  const [total, setTotal]           = useState<Fraction>(new Fraction(0));
  const [colorIndex, setColorIndex] = useState(0);
  const [target, setTarget]         = useState(new Fraction(3, 4));
  const [maxPieces, setMaxPieces]   = useState(3);

  const [intentos, setIntentos]         = useState(0);
  const [aciertos, setAciertos]         = useState(0);
  const [historial, setHistorial]       = useState<HistorialEntry[]>([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const [feedbackMsg, setFeedbackMsg] = useState("");
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [teacherMode, setTeacherMode] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [customError, setCustomError] = useState("");

  // ── Persistencia ─────────────────────────────────────────────────────────

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const p = JSON.parse(saved);
      if (typeof p.intentos === "number") setIntentos(p.intentos);
      if (typeof p.aciertos === "number") setAciertos(p.aciertos);
      if (Array.isArray(p.historial))     setHistorial(p.historial);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ intentos, aciertos, historial }));
  }, [intentos, aciertos, historial]);

  // ── Lógica ───────────────────────────────────────────────────────────────

  const isCorrect = total.equals(target) && slices.length >= MIN_PIECES && slices.length <= maxPieces;

  const showFeedback = useCallback((msg: string) => {
    setFeedbackMsg(msg);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedbackMsg(""), 3500);
  }, []);

  const resetSlices = useCallback(() => {
    setSlices([]);
    setTotal(new Fraction(0));
    setColorIndex(0);
  }, []);

  const addPiece = useCallback((fraction: string) => {
    const f = new Fraction(fraction);
    setSlices((prev) => [...prev, { id: fraction + "_" + Date.now(), value: f, color: COLORS[colorIndex % COLORS.length] }]);
    setTotal((prev) => prev.add(f));
    setColorIndex((prev) => prev + 1);
  }, [colorIndex]);

  const removeSlice = useCallback((sliceId: string, value: Fraction) => {
    setSlices((prev) => prev.filter((s) => s.id !== sliceId));
    setTotal((prev) => prev.sub(value));
  }, []);

  const generarNuevoDesafio = useCallback((currentTarget?: Fraction) => {
    const exclude = currentTarget ?? target;
    const pool = CHALLENGE_POOL.filter((f) => !f.equals(exclude));
    const nuevo = pool[Math.floor(Math.random() * pool.length)];
    setTarget(nuevo);
    setMaxPieces(Math.floor(Math.random() * 3) + 2);
    resetSlices();
  }, [target, resetSlices]);

  const buildEquation = () =>
    slices.map((s) => `${s.value.n}/${s.value.d}`).join(" + ") + " = " + `${total.n}/${total.d}`;

  const evaluarDesafio = useCallback(() => {
    if (!isCorrect) return;
    const eq = buildEquation();
    setIntentos((p) => p + 1);
    setAciertos((p) => p + 1);
    setHistorial((p) => [
      { objetivo: `${String(target.n)}/${String(target.d)}`, resultado: "✔️ Correcto" as const, piezas: slices.length, ecuacion: eq },
      ...p,
    ].slice(0, 20) as HistorialEntry[]);
    showFeedback("🎉 ¡Bien hecho! Generando nuevo reto...");
    triggerConfetti();
    setTimeout(() => generarNuevoDesafio(target), 1400);
  }, [isCorrect, target, slices, showFeedback, generarNuevoDesafio]);

  const rendirseYContinuar = useCallback(() => {
    const eq = buildEquation();
    setIntentos((p) => p + 1);
    setHistorial((p) => [
      { objetivo: `${String(target.n)}/${String(target.d)}`, resultado: "❌ Incorrecto" as const, piezas: slices.length, ecuacion: eq || "—" },
      ...p,
    ].slice(0, 20) as HistorialEntry[]);
    showFeedback("💪 ¡Sigue practicando! Nuevo reto...");
    setTimeout(() => generarNuevoDesafio(target), 1400);
  }, [target, slices, showFeedback, generarNuevoDesafio]);

  const borrarProgreso = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIntentos(0); setAciertos(0); setHistorial([]);
  };

  const handleCustomTarget = () => {
    setCustomError("");
    try {
      const f = new Fraction(customInput.trim());
      if (f.valueOf() <= 0 || f.valueOf() > 1) { setCustomError("Debe ser entre 0 y 1 (ej: 5/6)"); return; }
      setTarget(f); setMaxPieces(4); resetSlices(); setCustomInput("");
    } catch { setCustomError("Formato inválido. Usa p.ej: 3/4"); }
  };

  const hintText = getSmartHint(target, total, PIECE_VALUES, slices.length, MIN_PIECES);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <DndProvider backend={HTML5Backend}>
      {showIntro && <OnboardingModal onClose={() => { setShowIntro(false); localStorage.setItem(INTRO_KEY, "1"); }} />}

      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gradient-to-br from-pink-800 to-yellow-700 p-5 gap-5">

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside className="w-full lg:w-72 bg-white/10 backdrop-blur-md rounded-xl text-white p-4 shadow-lg flex flex-col gap-4">
          <h2 className="text-xl font-bold">📊 Progreso</h2>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <div className="text-2xl font-bold">{intentos}</div>
              <div className="text-white/60 text-xs">Intentos</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <div className="text-2xl font-bold text-green-300">{aciertos}</div>
              <div className="text-white/60 text-xs">Aciertos</div>
            </div>
            {intentos > 0 && (
              <div className="col-span-2 bg-white/10 rounded-lg p-2 text-center">
                <div className="text-xl font-bold text-yellow-300">
                  {Math.round((aciertos / intentos) * 100)}%
                </div>
                <div className="text-white/60 text-xs">Precisión</div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={() => generarNuevoDesafio()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-all">
              🔄 Nuevo reto
            </button>
            <button onClick={resetSlices}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm transition-all">
              ♻️ Limpiar pizza
            </button>
            <button
              onClick={evaluarDesafio}
              disabled={!isCorrect}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                isCorrect
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-lg scale-105"
                  : "bg-gray-500/40 text-white/40 cursor-not-allowed"
              }`}
            >
              {isCorrect ? "✅ ¡Registrar logro!" : "⏳ Completa el reto"}
            </button>
            <button onClick={rendirseYContinuar}
              className="bg-orange-600/70 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-xs transition-all">
              ⏭ Saltar este reto
            </button>
            <button onClick={borrarProgreso}
              className="bg-red-700/50 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs transition-all">
              🗑 Borrar progreso
            </button>
          </div>

          {/* Modo docente */}
          <div>
            <button onClick={() => setTeacherMode((v) => !v)}
              className="text-xs text-white/60 hover:text-white/90 flex items-center gap-1 transition-colors">
              🎓 {teacherMode ? "Ocultar modo docente ▲" : "Modo docente ▼"}
            </button>
            {teacherMode && (
              <div className="mt-2 flex flex-col gap-1">
                <p className="text-xs text-white/60">Objetivo personalizado:</p>
                <div className="flex gap-2">
                  <input type="text" value={customInput} onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCustomTarget()}
                    placeholder="ej: 5/6"
                    className="flex-1 bg-white/20 text-white placeholder-white/40 rounded-lg px-2 py-1 text-sm border border-white/30 focus:outline-none focus:border-white/60"
                  />
                  <button onClick={handleCustomTarget}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-lg text-sm">✓</button>
                </div>
                {customError && <p className="text-red-300 text-xs">{customError}</p>}
              </div>
            )}
          </div>

          {/* Historial */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold">🧾 Historial</h3>
              {historial.length > 5 && (
                <button onClick={() => setMostrarHistorial((v) => !v)}
                  className="text-xs text-blue-300 hover:underline">
                  {mostrarHistorial ? "Ver menos" : `Ver todos (${historial.length})`}
                </button>
              )}
            </div>
            <div className="overflow-y-auto rounded-lg border border-white/20 max-h-48">
              <table className="w-full text-xs text-white table-fixed">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-2 py-1 text-left w-12">Meta</th>
                    <th className="px-2 py-1 text-left">Ecuación</th>
                    <th className="px-2 py-1 text-right w-5">#</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.length === 0 ? (
                    <tr><td colSpan={3} className="px-2 py-2 text-center italic text-white/50">Sin intentos aún.</td></tr>
                  ) : (
                    (mostrarHistorial ? historial : historial.slice(0, 5)).map((item, idx) => (
                      <tr key={idx} className={`${idx % 2 === 0 ? "bg-white/5" : ""} ${item.resultado.startsWith("✔") ? "text-green-300" : "text-red-300"}`}>
                        <td className="px-2 py-1 font-bold">{item.objetivo}</td>
                        <td className="px-2 py-1 truncate text-white/70">{item.ecuacion}</td>
                        <td className="px-2 py-1 text-right text-white/40">{item.piezas}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <Link to="/" className="text-sm text-white/60 underline hover:text-yellow-300">
            ⬅ Volver al inicio
          </Link>
        </aside>

        {/* ── Área principal ───────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col items-center gap-5">
          <div className="text-white text-center">
            <h1 className="text-3xl font-bold">🧩 Simulador de Fracciones</h1>
            <p className="text-white/60 text-sm mt-1">
              Mínimo {MIN_PIECES} · máximo {maxPieces} porciones
            </p>
          </div>

          {/* Objetivo */}
          <div className="bg-white/15 rounded-2xl px-10 py-3 text-white text-center shadow-lg">
            <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Objetivo</p>
            <div className="text-5xl font-bold flex items-center justify-center">
              <FI n={target.n} d={target.d} />
            </div>
          </div>

          {/* Pista / Feedback */}
          <div className={`text-sm px-4 py-2 rounded-xl max-w-md w-full text-center transition-all ${
            feedbackMsg ? "bg-white/20 text-white font-semibold" :
            isCorrect   ? "bg-green-500/30 text-green-200" :
            total.compare(target) > 0 ? "bg-red-500/30 text-red-200" :
            "bg-black/25 text-white/80"
          }`}>
            {feedbackMsg || hintText}
          </div>

          {/* Pizza */}
          <PizzaDropZone
            onAddPiece={addPiece}
            onRemoveSlice={removeSlice}
            slices={slices}
            total={total}
            target={target}
            maxPieces={maxPieces}
            minPieces={MIN_PIECES}
          />

          {/* Ecuación acumulada */}
          <div className={`rounded-xl px-5 py-2.5 min-h-[44px] flex items-center flex-wrap gap-1 justify-center text-base font-mono transition-all max-w-md w-full ${
            slices.length > 0 ? "bg-white/15" : "bg-white/5"
          }`}>
            {slices.length === 0 ? (
              <span className="text-white/30 text-sm">La ecuación aparecerá aquí</span>
            ) : (
              <>
                {slices.map((s, i) => (
                  <span key={s.id} className="flex items-center gap-0.5">
                    {i > 0 && <span className="text-white/50 mx-0.5">+</span>}
                    <span style={{ color: s.color }} className="font-bold">
                      <FI n={s.value.n} d={s.value.d} />
                    </span>
                  </span>
                ))}
                <span className="text-white/50 mx-1">=</span>
                <span className={`font-bold ${isCorrect ? "text-green-300" : total.compare(target) > 0 ? "text-red-300" : "text-white"}`}>
                  <FI n={total.n} d={total.d} />
                </span>
                {isCorrect && <span className="text-green-300 ml-1 text-lg">✓</span>}
                {total.compare(target) > 0 && <span className="text-red-300 ml-1 text-lg">✗</span>}
              </>
            )}
          </div>

          {/* Porciones */}
          <div className="text-center">
            <p className="text-white/50 text-xs mb-2">
              Arrastra al círculo · o toca para agregar
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              {PIECES.map((p) => (
                <PizzaPiece
                  key={p.id}
                  id={p.id}
                  fraction={p.fraction}
                  onTap={() => addPiece(p.fraction)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </DndProvider>
  );
};
