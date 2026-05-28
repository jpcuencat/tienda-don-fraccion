import { useState } from "react";
import { Fraction } from "fraction.js";
import confetti from "canvas-confetti";
import { Link } from "react-router-dom";
import "../../assets/css/modal.css";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Producto { id: number; nombre: string; precio: Fraction; imagen: string }
type Fase = 1 | 2 | 3 | 4;

// ─── Fracción inline ──────────────────────────────────────────────────────────

const FI = ({ n, d }: { n: number | bigint; d: number | bigint }) => (
  <span className="inline-flex flex-col items-center leading-none mx-0.5 align-middle">
    <span className="border-b-2 border-current px-1 text-sm font-bold leading-none">{String(n)}</span>
    <span className="px-1 text-sm font-bold leading-none">{String(d)}</span>
  </span>
);

const FracStr = ({ f }: { f: Fraction }) =>
  Number(f.d) === 1 ? <span className="font-bold">{String(f.n)}</span> : <FI n={f.n} d={f.d} />;

// ─── Paso matemático visual ───────────────────────────────────────────────────

const MathStep = ({ text }: { text: string }) => (
  <div className="bg-black/25 rounded-lg px-4 py-2 font-mono text-sm text-yellow-200 text-center">
    {text}
  </div>
);

// ─── Productos con precios fraccionarios propios ──────────────────────────────

const PRECIOS: Record<string, string> = {
  Manzanas: "2/3",    Pan: "1/2",         Leche: "3/4",    Chocolate: "4/5",
  Queso: "7/8",       Arroz: "1/3",       Huevos: "5/6",   Carne: "3/4",
  Jugo: "2/5",        Yogur: "5/8",       Cereal: "3/5",   Galletas: "1/4",
  Mantequilla: "5/6", Pollo: "7/8",       Pasta: "1/3",    Frijoles: "2/7",
  Helado: "4/5",      Aceite: "5/7",      Sal: "1/6",      Azúcar: "3/8",
};

const IMG: Record<string, string> = {
  Manzanas: "apple.svg",     Pan: "bread.svg",       Leche: "milk.svg",
  Chocolate: "chocolate.svg", Queso: "cheese.svg",   Arroz: "rice.svg",
  Huevos: "eggs.svg",        Carne: "meat.svg",      Jugo: "juice.svg",
  Yogur: "yogurt.svg",       Cereal: "cereal.svg",   Galletas: "cookies.svg",
  Mantequilla: "butter.svg", Pollo: "chicken.svg",   Pasta: "spaghetti.svg",
  Frijoles: "beans.svg",     Helado: "icecream.svg", Aceite: "oil.svg",
  Sal: "salt.svg",           Azúcar: "sugar.svg",
};

const PRODUCTOS: Producto[] = Object.entries(PRECIOS).map(([nombre, precio], idx) => ({
  id: idx, nombre, precio: new Fraction(precio),
  imagen: `/src/assets/img/productos/${IMG[nombre]}`,
}));

// ─── Input con validación ─────────────────────────────────────────────────────

const parseFrac = (v: string): Fraction | null => {
  try { const f = new Fraction(v.trim()); return f.s >= 0 ? f : null; } catch { return null; }
};

// ─── Fase 1: Tienda ───────────────────────────────────────────────────────────

const FaseTienda = ({ onIrAComprar }: { onIrAComprar: () => void }) => (
  <div className="w-full max-w-4xl flex flex-col gap-4">
    <div className="bg-white/10 rounded-2xl p-4">
      <h2 className="text-white text-xl font-bold mb-3">📦 Catálogo de productos</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {PRODUCTOS.map((p) => (
          <div key={p.id} className="bg-white/15 rounded-xl p-3 text-white text-center shadow hover:bg-white/25 transition-all">
            <img src={p.imagen} alt={p.nombre} className="w-12 h-12 mx-auto mb-1 object-contain" />
            <div className="text-sm font-semibold">{p.nombre}</div>
            <div className="flex items-center justify-center gap-0.5 text-yellow-300 mt-1">
              <FracStr f={p.precio} />
              <span className="text-xs ml-0.5">$</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-white/10 rounded-2xl p-4 text-white text-sm">
      <p className="font-semibold mb-2">🔢 ¿Cómo funciona la tienda?</p>
      <ul className="space-y-1 text-white/80 list-disc list-inside">
        <li>Todos los precios son fracciones propias (parte de un dólar por unidad/kg/litro).</li>
        <li><span className="text-yellow-300">Costo = precio × cantidad</span> — multiplicación de fracciones.</li>
        <li><span className="text-yellow-300">Total = suma de costos</span> — suma de fracciones con denominador común.</li>
        <li><span className="text-yellow-300">Descuento = precio × fracción de descuento</span> — multiplicación.</li>
        <li><span className="text-yellow-300">Ganancia = ingreso − costo</span> — resta de fracciones.</li>
      </ul>
    </div>
    <button onClick={onIrAComprar}
      className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-lg transition-all shadow-lg">
      🛒 ¡Empezar a comprar! →
    </button>
  </div>
);

// ─── Fase 2: Comprar ──────────────────────────────────────────────────────────

interface ItemMision { producto: Producto; cantidad: Fraction }
interface Mision {
  id: number; titulo: string; descripcion: string;
  items: ItemMision[]; puntos: number;
}

const MISIONES: Mision[] = [
  {
    id: 1, titulo: "🧺 La lista de mamá", puntos: 150,
    descripcion: "Compra 1/2 kg de Arroz y 1/3 de Pan. Calcula el total exacto.",
    items: [
      { producto: PRODUCTOS[5], cantidad: new Fraction(1, 2) },
      { producto: PRODUCTOS[1], cantidad: new Fraction(1, 3) },
    ],
  },
  {
    id: 2, titulo: "🎒 La merienda escolar", puntos: 200,
    descripcion: "Compra 2/3 de Galletas, 1/4 de Jugo y 1/2 de Yogur. ¿Cuánto gastas?",
    items: [
      { producto: PRODUCTOS[11], cantidad: new Fraction(2, 3) },
      { producto: PRODUCTOS[8],  cantidad: new Fraction(1, 4) },
      { producto: PRODUCTOS[9],  cantidad: new Fraction(1, 2) },
    ],
  },
  {
    id: 3, titulo: "🍝 La cena del viernes", puntos: 250,
    descripcion: "Necesitas 3/4 de Pasta, 2/5 de Aceite y 1/6 de Sal. Calcula el costo total.",
    items: [
      { producto: PRODUCTOS[14], cantidad: new Fraction(3, 4) },
      { producto: PRODUCTOS[17], cantidad: new Fraction(2, 5) },
      { producto: PRODUCTOS[18], cantidad: new Fraction(1, 6) },
    ],
  },
];

const FaseComprar = ({ onPuntos }: { onPuntos: (p: number) => void }) => {
  const [misionIdx, setMisionIdx]       = useState(0);
  const [respuesta, setRespuesta]       = useState("");
  const [inputError, setInputError]     = useState("");
  const [resultado, setResultado]       = useState<"correcto" | "incorrecto" | null>(null);
  const [mostrarSol, setMostrarSol]     = useState(false);

  const mision = MISIONES[misionIdx];
  const totalCorrecto = mision.items.reduce(
    (acc, { producto, cantidad }) => acc.add(producto.precio.mul(cantidad)),
    new Fraction(0)
  );

  const verificar = () => {
    setInputError("");
    const f = parseFrac(respuesta);
    if (!f) { setInputError("Escribe una fracción válida, ej: 1/2 o 7/12"); return; }
    if (f.equals(totalCorrecto)) {
      setResultado("correcto");
      onPuntos(mision.puntos);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
      setResultado("incorrecto");
    }
  };

  const cambiarMision = (i: number) => {
    setMisionIdx(i); setRespuesta(""); setInputError("");
    setResultado(null); setMostrarSol(false);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <div className="flex gap-2">
        {MISIONES.map((m, i) => (
          <button key={m.id} onClick={() => cambiarMision(i)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${misionIdx === i ? "bg-white text-green-800 shadow" : "bg-white/20 text-white hover:bg-white/30"}`}>
            Misión {m.id}
          </button>
        ))}
      </div>

      <div className="bg-white/10 rounded-2xl p-5 text-white">
        <h3 className="text-lg font-bold mb-1">{mision.titulo}</h3>
        <p className="text-white/80 text-sm mb-4">{mision.descripcion}</p>

        <div className="bg-black/20 rounded-xl p-3 mb-4 space-y-2">
          <p className="text-xs text-white/50 uppercase tracking-wide mb-2">precio × cantidad = subtotal</p>
          {mision.items.map(({ producto, cantidad }, i) => {
            const subtotal = producto.precio.mul(cantidad);
            return (
              <div key={i} className="flex items-center gap-2 text-sm flex-wrap">
                <img src={producto.imagen} className="w-8 h-8 object-contain shrink-0" alt="" />
                <span className="w-24 shrink-0 font-semibold">{producto.nombre}</span>
                <span className="text-yellow-300 flex items-center"><FracStr f={producto.precio} /><span className="text-white/40 text-xs ml-0.5">$</span></span>
                <span className="text-white/40">×</span>
                <span className="text-blue-300"><FracStr f={cantidad} /></span>
                <span className="text-white/40">=</span>
                <span className="text-green-300 ml-auto">
                  {resultado ? <><FracStr f={subtotal} /><span className="text-xs ml-0.5">$</span></> : <span className="text-white/20">?</span>}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-center font-semibold mb-3 text-sm">¿Cuál es el total de la compra?</p>

        {resultado === null && (
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <label className="text-xs text-white/60 block mb-1">Tu respuesta (ej: 7/12)</label>
              <input type="text" value={respuesta}
                onChange={(e) => { setRespuesta(e.target.value); setInputError(""); }}
                onKeyDown={(e) => e.key === "Enter" && verificar()}
                placeholder="fracción"
                className="w-full bg-white/20 text-white placeholder-white/30 border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
              />
              {inputError && <p className="text-red-300 text-xs mt-1">{inputError}</p>}
            </div>
            <button onClick={verificar} className="mt-5 px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-sm">✓</button>
          </div>
        )}

        {resultado === "correcto" && (
          <div className="bg-green-500/30 border border-green-400/30 rounded-xl p-3 text-center">
            <p className="text-green-200 font-bold">🎉 ¡Correcto! +{mision.puntos} puntos</p>
            <MathStep text={`Total = ${totalCorrecto.toFraction(true)} $`} />
            {misionIdx < MISIONES.length - 1 && (
              <button onClick={() => cambiarMision(misionIdx + 1)} className="mt-2 px-4 py-1.5 bg-white text-green-800 rounded-lg text-sm font-bold">
                Siguiente misión →
              </button>
            )}
          </div>
        )}

        {resultado === "incorrecto" && (
          <div className="bg-red-500/25 border border-red-400/30 rounded-xl p-3">
            <p className="text-red-200 font-semibold mb-2">❌ Revisa los cálculos.</p>
            {!mostrarSol ? (
              <button onClick={() => setMostrarSol(true)} className="text-xs text-white/60 underline">Ver solución paso a paso</button>
            ) : (
              <div className="space-y-1 text-sm">
                {mision.items.map(({ producto, cantidad }, i) => (
                  <MathStep key={i} text={`${producto.nombre}: ${producto.precio.toFraction(true)} × ${cantidad.toFraction(true)} = ${producto.precio.mul(cantidad).toFraction(true)} $`} />
                ))}
                <MathStep text={`Total: ${mision.items.map(({ producto, cantidad }) => producto.precio.mul(cantidad).toFraction(true)).join(" + ")} = ${totalCorrecto.toFraction(true)} $`} />
                <button onClick={() => { setRespuesta(""); setResultado(null); setMostrarSol(false); }}
                  className="mt-2 px-3 py-1 bg-white/20 text-white rounded text-xs">Intentar de nuevo</button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-white/30 text-xs text-center">
        Operación: <span className="text-yellow-300/60">precio × cantidad</span> luego <span className="text-blue-300/60">suma los subtotales con denominador común</span>
      </p>
    </div>
  );
};

// ─── Fase 3: Descuentos ───────────────────────────────────────────────────────

interface ProbDescuento { producto: Producto; descuento: Fraction; pregunta: "ahorro" | "precio_final"; puntos: number }

const DESCUENTOS: ProbDescuento[] = [
  { producto: PRODUCTOS[11], descuento: new Fraction(1, 2), pregunta: "ahorro",       puntos: 150 },
  { producto: PRODUCTOS[2],  descuento: new Fraction(1, 3), pregunta: "precio_final", puntos: 200 },
  { producto: PRODUCTOS[5],  descuento: new Fraction(1, 4), pregunta: "precio_final", puntos: 200 },
  { producto: PRODUCTOS[9],  descuento: new Fraction(2, 5), pregunta: "ahorro",       puntos: 250 },
];

const FaseDescuentos = ({ onPuntos }: { onPuntos: (p: number) => void }) => {
  const [idx, setIdx]                   = useState(0);
  const [respuesta, setRespuesta]       = useState("");
  const [inputError, setInputError]     = useState("");
  const [resultado, setResultado]       = useState<"correcto" | "incorrecto" | null>(null);
  const [mostrarSol, setMostrarSol]     = useState(false);

  const prob      = DESCUENTOS[idx];
  const ahorro    = prob.producto.precio.mul(prob.descuento);
  const precioFin = prob.producto.precio.sub(ahorro);
  const esperado  = prob.pregunta === "ahorro" ? ahorro : precioFin;

  const verificar = () => {
    setInputError("");
    const f = parseFrac(respuesta);
    if (!f) { setInputError("Escribe una fracción válida, ej: 1/8"); return; }
    if (f.equals(esperado)) {
      setResultado("correcto");
      onPuntos(prob.puntos);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } else {
      setResultado("incorrecto");
    }
  };

  const cambiar = (i: number) => { setIdx(i); setRespuesta(""); setInputError(""); setResultado(null); setMostrarSol(false); };

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <div className="flex gap-2">
        {DESCUENTOS.map((_, i) => (
          <button key={i} onClick={() => cambiar(i)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${idx === i ? "bg-white text-green-800 shadow" : "bg-white/20 text-white hover:bg-white/30"}`}>
            Problema {i + 1}
          </button>
        ))}
      </div>

      <div className="bg-white/10 rounded-2xl p-5 text-white">
        <p className="text-xs text-white/50 uppercase tracking-wide mb-3">Descuentos = multiplicación de fracciones</p>

        <div className="flex items-center gap-4 bg-black/20 rounded-xl p-3 mb-4">
          <img src={prob.producto.imagen} className="w-16 h-16 object-contain" alt="" />
          <div>
            <p className="text-lg font-bold">{prob.producto.nombre}</p>
            <p className="text-sm text-white/70">Precio original: <span className="text-yellow-300 font-bold">{prob.producto.precio.toFraction(true)} $</span></p>
            <p className="text-sm text-white/70">Descuento: <span className="text-red-300 font-bold">{prob.descuento.toFraction(true)} del precio</span></p>
          </div>
        </div>

        <div className="bg-black/20 rounded-xl p-3 mb-4 space-y-1">
          <MathStep text={`Ahorro = precio × descuento = ${prob.producto.precio.toFraction(true)} × ${prob.descuento.toFraction(true)}`} />
          {prob.pregunta === "precio_final" && (
            <MathStep text={`Precio final = precio original − ahorro`} />
          )}
        </div>

        <p className="font-semibold mb-3 text-center text-lg">
          {prob.pregunta === "ahorro"
            ? `¿Cuánto ahorras comprando 1 ${prob.producto.nombre}?`
            : `¿Cuál es el precio final de ${prob.producto.nombre} con descuento?`}
        </p>

        {resultado === null && (
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <label className="text-xs text-white/60 block mb-1">Tu respuesta (ej: 1/8)</label>
              <input type="text" value={respuesta}
                onChange={(e) => { setRespuesta(e.target.value); setInputError(""); }}
                onKeyDown={(e) => e.key === "Enter" && verificar()}
                placeholder="fracción"
                className="w-full bg-white/20 text-white placeholder-white/30 border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
              />
              {inputError && <p className="text-red-300 text-xs mt-1">{inputError}</p>}
            </div>
            <button onClick={verificar} className="mt-5 px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-sm">✓</button>
          </div>
        )}

        {resultado === "correcto" && (
          <div className="bg-green-500/30 border border-green-400/30 rounded-xl p-3 text-center">
            <p className="text-green-200 font-bold">🎉 ¡Correcto! +{prob.puntos} puntos</p>
            <MathStep text={`Ahorro = ${prob.producto.precio.toFraction(true)} × ${prob.descuento.toFraction(true)} = ${ahorro.toFraction(true)} $`} />
            {prob.pregunta === "precio_final" && (
              <MathStep text={`Precio final = ${prob.producto.precio.toFraction(true)} − ${ahorro.toFraction(true)} = ${precioFin.toFraction(true)} $`} />
            )}
            {idx < DESCUENTOS.length - 1 && (
              <button onClick={() => cambiar(idx + 1)} className="mt-2 px-4 py-1.5 bg-white text-green-800 rounded-lg text-sm font-bold">Siguiente →</button>
            )}
          </div>
        )}

        {resultado === "incorrecto" && (
          <div className="bg-red-500/25 border border-red-400/30 rounded-xl p-3">
            <p className="text-red-200 font-semibold mb-1">❌ Revisa el cálculo.</p>
            {!mostrarSol ? (
              <button onClick={() => setMostrarSol(true)} className="text-xs text-white/60 underline">Ver solución</button>
            ) : (
              <div className="space-y-1">
                <MathStep text={`Ahorro = ${prob.producto.precio.toFraction(true)} × ${prob.descuento.toFraction(true)} = ${ahorro.toFraction(true)} $`} />
                {prob.pregunta === "precio_final" && (
                  <MathStep text={`Precio final = ${prob.producto.precio.toFraction(true)} − ${ahorro.toFraction(true)} = ${precioFin.toFraction(true)} $`} />
                )}
                <MathStep text={`Respuesta esperada: ${esperado.toFraction(true)} $`} />
                <button onClick={() => { setRespuesta(""); setResultado(null); setMostrarSol(false); }}
                  className="mt-1 px-3 py-1 bg-white/20 text-white rounded text-xs">Intentar de nuevo</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Fase 4: Venta ────────────────────────────────────────────────────────────

interface ProbVenta { producto: Producto; precioCompra: Fraction; precioVenta: Fraction; cantidad: Fraction; puntos: number }

const VENTAS: ProbVenta[] = [
  { producto: PRODUCTOS[5],  precioCompra: new Fraction(1, 3), precioVenta: new Fraction(2, 3), cantidad: new Fraction(1, 2), puntos: 200 },
  { producto: PRODUCTOS[8],  precioCompra: new Fraction(2, 5), precioVenta: new Fraction(3, 5), cantidad: new Fraction(2, 3), puntos: 250 },
  { producto: PRODUCTOS[0],  precioCompra: new Fraction(2, 3), precioVenta: new Fraction(5, 6), cantidad: new Fraction(3, 4), puntos: 300 },
];

type EtapaVenta = "costo" | "ingreso" | "ganancia";

const FaseVenta = ({ onPuntos }: { onPuntos: (p: number) => void }) => {
  const [idx, setIdx]                   = useState(0);
  const [etapa, setEtapa]               = useState<EtapaVenta>("costo");
  const [respuesta, setRespuesta]       = useState("");
  const [inputError, setInputError]     = useState("");
  const [resultado, setResultado]       = useState<"correcto" | "incorrecto" | null>(null);
  const [guardadas, setGuardadas]       = useState<Partial<Record<EtapaVenta, Fraction>>>({});

  const prob    = VENTAS[idx];
  const costo   = prob.precioCompra.mul(prob.cantidad);
  const ingreso = prob.precioVenta.mul(prob.cantidad);
  const ganancia = ingreso.sub(costo);

  const esperado: Record<EtapaVenta, Fraction> = { costo, ingreso, ganancia };

  const verificar = () => {
    setInputError("");
    const f = parseFrac(respuesta);
    if (!f) { setInputError("Escribe una fracción válida, ej: 1/6"); return; }
    if (f.equals(esperado[etapa])) {
      setResultado("correcto");
      setGuardadas((g) => ({ ...g, [etapa]: f }));
      if (etapa === "ganancia") {
        onPuntos(prob.puntos);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 } });
      }
    } else {
      setResultado("incorrecto");
    }
  };

  const avanzar = () => {
    setRespuesta(""); setResultado(null); setInputError("");
    if (etapa === "costo")   setEtapa("ingreso");
    if (etapa === "ingreso") setEtapa("ganancia");
  };

  const siguienteProb = () => {
    setRespuesta(""); setResultado(null); setInputError("");
    setEtapa("costo"); setGuardadas({});
    setIdx((i) => Math.min(i + 1, VENTAS.length - 1));
  };

  const hints: Record<EtapaVenta, string> = {
    costo:    `costo = precio_compra × cantidad = ${prob.precioCompra.toFraction(true)} × ${prob.cantidad.toFraction(true)}`,
    ingreso:  `ingreso = precio_venta × cantidad = ${prob.precioVenta.toFraction(true)} × ${prob.cantidad.toFraction(true)}`,
    ganancia: `ganancia = ingreso − costo = ${guardadas.ingreso?.toFraction(true) ?? "?"} − ${guardadas.costo?.toFraction(true) ?? "?"}`,
  };

  const labels: Record<EtapaVenta, string> = {
    costo:    "¿Cuánto costó la compra?",
    ingreso:  "¿Cuánto obtienes al vender todo?",
    ganancia: "¿Cuánta ganancia obtuviste?",
  };

  const cambiarProb = (i: number) => { setIdx(i); setEtapa("costo"); setRespuesta(""); setResultado(null); setGuardadas({}); setInputError(""); };

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <div className="flex gap-2">
        {VENTAS.map((_, i) => (
          <button key={i} onClick={() => cambiarProb(i)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${idx === i ? "bg-white text-green-800 shadow" : "bg-white/20 text-white hover:bg-white/30"}`}>
            Operación {i + 1}
          </button>
        ))}
      </div>

      <div className="bg-white/10 rounded-2xl p-5 text-white">
        <p className="text-xs text-white/50 uppercase tracking-wide mb-3">Comprar y vender = las 4 operaciones con fracciones</p>

        <div className="flex items-center gap-4 bg-black/20 rounded-xl p-3 mb-4">
          <img src={prob.producto.imagen} className="w-16 h-16 object-contain" alt="" />
          <div className="text-sm space-y-1">
            <p className="text-lg font-bold">{prob.producto.nombre}</p>
            <p>Cantidad: <span className="text-blue-300 font-bold">{prob.cantidad.toFraction(true)}</span></p>
            <p>Precio de compra: <span className="text-red-300 font-bold">{prob.precioCompra.toFraction(true)} $/u</span></p>
            <p>Precio de venta: <span className="text-green-300 font-bold">{prob.precioVenta.toFraction(true)} $/u</span></p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {(["costo", "ingreso", "ganancia"] as EtapaVenta[]).map((e) => (
            <div key={e} className={`flex-1 py-1.5 rounded-lg text-xs text-center font-semibold transition-all ${
              etapa === e ? "bg-yellow-400 text-yellow-900" :
              guardadas[e] ? "bg-green-500/50 text-green-200" :
              "bg-white/10 text-white/40"
            }`}>
              {e === "costo" ? "1. Costo" : e === "ingreso" ? "2. Ingreso" : "3. Ganancia"}
            </div>
          ))}
        </div>

        <MathStep text={hints[etapa]} />
        <p className="font-semibold my-3 text-center">{labels[etapa]}</p>

        {resultado === null && (
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <label className="text-xs text-white/60 block mb-1">Tu respuesta (ej: 1/6)</label>
              <input type="text" value={respuesta}
                onChange={(e) => { setRespuesta(e.target.value); setInputError(""); }}
                onKeyDown={(e) => e.key === "Enter" && verificar()}
                placeholder="fracción"
                className="w-full bg-white/20 text-white placeholder-white/30 border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
              />
              {inputError && <p className="text-red-300 text-xs mt-1">{inputError}</p>}
            </div>
            <button onClick={verificar} className="mt-5 px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-sm">✓</button>
          </div>
        )}

        {resultado === "correcto" && (
          <div className="bg-green-500/30 border border-green-400/30 rounded-xl p-3 text-center">
            <p className="text-green-200 font-bold">
              {etapa === "ganancia"
                ? `🎉 ¡Ganaste ${ganancia.toFraction(true)} $! +${prob.puntos} puntos`
                : "✅ ¡Correcto!"}
            </p>
            <MathStep text={hints[etapa] + " = " + esperado[etapa].toFraction(true) + " $"} />
            {etapa !== "ganancia" && (
              <button onClick={avanzar} className="mt-2 px-4 py-1.5 bg-white text-green-800 rounded-lg text-sm font-bold">Continuar →</button>
            )}
            {etapa === "ganancia" && idx < VENTAS.length - 1 && (
              <button onClick={siguienteProb} className="mt-2 px-4 py-1.5 bg-white text-green-800 rounded-lg text-sm font-bold">Siguiente →</button>
            )}
          </div>
        )}

        {resultado === "incorrecto" && (
          <div className="bg-red-500/25 border border-red-400/30 rounded-xl p-3">
            <p className="text-red-200 font-semibold text-sm">
              ❌ Respuesta esperada: <span className="font-bold">{esperado[etapa].toFraction(true)} $</span>
            </p>
            <MathStep text={hints[etapa] + " = " + esperado[etapa].toFraction(true) + " $"} />
            <button onClick={() => { setRespuesta(""); setResultado(null); setInputError(""); }}
              className="mt-1 px-3 py-1 bg-white/20 text-white rounded text-xs">Intentar de nuevo</button>
          </div>
        )}
      </div>

      <p className="text-white/30 text-xs text-center">
        Costo y ingreso = <span className="text-yellow-300/60">multiplicación</span> · Ganancia = <span className="text-blue-300/60">resta</span>
      </p>
    </div>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────

export const DonFraccionGame = () => {
  const [fase,   setFase]   = useState<Fase>(1);
  const [puntos, setPuntos] = useState(0);

  const agregarPuntos = (p: number) => setPuntos((prev) => prev + p);

  const FASES = [
    { id: 1 as Fase, label: "🏪 Tienda",     desc: "Explora",     op: "— catálogo" },
    { id: 2 as Fase, label: "🛒 Comprar",    desc: "Misiones",    op: "× y +" },
    { id: 3 as Fase, label: "🏷️ Descuentos", desc: "Multiplicar", op: "×" },
    { id: 4 as Fase, label: "💹 Venta",      desc: "Todas",       op: "× y −" },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-700 to-yellow-600 p-5 gap-4">
      <div className="text-center">
        <h1 className="text-white text-3xl font-bold">🛒 La Tienda de Don Fracción</h1>
        <p className="text-white/60 text-sm mt-1">Aplica las 4 operaciones con fracciones en situaciones reales</p>
      </div>

      {puntos > 0 && (
        <div className="bg-yellow-400/20 border border-yellow-300/30 rounded-full px-5 py-1.5 text-yellow-200 font-bold text-sm">
          🏆 {puntos} puntos acumulados
        </div>
      )}

      <div className="flex gap-1 bg-black/20 rounded-2xl p-1 flex-wrap justify-center">
        {FASES.map(({ id, label, desc, op }) => (
          <button key={id} onClick={() => setFase(id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all text-left ${
              fase === id ? "bg-white text-green-800 shadow-lg" : "text-white hover:bg-white/15"
            }`}
          >
            <span className="block">{label}</span>
            <span className={`block text-xs ${fase === id ? "text-green-600" : "text-white/40"}`}>{desc} · {op}</span>
          </button>
        ))}
      </div>

      {fase === 1 && <FaseTienda onIrAComprar={() => setFase(2)} />}
      {fase === 2 && <FaseComprar    onPuntos={agregarPuntos} />}
      {fase === 3 && <FaseDescuentos onPuntos={agregarPuntos} />}
      {fase === 4 && <FaseVenta      onPuntos={agregarPuntos} />}

      <Link to="/" className="text-white/50 text-sm underline hover:text-yellow-300 mt-auto pb-4">
        ⬅ Volver al inicio
      </Link>
    </div>
  );
};
