import { useCallback, useEffect, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Fraction } from "fraction.js";
import confetti from "canvas-confetti";
import { Link } from "react-router-dom";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Level = "facil" | "intermedio" | "dificil";
type Mode  = "libre" | "reto";
type GameState = "playing" | "success" | "failed";
type BarState  = "neutral" | "correct" | "wrong";

interface FractionData { id: string; value: Fraction }
interface LevelRecord  { bestScore: number; bestTime: number }
type Records = Partial<Record<Level, LevelRecord>>;

// ─── Constantes ───────────────────────────────────────────────────────────────

const LEVEL_COUNT: Record<Level, number> = { facil: 5, intermedio: 7, dificil: 10 };
const LEVEL_TIME:  Record<Level, number> = { facil: 60, intermedio: 75, dificil: 90 };
const RECORDS_KEY = "escalera_records";

// ─── Generar fracciones ───────────────────────────────────────────────────────

const genFracciones = (level: Level): FractionData[] => {
  const count = LEVEL_COUNT[level];
  const result: FractionData[] = [];
  while (result.length < count) {
    const n = Math.floor(Math.random() * 9) + 1;
    const d = Math.floor(Math.random() * 9) + 1;
    if (n < d) {
      const frac = new Fraction(n, d);
      if (!result.find((f) => f.value.equals(frac))) {
        result.push({ id: `${n}/${d}-${Date.now()}-${Math.random()}`, value: frac });
      }
    }
  }
  return result;
};

// ─── Tarjeta del pool ─────────────────────────────────────────────────────────

const PoolCard = ({
  data, onTap, showDecimal,
}: { data: FractionData; onTap: () => void; showDecimal: boolean }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FRACTION",
    item: data,
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));
  const ref = useCallback((node: HTMLButtonElement | null) => { drag(node); }, [drag]);

  return (
    <button
      ref={ref}
      onClick={onTap}
      className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl
        bg-white/20 hover:bg-white/35 border-2 border-white/40 text-white font-bold
        shadow-md select-none transition-all cursor-grab active:cursor-grabbing
        hover:scale-110 ${isDragging ? "opacity-30 scale-90" : ""}`}
    >
      <span className="text-xs leading-none">{String(data.value.n)}</span>
      <span className="w-5 border-b border-white my-0.5" />
      <span className="text-xs leading-none">{String(data.value.d)}</span>
      {showDecimal && (
        <span className="text-[9px] text-yellow-300 mt-0.5 leading-none">
          {data.value.valueOf().toFixed(2)}
        </span>
      )}
    </button>
  );
};

// ─── Barra individual de la escalera ─────────────────────────────────────────

const StaircaseBar = ({
  data, state, onRemove, showDecimal,
}: { data: FractionData; state: BarState; onRemove: () => void; showDecimal: boolean }) => {
  const heightPct = Math.max(8, Math.round(data.value.valueOf() * 100));
  const bg =
    state === "correct" ? "bg-green-400 shadow-green-300/40"
    : state === "wrong"   ? "bg-red-400 shadow-red-300/40"
    : "bg-yellow-400 shadow-yellow-300/20";

  return (
    <div className="flex flex-col items-center justify-end gap-1" style={{ height: 200 }}>
      <div
        className={`${bg} rounded-t-lg w-12 cursor-pointer hover:opacity-75 transition-all shadow-md flex items-start justify-center pt-1`}
        style={{ height: `${heightPct}%` }}
        onClick={onRemove}
        title="Clic para quitar"
      >
        {state === "correct" && <span className="text-xs text-green-900 font-bold">✓</span>}
        {state === "wrong"   && <span className="text-xs text-red-900 font-bold">✗</span>}
      </div>
      <div className="text-center text-white leading-none">
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold">{String(data.value.n)}</span>
          <span className="w-5 border-b border-white my-0.5" />
          <span className="text-xs font-bold">{String(data.value.d)}</span>
        </div>
        {showDecimal && (
          <span className="text-[9px] text-yellow-300 block">{data.value.valueOf().toFixed(2)}</span>
        )}
      </div>
    </div>
  );
};

// ─── Zona de la escalera (drop target) ───────────────────────────────────────

const StaircaseZone = ({
  sorted, onDropAppend, onRemove, barStates, showDecimal, count,
}: {
  sorted: FractionData[];
  onDropAppend: (f: FractionData) => void;
  onRemove: (id: string) => void;
  barStates: Record<string, BarState>;
  showDecimal: boolean;
  count: number;
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "FRACTION",
    drop: (item: FractionData) => onDropAppend(item),
    collect: (m) => ({ isOver: m.isOver() }),
  }));
  const ref = useCallback((node: HTMLDivElement | null) => { drop(node); }, [drop]);

  return (
    <div
      ref={ref}
      className={`w-full rounded-2xl border-2 border-dashed transition-colors p-4
        flex items-end gap-2 overflow-x-auto min-h-[240px]
        ${isOver ? "border-yellow-300 bg-white/15" : "border-white/30 bg-white/5"}`}
    >
      {sorted.map((f) => (
        <StaircaseBar
          key={f.id}
          data={f}
          state={barStates[f.id] ?? "neutral"}
          onRemove={() => onRemove(f.id)}
          showDecimal={showDecimal}
        />
      ))}

      {/* Slots vacíos restantes */}
      {Array.from({ length: Math.max(0, count - sorted.length) }).map((_, i) => (
        <div key={`e${i}`} className="flex flex-col items-center justify-end gap-1" style={{ height: 200 }}>
          <div
            className="w-12 rounded-t-lg border-2 border-dashed border-white/20"
            style={{ height: "12%" }}
          />
          <span className="text-white/20 text-xs">?</span>
        </div>
      ))}

      {sorted.length === 0 && (
        <p className="text-white/30 text-sm m-auto text-center">
          Toca una fracción de arriba · o arrástrala aquí
        </p>
      )}
    </div>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────

export const FractionStaircase = () => {
  const [mode,      setMode]      = useState<Mode>("libre");
  const [level,     setLevel]     = useState<Level>("facil");
  const [pool,      setPool]      = useState<FractionData[]>([]);
  const [sorted,    setSorted]    = useState<FractionData[]>([]);
  const [original,  setOriginal]  = useState<FractionData[]>([]);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [timeLeft,  setTimeLeft]  = useState(LEVEL_TIME.facil);
  const [score,     setScore]     = useState(0);
  const [attempts,  setAttempts]  = useState(0);
  const [showDecimal, setShowDecimal] = useState(false);
  const [barStates, setBarStates] = useState<Record<string, BarState>>({});
  const [feedback,  setFeedback]  = useState("");
  const [records,   setRecords]   = useState<Records>(() => {
    try { return JSON.parse(localStorage.getItem(RECORDS_KEY) ?? "{}"); } catch { return {}; }
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Iniciar partida ────────────────────────────────────────────────────────

  const startGame = useCallback((lvl: Level, _mod: Mode) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const fracs = genFracciones(lvl);
    setPool(fracs);
    setSorted([]);
    setOriginal(fracs);
    setGameState("playing");
    setTimeLeft(LEVEL_TIME[lvl]);
    setScore(0);
    setAttempts(0);
    setShowDecimal(false);
    setBarStates({});
    setFeedback("");
  }, []);

  useEffect(() => { startGame(level, mode); }, [level, mode]); // eslint-disable-line

  // ── Timer (modo Reto) ──────────────────────────────────────────────────────

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mode !== "reto" || gameState !== "playing") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setGameState("failed");
          setFeedback("⏱️ ¡Se acabó el tiempo! Pulsa 'Reintentar' para intentarlo de nuevo.");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [mode, gameState]); // eslint-disable-line

  // ── Guardar récord ─────────────────────────────────────────────────────────

  const saveRecord = useCallback((lvl: Level, s: number, tRemain: number) => {
    setRecords((prev) => {
      const existing = prev[lvl];
      if (existing && s <= existing.bestScore) return prev;
      const next: Records = { ...prev, [lvl]: { bestScore: s, bestTime: LEVEL_TIME[lvl] - tRemain } };
      localStorage.setItem(RECORDS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // ── Interacciones ──────────────────────────────────────────────────────────

  const addToSorted = useCallback((frac: FractionData) => {
    if (gameState !== "playing") return;
    setPool((p) => p.filter((f) => f.id !== frac.id));
    setSorted((s) => [...s, frac]);
    setBarStates((b) => { const n = { ...b }; delete n[frac.id]; return n; });
    setFeedback("");
  }, [gameState]);

  const removeFromSorted = useCallback((id: string) => {
    if (gameState !== "playing") return;
    setSorted((s) => {
      const frac = s.find((f) => f.id === id);
      if (frac) setPool((p) => [...p, frac]);
      return s.filter((f) => f.id !== id);
    });
    setBarStates((b) => { const n = { ...b }; delete n[id]; return n; });
    setFeedback("");
  }, [gameState]);

  // ── Verificar ──────────────────────────────────────────────────────────────

  const verificar = () => {
    const total = LEVEL_COUNT[level];
    if (sorted.length < total) {
      setFeedback(`⚠️ Faltan ${total - sorted.length} fracciones por colocar.`);
      return;
    }

    const inOrder = [...sorted].sort((a, b) => a.value.compare(b.value));
    const correcto = sorted.every((f, i) => f.value.equals(inOrder[i].value));
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const states: Record<string, BarState> = {};
    sorted.forEach((f, i) => { states[f.id] = f.value.equals(inOrder[i].value) ? "correct" : "wrong"; });
    setBarStates(states);

    if (correcto) {
      if (timerRef.current) clearInterval(timerRef.current);
      setGameState("success");

      const base      = total * 100;
      const timeBonus = mode === "reto" ? timeLeft * 15 : 0;
      const penalty   = Math.max(0, newAttempts - 1) * 30;
      const finalScore = Math.max(0, base + timeBonus - penalty);
      setScore(finalScore);

      if (mode === "reto") saveRecord(level, finalScore, timeLeft);
      confetti({ particleCount: 140, spread: 90, origin: { y: 0.55 } });
      setFeedback(
        mode === "reto"
          ? `🎉 ¡Correcto! Puntuación: ${finalScore} pts${records[level] && finalScore > records[level]!.bestScore ? " 🏆 ¡Nuevo récord!" : ""}`
          : "🎉 ¡Correcto! Las fracciones están ordenadas de menor a mayor."
      );
    } else {
      const errores = sorted
        .filter((f, i) => !f.value.equals(inOrder[i].value))
        .map((f) => `${String(f.value.n)}/${String(f.value.d)}`);
      setFeedback(
        `❌ Posición incorrecta: ${errores.join(", ")}.\n💡 Tip: convierte a decimal (÷ numerador por denominador) para comparar más fácil.`
      );
    }
  };

  // ── Reintentar con el mismo set ────────────────────────────────────────────

  const reintentar = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPool([...original]);
    setSorted([]);
    setBarStates({});
    setGameState("playing");
    setFeedback("");
    if (mode === "reto") { setTimeLeft(LEVEL_TIME[level]); setAttempts(0); }
  };

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const totalFractions = LEVEL_COUNT[level];
  const record = records[level];
  const canVerify = gameState === "playing" && sorted.length === totalFractions;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-800 to-yellow-700 p-5 gap-4 items-center">

        <h1 className="text-white text-3xl font-bold mt-1">🪜 Escalera de Fracciones</h1>

        {/* Toggle modo */}
        <div className="bg-white/10 rounded-full p-1 flex gap-1">
          {(["libre", "reto"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                mode === m ? "bg-white text-pink-800 shadow" : "text-white hover:bg-white/20"
              }`}
            >
              {m === "libre" ? "📚 Modo Libre" : "⚡ Modo Reto"}
            </button>
          ))}
        </div>

        <p className="text-white/50 text-xs text-center -mt-2">
          {mode === "libre"
            ? "Sin límite de tiempo · puedes ver decimales · retroalimentación detallada"
            : "Con temporizador · puntos por velocidad y precisión"}
        </p>

        {/* Selector de nivel */}
        <div className="flex gap-2 flex-wrap justify-center">
          {(["facil", "intermedio", "dificil"] as Level[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                level === lvl
                  ? "bg-white text-pink-800 shadow-lg scale-105"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {lvl === "facil" ? "⭐ Fácil (5)" : lvl === "intermedio" ? "⭐⭐ Intermedio (7)" : "⭐⭐⭐ Difícil (10)"}
            </button>
          ))}
        </div>

        <div className="w-full max-w-3xl flex flex-col gap-3">

          {/* HUD modo Reto */}
          {mode === "reto" && (
            <div className="grid grid-cols-3 gap-2">
              <div className={`rounded-xl p-3 text-center transition-colors ${
                timeLeft <= 10 ? "bg-red-500/40 animate-pulse" : "bg-white/10"
              }`}>
                <div className={`text-2xl font-mono font-bold ${timeLeft <= 10 ? "text-red-200" : "text-white"}`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="text-white/50 text-xs">Tiempo</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-yellow-300">{score}</div>
                <div className="text-white/50 text-xs">Puntos</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-white">{attempts}</div>
                <div className="text-white/50 text-xs">Intentos</div>
              </div>
            </div>
          )}

          {/* Récord personal */}
          {mode === "reto" && record && (
            <div className="bg-white/10 rounded-xl px-4 py-2 flex justify-between items-center text-sm">
              <span className="text-white/60">🏆 Mejor marca</span>
              <span className="text-yellow-300 font-bold">{record.bestScore} pts</span>
            </div>
          )}

          {/* Pool */}
          <div className="bg-white/10 rounded-2xl p-3">
            <p className="text-white/60 text-xs text-center mb-2">
              {pool.length > 0
                ? "Toca para agregar → · o arrastra al área de abajo"
                : sorted.length === totalFractions
                  ? "✓ Todas colocadas — presiona Verificar"
                  : "Pool vacío"}
            </p>
            <div className="flex flex-wrap gap-2 justify-center min-h-[60px]">
              {pool.map((f) => (
                <PoolCard
                  key={f.id}
                  data={f}
                  onTap={() => addToSorted(f)}
                  showDecimal={mode === "libre" && showDecimal}
                />
              ))}
              {pool.length === 0 && sorted.length < totalFractions && (
                <span className="text-white/30 text-sm m-auto">—</span>
              )}
            </div>
          </div>

          {/* Escalera visual */}
          <div>
            <p className="text-white/70 text-sm font-semibold text-center mb-1">
              Ordena de{" "}
              <span className="text-yellow-300 font-bold">menor → mayor</span>
              <span className="text-white/40 text-xs ml-2">(toca una barra para quitarla)</span>
            </p>
            <StaircaseZone
              sorted={sorted}
              onDropAppend={addToSorted}
              onRemove={removeFromSorted}
              barStates={barStates}
              showDecimal={mode === "libre" && showDecimal}
              count={totalFractions}
            />
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`rounded-xl px-4 py-3 text-sm text-center whitespace-pre-line font-medium ${
              gameState === "success" ? "bg-green-500/30 text-green-200 border border-green-400/30" :
              gameState === "failed"  ? "bg-red-500/30 text-red-200" :
              "bg-white/15 text-white"
            }`}>
              {feedback}
            </div>
          )}

          {/* Botones */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={verificar}
              disabled={!canVerify}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                canVerify
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-lg scale-105"
                  : "bg-gray-500/40 text-white/40 cursor-not-allowed"
              }`}
            >
              ✅ Verificar orden
            </button>
            <button
              onClick={reintentar}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all"
            >
              🔄 Reintentar (mismo set)
            </button>
            <button
              onClick={() => startGame(level, mode)}
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm transition-all"
            >
              🎲 Nuevas fracciones
            </button>
            {mode === "libre" && (
              <button
                onClick={() => setShowDecimal((v) => !v)}
                className={`px-4 py-2.5 rounded-xl text-sm transition-all ${
                  showDecimal ? "bg-teal-500 text-white" : "bg-white/20 hover:bg-white/30 text-white"
                }`}
              >
                {showDecimal ? "🔢 Ocultar decimales" : "🔢 Ver decimales"}
              </button>
            )}
          </div>

          <p className="text-white/25 text-xs text-center">
            Toca para agregar · Toca la barra para quitar · Arrastra en escritorio
          </p>
        </div>

        <Link to="/" className="text-white/50 text-sm underline hover:text-yellow-300 mt-auto pb-4">
          ⬅ Volver al inicio
        </Link>
      </div>
    </DndProvider>
  );
};
