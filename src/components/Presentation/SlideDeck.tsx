import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";

// Animaciones
import pizzaAnim from "./animations/pizza.json";
import pizzaSliceAnim from "./animations/pizza_slice.json";
import chocolateAnim from "./animations/chocolate.json";
import fabricAnim from "./animations/fabric.json";
import pasosAnim from "./animations/pasos.json";
import igualarAnim from "./animations/igualar.json";
import igualAnim from "./animations/igual.json";
import buscarAnim from "./animations/buscar.json";
import resultadoAnim from "./animations/resultado.json";
import dolarAnim from "./animations/dolar.json";

// Imágenes
import pizzaImg from "../../assets/images/pizza.png";
import tanqueImg from "../../assets/images/tanque.png";
import descuentoImg from "../../assets/images/descuento.png";
import recetaImg from "../../assets/images/receta.png";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const animMap: Record<string, any> = {
  pizza: pizzaAnim, pizzaSlice: pizzaSliceAnim, chocolate: chocolateAnim,
  fabric: fabricAnim, pasos: pasosAnim, igualar: igualarAnim, igual: igualAnim,
  buscar: buscarAnim, resultado: resultadoAnim, dolar: dolarAnim,
};
const imgMap: Record<string, string> = {
  pizza: pizzaImg, tanque: tanqueImg, descuento: descuentoImg, receta: recetaImg,
};

// ─── Notación matemática ────────────────────────────────────────────────────

const Frac = ({ n, d }: { n: string; d: string }) => (
  <span className="inline-flex flex-col items-center leading-none mx-1 align-middle">
    <span className="border-b-2 border-current px-1 font-bold">{n}</span>
    <span className="px-1 font-bold">{d}</span>
  </span>
);

const MathLine = ({ expr }: { expr: string }) => {
  const tokens = expr.split(/(\d+\/\d+)/);
  return (
    <span className="flex flex-wrap items-center justify-center gap-0.5">
      {tokens.map((tok, i) => {
        const m = tok.match(/^(\d+)\/(\d+)$/);
        return m ? <Frac key={i} n={m[1]} d={m[2]} /> : <span key={i}>{tok}</span>;
      })}
    </span>
  );
};

const MathBlock = ({ lines }: { lines: string[] }) => (
  <div className="bg-white/20 rounded-xl px-6 py-3 my-2 text-lg font-mono flex flex-col items-center gap-2 w-full">
    {lines.map((line, i) => <MathLine key={i} expr={line} />)}
  </div>
);

// ─── Tipos ──────────────────────────────────────────────────────────────────

type SectionType = "concept" | "visual" | "procedure" | "pause" | "resolution" | "example" | "context" | "summary";

interface AppLink { to: string; label: string; emoji: string; }

interface Section {
  id: string;
  type: SectionType;
  title: string;
  description: string;
  math?: string[];
  image?: string;
  animation?: string;
  links?: AppLink[];
  revealId?: string; // resolución: id de la pausa que la desbloquea
}

interface Slide {
  title: string;
  icon: string;
  sections: Section[];
}

// ─── Estilos por tipo de sección ────────────────────────────────────────────

const sectionStyle: Record<SectionType, { card: string; badge: string; badgeText: string }> = {
  concept:    { card: "bg-white/10 border border-white/20",           badge: "bg-blue-400/80",   badgeText: "Concepto" },
  visual:     { card: "bg-indigo-500/20 border border-indigo-300/30", badge: "bg-indigo-400/80", badgeText: "Visualización" },
  procedure:  { card: "bg-white/10 border border-white/20",           badge: "bg-teal-400/80",   badgeText: "Procedimiento" },
  pause:      { card: "bg-amber-500/25 border-2 border-amber-300/50", badge: "bg-amber-400",     badgeText: "⏸ Pausa" },
  resolution: { card: "bg-emerald-500/25 border border-emerald-300/40", badge: "bg-emerald-400", badgeText: "✅ Resolución" },
  example:    { card: "bg-violet-500/20 border border-violet-300/30", badge: "bg-violet-400/80", badgeText: "Ejemplo" },
  context:    { card: "bg-orange-500/20 border border-orange-300/30", badge: "bg-orange-400/80", badgeText: "Contexto" },
  summary:    { card: "bg-white/15 border border-white/25",           badge: "bg-pink-400/80",   badgeText: "Resumen" },
};

// ─── Contenido ──────────────────────────────────────────────────────────────

const slides: Slide[] = [
  // ── 0. Partes de una fracción ──────────────────────────────────────
  {
    title: "Partes de una fracción",
    icon: "🔢",
    sections: [
      {
        id: "f-def",
        type: "concept",
        title: "¿Qué es una fracción?",
        description: `Una fracción expresa una parte de un todo dividido en partes iguales.

La idea central es simple: cuando no tenemos una cantidad completa, las fracciones nos permiten ser exactos. Decir "comí un poco de pizza" es impreciso; decir "comí 3/8 de pizza" es exacto.

La fracción tiene dos números separados por una línea horizontal:`,
        math: [
          "3/8  ←  leemos: \"tres octavos\"",
          "3  =  partes que tomamos",
          "8  =  partes iguales totales",
        ],
      },
      {
        id: "f-partes",
        type: "concept",
        title: "Numerador y Denominador",
        description: `El NUMERADOR (arriba) dice cuántas partes tomamos.
El DENOMINADOR (abajo) dice en cuántas partes iguales se divide el todo.

Regla clave: el denominador NUNCA puede ser cero, porque no tiene sentido dividir algo en 0 partes.

Ejemplos de lectura:
• 1/2 → "un medio" (la mitad)
• 3/4 → "tres cuartos"
• 7/8 → "siete octavos"
• 5/3 → "cinco tercios"`,
        math: ["1/2   3/4   7/8   5/3"],
      },
      {
        id: "f-tipos",
        type: "concept",
        title: "Tipos de fracciones",
        description: `✅ Fracción propia: numerador < denominador → resultado menor que 1 entero.
   Ejemplo: 3/4 (comiste menos de una pizza completa)

⚠️ Fracción impropia: numerador ≥ denominador → resultado igual o mayor que 1.
   Ejemplo: 7/4 (equivale a 1 pizza y ¾ más)

🔄 Número mixto: forma de escribir una fracción impropia como entero + fracción.
   7/4 se escribe como 1¾ (se lee "uno y tres cuartos")

Para convertir: divide numerador ÷ denominador.
El cociente es el entero, el residuo es el nuevo numerador.`,
        math: [
          "7/4 :  7 ÷ 4 = 1  resto 3  →  1  3/4",
          "11/3 :  11 ÷ 3 = 3  resto 2  →  3  2/3",
        ],
      },
      {
        id: "f-pausa",
        type: "pause",
        title: "¿Es propia o impropia?",
        description: `El docente pregunta al grupo:

Clasifica estas fracciones ANTES de ver la respuesta:

a) 5/3  →  ¿propia o impropia?
b) 2/7  →  ¿propia o impropia?
c) 9/9  →  ¿propia, impropia o especial?
d) 12/5  →  ¿cuánto vale como número mixto?

Escribe tus respuestas en el cuaderno.`,
        math: ["5/3    2/7    9/9    12/5"],
      },
      {
        id: "f-resolucion",
        type: "resolution",
        title: "Respuestas",
        revealId: "f-pausa",
        description: `a) 5/3 → IMPROPIA (5 > 3). Equivale a 1⅔.
   5 ÷ 3 = 1 resto 2 → número mixto: 1  2/3

b) 2/7 → PROPIA (2 < 7). Vale menos de 1 entero (algo menos que ¼).

c) 9/9 → IMPROPIA especial: vale exactamente 1 entero.
   Cualquier fracción con numerador = denominador vale 1.

d) 12/5 → IMPROPIA. 12 ÷ 5 = 2 resto 2 → número mixto: 2  2/5

Error frecuente: confundir numerador y denominador. Recuerda: el denominador siempre va ABAJO (como los cimientos de una casa).`,
        math: [
          "5/3  =  1  2/3",
          "9/9  =  1",
          "12/5  =  2  2/5",
        ],
      },
      {
        id: "f-equiv",
        type: "concept",
        title: "Fracciones equivalentes — el concepto más importante",
        description: `Dos fracciones son equivalentes cuando representan la MISMA cantidad, aunque se escriban diferente.

¿Cómo se generan? Multiplicando o dividiendo AMBOS (numerador y denominador) por el mismo número.

Esta propiedad se llama "amplificación" (×) y "simplificación" (÷).

¿Por qué importa? Porque para sumar y restar fracciones NECESITAMOS fracciones equivalentes. Sin dominar este concepto, las operaciones parecen magia sin sentido.`,
        math: [
          "1/2  =  2/4  =  3/6  =  4/8  =  50/100",
          "1/2  ×  3/3  =  3/6  ✓  (misma cantidad)",
          "6/9  ÷  3/3  =  2/3  ✓  (simplificada)",
        ],
      },
    ],
  },

  // ── 1. Fracciones en el mundo real ────────────────────────────────
  {
    title: "Fracciones en el mundo real",
    icon: "🌍",
    sections: [
      {
        id: "r-intro",
        type: "context",
        title: "¿Por qué aprender fracciones?",
        description: `Las fracciones no son un invento de los libros de matemáticas: aparecen a diario en la cocina, el comercio, la construcción, la medicina y la música.

Un médico que prescribe "¾ de tableta" cada 8 horas necesita fracciones. Un carpintero que corta "2½ metros de madera" necesita fracciones. Un cocinero que usa "⅔ de taza de azúcar" necesita fracciones.

Veamos cuatro situaciones cotidianas:`,
      },
      {
        id: "r-pizza",
        type: "example",
        title: "🍕 La pizza",
        description: `Una pizza se cortó en 8 pedazos iguales. Ya se comieron 4.

Podemos expresar lo que se comió de dos maneras equivalentes:
• Como fracción: 4/8 (cuatro de ocho pedazos)
• Simplificada: 1/2 (la mitad)

Ambas describen exactamente la misma cantidad. Simplificar no cambia el valor, solo lo expresa de forma más clara.

Pregunta para reflexionar: ¿puedes expresar "la mitad que queda" como fracción?`,
        image: "pizza",
        math: ["4/8  =  1/2  →  se comió la mitad"],
      },
      {
        id: "r-tanque",
        type: "example",
        title: "⛽ El tanque de gasolina",
        description: `El marcador del auto apunta a ¾. Eso significa que el tanque tiene 3 de sus 4 cuartas partes llenas.

Si el tanque lleno cuesta $40, ¿cuánto costaría llenarlo desde ¾?
Queda ¼ vacío → cuesta ¼ de $40 = $10.

Esto muestra por qué entender fracciones es útil para tomar decisiones cotidianas.`,
        image: "tanque",
        math: ["3/4  lleno  →  1/4  vacío  →  $10 para llenar"],
      },
      {
        id: "r-descuento",
        type: "example",
        title: "🏷️ El descuento",
        description: `Una tienda anuncia "1/3 de descuento en toda la ropa".

Si una camisa cuesta $30, el descuento es 1/3 de $30 = $10, y pagas $20.

Alguien que no entiende fracciones podría malinterpretar el descuento y tomar una mala decisión de compra. Las fracciones son literalmente útiles para cuidar tu dinero.`,
        image: "descuento",
        math: ["1/3  de $30  =  $10  →  pagas $20"],
      },
      {
        id: "r-receta",
        type: "example",
        title: "🥣 La receta",
        description: `Una receta de pastel pide "2½ tazas de harina". Esto es un número mixto: 2 tazas enteras más ½ taza adicional.

Si usas solo 2 tazas, el pastel queda seco. Si usas 3, queda demasiado denso. La precisión importa.

2½ escrito como fracción impropia es 5/2: dos partes enteras (4 medias) más una media más = 5 medias.`,
        image: "receta",
        math: ["2  1/2  =  5/2  tazas de harina"],
      },
      {
        id: "r-pausa",
        type: "pause",
        title: "Reflexión del grupo",
        description: `El docente lanza la pregunta al grupo antes de avanzar:

"¿Por qué usamos fracciones en la vida real en lugar de solo números enteros?"

Da 2-3 minutos para escuchar respuestas. Anota las ideas en la pizarra.
Luego haz esta segunda pregunta:

"¿Qué pasaría si la medicina, la construcción o la cocina solo pudieran usar números enteros (1, 2, 3...)?"`,
      },
      {
        id: "r-resolucion",
        type: "resolution",
        title: "Ideas para cerrar la reflexión",
        revealId: "r-pausa",
        description: `Los números enteros solo pueden expresar cantidades completas. El mundo real está lleno de cantidades intermedias:

✅ Media hora de ejercicio (1/2), no solo 0 o 1 hora completa.
✅ 3/4 de litro de leche, no solo 0 o 1 litro.
✅ 1/3 de descuento, no solo "sin descuento" o "gratis".
✅ 2½ pastillas, no solo 2 o 3.

Las fracciones son el puente entre los números enteros y la realidad imprecisa del mundo. Sin ellas, las ciencias, la ingeniería y el comercio serían imposibles de expresar con exactitud.`,
      },
    ],
  },

  // ── 2. Suma de fracciones ──────────────────────────────────────────
  {
    title: "Suma de Fracciones",
    icon: "➕",
    sections: [
      {
        id: "s-iguales",
        type: "concept",
        title: "Caso fácil: denominadores iguales",
        description: `Cuando las dos fracciones tienen el MISMO denominador, la suma es inmediata:

→ Suma solo los numeradores.
→ El denominador NO cambia.

¿Por qué? Porque las dos fracciones ya miden en la misma "unidad". Es como sumar manzanas con manzanas: 3 manzanas + 2 manzanas = 5 manzanas. El "tipo" (denominador) no cambia.`,
        math: [
          "1/5  +  3/5  =  4/5",
          "2/8  +  5/8  =  7/8",
        ],
      },
      {
        id: "s-pausa1",
        type: "pause",
        title: "Practica: denominadores iguales",
        description: `Resuelve estas sumas en tu cuaderno ANTES de ver la respuesta:

a) 2/7 + 3/7 = ?
b) 1/6 + 4/6 = ?
c) 5/9 + 3/9 = ?
d) 3/10 + 6/10 = ?

Atención con c) y d): ¿el resultado se puede simplificar?`,
        math: ["2/7  +  3/7  =  ?"],
      },
      {
        id: "s-resolucion1",
        type: "resolution",
        title: "Respuestas: denominadores iguales",
        revealId: "s-pausa1",
        description: `a) 2/7 + 3/7 = 5/7  ✓  (no simplifica, 5 y 7 no tienen factores comunes)

b) 1/6 + 4/6 = 5/6  ✓  (no simplifica, 5 y 6 no tienen factores comunes)

c) 5/9 + 3/9 = 8/9  ✓  (no simplifica, 8 y 9 no tienen factores comunes)

d) 3/10 + 6/10 = 9/10  ✓  (no simplifica)

Error frecuente: sumar también los denominadores (ej. escribir 5/14 en a). El denominador expresa el TIPO de pedazo, no la cantidad. Solo los numeradores se suman.`,
        math: [
          "2/7  +  3/7  =  5/7",
          "1/6  +  4/6  =  5/6",
          "5/9  +  3/9  =  8/9",
        ],
      },
      {
        id: "s-regladeoro",
        type: "concept",
        title: "Regla de oro: denominadores diferentes",
        description: `Cuando los denominadores son distintos, NO podemos sumar directamente. Es como intentar sumar metros con centímetros sin convertir primero.

Regla de oro: "Antes de sumar, convierte ambas fracciones a la misma unidad (mismo denominador)."

La estrategia: encontrar el Mínimo Común Múltiplo (MCM) de los dos denominadores. Ese número será el nuevo denominador común para ambas fracciones.`,
        animation: "pizzaSlice",
      },
      {
        id: "s-analogia",
        type: "visual",
        title: "🍕 Visualización: 1/4 + 1/3",
        description: `Tienes 1/4 de pizza (una de 4 partes) y 1/3 de otra pizza igual (una de 3 partes).

¿Puedes sumarlas directamente? No: los pedazos son de distinto tamaño.

Solución: cortar ambas pizzas en 12 partes (el MCM de 4 y 3).
• 1/4 de pizza = 3 pedazos de 12 → 3/12
• 1/3 de pizza = 4 pedazos de 12 → 4/12

Ahora sí tienen el mismo "tamaño de pedazo" y podemos sumar.`,
        animation: "pizza",
        math: ["1/4  +  1/3  →  3/12  +  4/12  =  7/12"],
      },
      {
        id: "s-pausa2",
        type: "pause",
        title: "¿Cuál es el MCM de 4 y 3?",
        description: `Antes de ver el procedimiento completo, escribe en tu cuaderno:

Múltiplos de 4: 4, 8, __, __, ...
Múltiplos de 3: 3, 6, 9, __, ...

¿Cuál es el primer número que aparece en AMBAS listas?

Luego, sin ver la solución aún, intenta transformar:
1/4 = ?/12  y  1/3 = ?/12`,
      },
      {
        id: "s-resolucion2",
        type: "resolution",
        title: "Respuesta: MCM y fracciones equivalentes",
        revealId: "s-pausa2",
        description: `Múltiplos de 4: 4, 8, [12], 16...
Múltiplos de 3: 3, 6, 9, [12], 15...
→ MCM(4, 3) = 12  ✓

Transformación a denominador 12:
• 1/4 × (3/3) = 3/12  — multiplicamos por 3 arriba y abajo
• 1/3 × (4/4) = 4/12  — multiplicamos por 4 arriba y abajo

¿Por qué multiplicamos por 3 y por 4? Porque 12 ÷ 4 = 3 y 12 ÷ 3 = 4. Siempre dividimos el MCM entre el denominador original para saber por qué número multiplicar.`,
        math: [
          "1/4  ×  3/3  =  3/12",
          "1/3  ×  4/4  =  4/12",
          "3/12  +  4/12  =  7/12  ✓",
        ],
      },
      {
        id: "s-procedimiento",
        type: "procedure",
        title: "Procedimiento completo: 3 pasos",
        description: `Paso 1 — Encuentra el MCM de los denominadores.
Paso 2 — Convierte cada fracción a fracción equivalente con ese denominador.
Paso 3 — Suma los numeradores. El denominador ya no cambia.

Si el resultado es una fracción impropia, conviértela a número mixto.
Si el resultado se puede simplificar, simplifícalo.`,
        animation: "pasos",
        math: [
          "1/4  +  1/3",
          "Paso 1:  MCM(4,3) = 12",
          "Paso 2:  3/12  +  4/12",
          "Paso 3:  7/12  ✓",
        ],
      },
      {
        id: "s-ejemplo2",
        type: "example",
        title: "📝 Segundo ejemplo: 1/2 + 1/3",
        description: `Aplicamos los 3 pasos:

Paso 1: MCM(2, 3) = 6  (múltiplos: 2→2,4,[6]; 3→3,[6])
Paso 2: 1/2 = 3/6  (×3/3)  y  1/3 = 2/6  (×2/2)
Paso 3: 3/6 + 2/6 = 5/6

¿Se simplifica 5/6? No, porque MCD(5,6) = 1.

Ahora tú — resuelve en tu cuaderno: 3/4 + 1/6 = ?
Pista: ¿cuál es MCM(4, 6)?`,
        math: [
          "1/2  +  1/3  =  3/6  +  2/6  =  5/6  ✓",
          "¿Tu turno?  3/4  +  1/6  =  ?",
        ],
      },
    ],
  },

  // ── 3. Resta de fracciones ─────────────────────────────────────────
  {
    title: "Resta de Fracciones",
    icon: "➖",
    sections: [
      {
        id: "r-contexto",
        type: "context",
        title: "🧃 Situación: el jugo de naranja",
        description: `Sebastián tenía una botella con 5/6 de litro de jugo de naranja.

En el desayuno se tomó 1/4 de litro.

¿Cuánto jugo le queda en la botella?

Para responder necesitamos restar fracciones con diferente denominador. El proceso es idéntico al de la suma: primero igualamos los denominadores.`,
        math: ["5/6  −  1/4  =  ?"],
      },
      {
        id: "r-pausa1",
        type: "pause",
        title: "¿Cuál es MCM(6, 4)?",
        description: `Antes de ver el procedimiento, encuentra el MCM en tu cuaderno:

Múltiplos de 6: 6, __, __, ...
Múltiplos de 4: 4, 8, __, ...

¿Cuál es el primer común?

Luego conviértelas: 5/6 = ?/12  y  1/4 = ?/12`,
      },
      {
        id: "r-resolucion1",
        type: "resolution",
        title: "Respuesta: MCM(6, 4)",
        revealId: "r-pausa1",
        description: `Múltiplos de 6: 6, [12], 18...
Múltiplos de 4: 4, 8, [12], 16...
→ MCM(6, 4) = 12  ✓

Transformación:
• 5/6 × (2/2) = 10/12  — porque 12 ÷ 6 = 2
• 1/4 × (3/3) = 3/12   — porque 12 ÷ 4 = 3`,
        math: [
          "5/6  ×  2/2  =  10/12",
          "1/4  ×  3/3  =  3/12",
        ],
      },
      {
        id: "r-procedimiento",
        type: "procedure",
        title: "Resolución completa",
        description: `Con las fracciones equivalentes ya listas, restamos solo los numeradores:

El resultado 7/12 no se simplifica (MCD de 7 y 12 es 1).

Volviendo al contexto: a Sebastián le quedan 7/12 de litro de jugo.

¿Es 7/12 mayor que 1/2? Sí: 1/2 = 6/12, y 7/12 > 6/12. Le queda más de la mitad.`,
        animation: "resultado",
        math: [
          "10/12  −  3/12  =  7/12  ✓",
          "7/12  >  6/12  =  1/2",
        ],
      },
      {
        id: "r-pausa2",
        type: "pause",
        title: "Practiquemos la resta",
        description: `Resuelve estos ejercicios ANTES de ver la respuesta:

a) 3/4 − 1/6 = ?
b) 5/8 − 1/4 = ?
c) 2/3 − 1/5 = ?

Recuerda los 3 pasos:
1. Encuentra el MCM
2. Convierte a fracciones equivalentes
3. Resta los numeradores`,
        math: ["3/4  −  1/6  =  ?"],
      },
      {
        id: "r-resolucion2",
        type: "resolution",
        title: "Respuestas: práctica de resta",
        revealId: "r-pausa2",
        description: `a) 3/4 − 1/6:
   MCM(4,6) = 12 → 9/12 − 2/12 = 7/12  ✓

b) 5/8 − 1/4:
   MCM(8,4) = 8 → 5/8 − 2/8 = 3/8  ✓
   (¡Ojo! 4 ya divide a 8, así que MCM = 8, no 32)

c) 2/3 − 1/5:
   MCM(3,5) = 15 → 10/15 − 3/15 = 7/15  ✓

Error frecuente en b): calcular MCM(8,4) = 32. Cuando un denominador divide al otro, el MCM es el mayor. Siempre busca el MÍNIMO múltiplo común.`,
        math: [
          "3/4  −  1/6  =  9/12  −  2/12  =  7/12",
          "5/8  −  1/4  =  5/8  −  2/8  =  3/8",
          "2/3  −  1/5  =  10/15  −  3/15  =  7/15",
        ],
      },
    ],
  },

  // ── 4. Multiplicación de fracciones ───────────────────────────────
  {
    title: "Multiplicación de Fracciones",
    icon: "✖️",
    sections: [
      {
        id: "m-visual",
        type: "visual",
        title: "Antes de la regla: ¿qué significa multiplicar?",
        description: `"1/3 × 1/2" se lee "un tercio DE la mitad" — no es suma, es tomar una parte de una parte.

Imagina una barra de chocolate de 6 cuadros:
██████  ←  barra completa

La mitad (1/2) = 3 cuadros: ███
Un tercio de esa mitad = 1 cuadro: █

→ 1 cuadro de los 6 totales = 1/6

Conclusión: multiplicar fracciones REDUCE el resultado (tomamos una parte de una parte).`,
        animation: "chocolate",
        math: [
          "1/3  ×  1/2  =  1/6",
          "el resultado es MENOR que cualquiera de los dos factores",
        ],
      },
      {
        id: "m-pausa1",
        type: "pause",
        title: "Visualización antes de la regla",
        description: `Usa la lógica visual — sin fórmulas todavía:

Una barra tiene 12 cuadros.
1/4 de la barra = ? cuadros
2/3 de esos cuadros = ? cuadros

Ese número de cuadros, ¿qué fracción es de los 12 totales?

Escribe tu razonamiento paso a paso.`,
        math: ["1/4  ×  12  =  ?  luego  2/3  de  ese  resultado"],
      },
      {
        id: "m-resolucion1",
        type: "resolution",
        title: "Respuesta: visualización",
        revealId: "m-pausa1",
        description: `1/4 de 12 cuadros = 12 ÷ 4 = 3 cuadros.
2/3 de esos 3 cuadros = 3 × 2/3 = 2 cuadros.
2 cuadros de los 12 totales = 2/12 = 1/6.

Verificación con la regla:
2/3 × 1/4 = (2×1)/(3×4) = 2/12 = 1/6  ✓

Esto muestra que la regla algebraica (×numeradores, ×denominadores) produce el mismo resultado que pensar visualmente. La regla no es magia: es un atajo de la lógica que acabas de usar.`,
        math: [
          "1/4  ×  12  =  3  cuadros",
          "2/3  ×  3  =  2  cuadros",
          "2  de  12  =  2/12  =  1/6  ✓",
        ],
      },
      {
        id: "m-regla",
        type: "concept",
        title: "La regla: directa y sin denominador común",
        description: `A diferencia de la suma y la resta, la multiplicación NO requiere denominador común.

Regla: multiplica numeradores entre sí y denominadores entre sí.

Eso es todo. Luego simplifica el resultado si es posible (divide numerador y denominador por su MCD).`,
        animation: "pasos",
        math: [
          "2/3  ×  1/4  =  (2×1) / (3×4)  =  2/12",
          "MCD(2,12) = 2  →  2/12 ÷ 2  =  1/6  ✓",
        ],
      },
      {
        id: "m-aplicacion",
        type: "example",
        title: "🛒 Aplicación: fracciones de dinero",
        description: `Tienes 3/4 de dólar. Gastas 2/3 de ese dinero.

¿Cuánto gastaste?

Nota: el resultado 1/2 dólar es menor que 3/4 dólar. Tiene sentido: gastaste solo UNA PARTE de lo que tenías.`,
        animation: "dolar",
        math: [
          "2/3  ×  3/4  =  6/12",
          "MCD(6,12) = 6  →  6/12 ÷ 6  =  1/2  dólar  ✓",
        ],
      },
      {
        id: "m-pausa2",
        type: "pause",
        title: "Practica multiplicación",
        description: `Resuelve y simplifica ANTES de ver la respuesta:

a) 3/4 × 2/5 = ?
b) 2/3 × 3/8 = ?
c) 5/6 × 3/10 = ?

En c): intenta simplificar ANTES de multiplicar (simplificación cruzada). ¿Puedes detectar factores comunes entre numeradores y denominadores cruzados?`,
        math: ["3/4  ×  2/5  =  ?"],
      },
      {
        id: "m-resolucion2",
        type: "resolution",
        title: "Respuestas: multiplicación",
        revealId: "m-pausa2",
        description: `a) 3/4 × 2/5 = 6/20 → MCD(6,20) = 2 → 3/10  ✓

b) 2/3 × 3/8 = 6/24 → MCD(6,24) = 6 → 1/4  ✓
   Atajo: 2/3 × 3/8, el 3 del numerador y el 3 del denominador se cancelan → 2/8 = 1/4

c) 5/6 × 3/10 = 15/60 → MCD(15,60) = 15 → 1/4  ✓
   Atajo cruzado: 5 y 10 se simplifican (÷5), 3 y 6 se simplifican (÷3) → 1/2 × 1/2 = 1/4

Simplificación cruzada: cuando un numerador y un denominador diagonal comparten factores, se pueden simplificar ANTES de multiplicar. Ahorra trabajo.`,
        math: [
          "3/4  ×  2/5  =  6/20  =  3/10",
          "2/3  ×  3/8  =  6/24  =  1/4",
          "5/6  ×  3/10  =  15/60  =  1/4",
        ],
      },
    ],
  },

  // ── 5. División de fracciones ──────────────────────────────────────
  {
    title: "División de Fracciones",
    icon: "➗",
    sections: [
      {
        id: "d-visual",
        type: "visual",
        title: "¿Qué significa dividir fracciones?",
        description: `La división responde a la pregunta: "¿cuántas veces cabe el divisor en el dividendo?"

Ejemplo con enteros: 12 ÷ 3 = 4 → el 3 cabe 4 veces en 12.

Con fracciones es igual: 3/4 ÷ 1/8 pregunta "¿cuántas veces cabe 1/8 en 3/4?"

Imagina una barra dividida en 8 partes:
████████ ← 8 partes
3/4 de la barra = 6 partes → ██████
Cada porción de 1/8 = 1 parte → █
¿Cuántas porciones de 1 parte caben en 6 partes? → 6`,
        animation: "pizza",
        math: ["3/4  ÷  1/8  =  6"],
      },
      {
        id: "d-pausa1",
        type: "pause",
        title: "Piensa visualmente primero",
        description: `Sin usar ninguna regla algebraica:

Si tienes 1/2 de pizza y cada porción es 1/4 de pizza...
¿Cuántas porciones obtienes?

Y ahora otro: si tienes 2/3 de litro y cada vaso cabe 1/6 de litro...
¿Cuántos vasos puedes llenar?

Dibuja o explica con palabras.`,
        math: [
          "1/2  ÷  1/4  =  ?",
          "2/3  ÷  1/6  =  ?",
        ],
      },
      {
        id: "d-resolucion1",
        type: "resolution",
        title: "Respuesta: visualización",
        revealId: "d-pausa1",
        description: `1/2 ÷ 1/4:
Tienes 1/2 de pizza = 2 pedazos de 1/4.
Resultado: 2 porciones  ✓

2/3 ÷ 1/6:
Tienes 2/3 = 4 pedazos de 1/6 (ya que 2/3 = 4/6).
Resultado: 4 vasos  ✓

Verifica con la regla que aprenderás: 1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2 ✓
La regla algebraica siempre produce el mismo resultado que el razonamiento visual.`,
        math: [
          "1/2  ÷  1/4  =  2  (dos cuartos en una mitad)",
          "2/3  ÷  1/6  =  4  (cuatro sextos en dos tercios)",
        ],
      },
      {
        id: "d-regla",
        type: "concept",
        title: "La regla: invertir y multiplicar",
        description: `Para dividir por una fracción: multiplica por su inverso (fracción volteada).

¿Por qué funciona? Si la porción es MÁS PEQUEÑA, caben MÁS unidades. Invertir el divisor captura exactamente esa relación: convierte la división en una multiplicación equivalente.

El inverso de a/b es b/a. Al multiplicarlos: a/b × b/a = 1.`,
        animation: "buscar",
        math: [
          "3/4  ÷  1/8",
          "=  3/4  ×  8/1",
          "=  24/4  =  6  ✓",
        ],
      },
      {
        id: "d-numixtos",
        type: "concept",
        title: "Resultados como números mixtos",
        description: `A veces la división da una fracción impropia. En ese caso la convertimos a número mixto.

Pasos:
1. Simplifica la fracción si es posible (divide por el MCD).
2. Divide numerador ÷ denominador.
3. El cociente es el entero, el residuo es el nuevo numerador.

Ejemplo: 20/6 → simplifica a 10/3 → 10 ÷ 3 = 3 con residuo 1 → 3⅓`,
        math: [
          "20/6  →  MCD(20,6)=2  →  10/3",
          "10  ÷  3  =  3  resto  1  →  3  1/3",
        ],
      },
      {
        id: "d-aplicacion",
        type: "example",
        title: "🧵 Aplicación: bolsas de tela",
        description: `Tienes 5/6 de metro de tela. Cada bolsa requiere 1/4 de metro. ¿Cuántas bolsas puedes hacer?

El resultado 3⅓ indica que puedes hacer 3 bolsas completas y te sobra ⅓ de lo necesario para una cuarta (es decir, 1/12 de metro de tela sobrante).`,
        animation: "fabric",
        math: [
          "5/6  ÷  1/4  =  5/6  ×  4/1  =  20/6",
          "20/6  =  10/3  =  3  1/3  bolsas  ✓",
        ],
      },
      {
        id: "d-pausa2",
        type: "pause",
        title: "Practica la división",
        description: `Resuelve ANTES de ver la respuesta:

a) 2/3 ÷ 1/6 = ?  (verifica con tu respuesta visual de antes)
b) 3/4 ÷ 3/8 = ?
c) 5/6 ÷ 5/12 = ?

En b) y c): ¿el resultado es un entero o un número mixto?`,
        math: ["2/3  ÷  1/6  =  ?"],
      },
      {
        id: "d-resolucion2",
        type: "resolution",
        title: "Respuestas: división",
        revealId: "d-pausa2",
        description: `a) 2/3 ÷ 1/6 = 2/3 × 6/1 = 12/3 = 4  ✓  (coincide con la visualización)

b) 3/4 ÷ 3/8 = 3/4 × 8/3 = 24/12 = 2  ✓  (entero exacto)
   Atajo: los 3 del numerador y del denominador se cancelan → 1/4 × 8/1 = 8/4 = 2

c) 5/6 ÷ 5/12 = 5/6 × 12/5 = 60/30 = 2  ✓  (entero exacto)
   Atajo: los 5 se cancelan, el 12 y el 6 se simplifican (12/6=2) → 2

Cuando numerador y denominador se cancelan completamente, el resultado es un entero. Reconocer esto ahorra cálculo.`,
        math: [
          "2/3  ÷  1/6  =  2/3  ×  6/1  =  4",
          "3/4  ÷  3/8  =  3/4  ×  8/3  =  2",
          "5/6  ÷  5/12  =  5/6  ×  12/5  =  2",
        ],
      },
    ],
  },

  // ── 6. Cierre ──────────────────────────────────────────────────────
  {
    title: "¡Repaso completado!",
    icon: "🎉",
    sections: [
      {
        id: "c-resumen",
        type: "summary",
        title: "Las 4 reglas en una mirada",
        description: `✅ SUMA y RESTA → denominador común (MCM) + operar solo numeradores.
✅ MULTIPLICACIÓN → ×numeradores y ×denominadores (sin MCM).
✅ DIVISIÓN → invertir el divisor y multiplicar.
✅ SIEMPRE → simplificar el resultado (dividir por MCD).

Truco para no confundirte:
• ¿Los denominadores son diferentes? → necesitas MCM (suma y resta).
• ¿Es multiplicación o división? → opera directamente (sin MCM).`,
        math: [
          "1/4  +  1/3  =  7/12",
          "5/6  −  1/4  =  7/12",
          "2/3  ×  1/4  =  1/6",
          "3/4  ÷  1/8  =  6",
        ],
      },
      {
        id: "c-practica",
        type: "context",
        title: "🎮 ¡Hora de la práctica activa!",
        description: `La teoría sin práctica no se consolida. Usa los simuladores para aplicar lo aprendido con retroalimentación inmediata:`,
        links: [
          { to: "/pizza", label: "Simulador de Pizza — suma y resta visual", emoji: "🍕" },
          { to: "/escalera", label: "Escalera — ordena fracciones por valor", emoji: "🪜" },
          { to: "/don-fraccion", label: "Tienda Don Fracción — aplica las 4 operaciones", emoji: "🛍️" },
        ],
      },
    ],
  },
];

// ─── Componente de sección ───────────────────────────────────────────────────

interface SectionCardProps {
  section: Section;
  isRevealed: boolean;
  onReveal: () => void;
}

const SectionCard = ({ section, isRevealed, onReveal }: SectionCardProps) => {
  const style = sectionStyle[section.type];
  const isResolution = section.type === "resolution";

  if (isResolution && !isRevealed) return null;

  return (
    <motion.div
      layout
      initial={isResolution ? { opacity: 0, y: -10 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`w-full rounded-xl p-4 md:p-5 ${style.card}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white/90 ${style.badge}`}>
          {style.badgeText}
        </span>
        <span className="text-sm font-semibold text-white/90">{section.title}</span>
      </div>

      {section.animation && animMap[section.animation] && (
        <div className="w-28 h-28 mx-auto mb-2">
          <Lottie animationData={animMap[section.animation]} loop autoplay />
        </div>
      )}
      {section.image && imgMap[section.image] && (
        <img
          src={imgMap[section.image]}
          alt={section.title}
          className="w-28 h-28 object-contain rounded-lg mx-auto mb-2"
        />
      )}

      <div className="text-sm md:text-base text-white/90 whitespace-pre-line leading-relaxed">
        {section.description}
      </div>

      {section.math && <MathBlock lines={section.math} />}

      {section.links && (
        <div className="flex flex-col gap-2 mt-3">
          {section.links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all"
            >
              <span className="text-lg">{link.emoji}</span>
              <span className="text-sm">{link.label}</span>
              <span className="ml-auto opacity-50 text-sm">→</span>
            </Link>
          ))}
        </div>
      )}

      {section.type === "pause" && (
        <button
          onClick={onReveal}
          className="mt-3 w-full py-2 bg-amber-400/80 hover:bg-amber-400 text-amber-900 font-bold text-sm rounded-lg transition-all"
        >
          Ver respuesta ↓
        </button>
      )}
    </motion.div>
  );
};

// ─── Componente principal ────────────────────────────────────────────────────

export const SlideDeck = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const totalSlides = slides.length;
  const current = slides[slideIndex];

  const goToSlide = (idx: number) => {
    setSlideIndex(idx);
    setRevealed(new Set());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReveal = (pauseId: string) => {
    setRevealed((prev) => new Set([...prev, pauseId]));
  };

  const isFirst = slideIndex === 0;
  const isLast = slideIndex === totalSlides - 1;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-pink-800 to-yellow-700 p-5 md:p-10 flex flex-col items-center gap-5">

      {/* Título */}
      <h1 className="text-white text-3xl md:text-4xl font-bold text-center">
        Las Fracciones
      </h1>

      {/* Navegación por temas */}
      <div className="flex gap-2 flex-wrap justify-center max-w-2xl">
        {slides.map((slide, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            title={slide.title}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              idx === slideIndex
                ? "bg-white text-pink-800 shadow-lg scale-105"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <span>{slide.icon}</span>
            <span className="hidden sm:inline">{slide.title}</span>
            <span className="sm:hidden">{idx + 1}</span>
          </button>
        ))}
      </div>

      {/* Ficha temática */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slideIndex}
          className="w-full max-w-2xl flex flex-col gap-3"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          {/* Encabezado del tema */}
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl px-6 py-4 text-center">
            <span className="text-3xl">{current.icon}</span>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
              {current.title}
            </h2>
            <p className="text-white/60 text-xs mt-1">
              Tema {slideIndex + 1} de {totalSlides}
            </p>
          </div>

          {/* Secciones del tema */}
          {current.sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              isRevealed={!section.revealId || revealed.has(section.revealId)}
              onReveal={() => handleReveal(section.id)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Botones anterior / siguiente */}
      <div className="flex gap-3 mt-2 pb-8">
        <button
          onClick={() => goToSlide(slideIndex - 1)}
          disabled={isFirst}
          className="px-5 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 disabled:opacity-30 transition-all"
        >
          ⬅ Anterior
        </button>
        <button
          onClick={() => goToSlide(slideIndex + 1)}
          disabled={isLast}
          className="px-5 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 disabled:opacity-30 transition-all"
        >
          Siguiente ➡
        </button>
      </div>

      <Link to="/" className="text-sm text-white/70 underline hover:text-yellow-300 -mt-4 pb-6">
        ⬅ Volver al inicio
      </Link>
    </div>
  );
};
