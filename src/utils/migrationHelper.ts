// Utilidad para migrar datos del formato antiguo al nuevo sistema de base de datos
import type { Presentation, Slide, SlideStep } from '../types/presentation';

// Datos del formato antiguo (extraídos del SlideDeck original)
const legacySlides = [
  {
    title: "¿Qué es una fracción en el mundo real?",
    steps: [
      { id: "i1", description: `🍕 Una Pizza dividida en 8 partes iguales, de la cual alguien ya ha comido 4 partes.\n¿Qué significa que alguien se haya comido 1/2(4/8) de pizza?`, image: "pizza" },
      { id: "i2", description: `⛽ Un tanque de gasolina que está lleno hasta 3/4 de su capacidad.\n¿Cómo interpretamos que el tanque está 3/4 lleno?`, image: "tanque" },
      { id: "i3", description: `🏷️ Un letrero en una tienda que anuncia una promoción con "1/3 de descuento".\n¿Por qué es importante comprender qué es 1/3 de descuento cuando compramos?`, image: "descuento" },
      { id: "i4", description: `🥣 Una receta de cocina que pide exactamente 2 ½ tazas de harina para preparar un pastel.\n¿Qué sucede si en una receta solo usamos 2 tazas en vez de 2 ½?`, image: "receta" },
      { id: "i5", description: `Reflexión:\n\n"¿Por qué creen que usamos fracciones en la vida real, como en el comercio, la cocina o la medición, en lugar de solo números enteros?"\n\nUsamos fracciones porque muchas veces necesitamos expresar cantidades que no son completas.\n\nPor ejemplo:\n✅ En una pizza, si solo comemos una parte, no es una pizza entera.\n✅ En una receta, muchas veces usamos la mitad o una cuarta parte de un ingrediente para que la comida quede bien.\n✅ Cuando vamos a la tienda, los descuentos o el peso de los productos a veces son menos de una unidad entera (como 1/2 kilo de queso).\n\nEn resumen, las fracciones nos permiten describir cantidades más precisas cuando algo está dividido en partes.\n\nSin ellas, solo podríamos usar números enteros, y muchas cosas en el día a día serían menos exactas o difíciles de expresar.` },
    ]
  },
  {
    title: "➕ Suma de Fracciones (Regla de Oro)",
    steps: [
      { id: "s1", description: "✨ Regla de oro: \"Para sumar fracciones, necesitamos que tengan el mismo tamaño de pedazo\"." },
      { id: "s2", description: "🍕 Analogía: Una pizza dividida en 4 partes nos comemos una parte (1/4) y otra pizza dividida en 3 partes nos comemos una parte(1/3). No se pueden sumar hasta tener el mismo tamaño." },
      { id: "s3", description: "🔎 Paso 1: Múltiplos de 4 = [4,8,12], Múltiplos de 3 = [3,6,9,12] → mcm = 12" },
      { id: "s4", description: "📐 Paso 2: Fracciones equivalentes → 1/4 = 3/12, 1/3 = 4/12" },
      { id: "s5", description: "✅ Paso 3: 3/12 + 4/12 = 7/12" },
    ],
  },
  {
    title: "➖ Resta de Fracciones",
    steps: [
      { id: "r1", description: "📏 Antes de restar, igualamos el tamaño de los pedazos → denominador común." },
      { id: "r2", description: "🔎 Múltiplos de 6 = [6,12,18], Múltiplos de 4 = [4,8,12] → mcm = 12" },
      { id: "r3", description: "📐 Fracciones equivalentes → 5/6 = 10/12, 1/4 = 3/12" },
      { id: "r4", description: "✅ Resultado: 10/12 - 3/12 = 7/12" },
    ],
  },
  {
    title: "✖️ Multiplicación de Fracciones",
    steps: [
      { id: "m1", description: "🍫 Tienes 1/4 de una barra de chocolate. Tomas 2/3 de esa parte. ¿qué fracción de la barra completa estás tomando?" },
      { id: "m2", description: "🧮 Paso 1: Multiplica numeradores: 2×1 = 2. Denominadores: 3×4 = 12" },
      { id: "m3", description: "✅ Resultado: 2/12 = 1/6" },
      { id: "m4", description: "🛒 Aplicación: 2/3 de 3/4 dólar = (2×3)/(3×4) = 6/12 = 1/2 dólar" },
    ],
  },
  {
    title: "➗ División de Fracciones",
    steps: [
      { id: "d1", description: "🍕 Tienes 3/4 de pizza y quieres saber cuántos trozos de 1/8 caben allí." },
      { id: "d2", description: "🔁 Paso 1: Voltear 1/8 → se convierte en 8/1" },
      { id: "d3", description: "✖️ Paso 2: Multiplicar: 3/4 × 8/1 = 24/4 = 6" },
      { id: "d4", description: "✅ Resultado: 6 porciones de 1/8 en 3/4" },
      { id: "d5", description: "🧵 Aplicación: 5/6 ÷ 1/4 = 5/6 × 4/1 = 20/6 = 3 1/3 bolsas de tela" },
    ],
  },
];

// Mapping de animaciones del formato antiguo
const animationMapping: Record<string, string> = {
  s1: "s1", s2: "s2", s3: "s3", s4: "s4", s5: "s5",
  r1: "r1", r2: "r2", r3: "r3", r4: "r4",
  m1: "m1", m2: "m2", m3: "m3", m4: "m4",
  d1: "d1", d2: "d2", d3: "d3", d4: "d4", d5: "d5",
};

export const migrateLegacyData = (): Presentation => {
  const slides: Slide[] = legacySlides.map((legacySlide, slideIndex) => {
    const steps: SlideStep[] = legacySlide.steps.map((step, stepIndex) => ({
      id: step.id,
      description: step.description,
      image: step.image,
      animationId: animationMapping[step.id],
      notes: generateNotesForStep(step.id, step.description),
      duration: estimateDuration(step.description),
      order: stepIndex + 1,
    }));

    const category = getSlideCategory(legacySlide.title);
    
    return {
      id: `slide-${slideIndex + 1}`,
      title: legacySlide.title,
      subtitle: getSubtitle(legacySlide.title),
      steps,
      category,
      difficulty: getDifficulty(category),
      tags: getTags(legacySlide.title),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      order: slideIndex + 1,
    };
  });

  return {
    id: "fracciones-basicas",
    title: "Las Fracciones - Curso Completo",
    description: "Una introducción completa a las operaciones con fracciones para estudiantes de primaria",
    slides,
    targetAudience: "primaria",
    estimatedDuration: 45,
    isPublished: true,
    author: "Sistema Educativo",
    version: "2.0.0",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Funciones auxiliares
function generateNotesForStep(stepId: string, description: string): string {
  const noteTemplates: Record<string, string> = {
    i1: "Enfatizar la relación visual entre las partes comidas y el total. Usar gestos para mostrar la fracción.",
    i2: "Relacionar con experiencias cotidianas de los estudiantes con vehículos.",
    i3: "Explicar la importancia práctica de entender descuentos al ir de compras.",
    i4: "Demostrar cómo la precisión en las medidas afecta el resultado final.",
    s1: "Esta es la regla fundamental. Asegurar que todos entiendan antes de continuar.",
    s2: "Usar objetos físicos si es posible para demostrar el concepto.",
    s3: "Escribir los múltiplos en la pizarra paso a paso.",
    s4: "Mostrar visualmente cómo las fracciones cambian pero mantienen el mismo valor.",
    s5: "Enfatizar que solo sumamos numeradores cuando los denominadores son iguales.",
  };

  return noteTemplates[stepId] || "Tomar tiempo para preguntas y aclarar dudas.";
}

function estimateDuration(description: string): number {
  // Estimar duración basada en la longitud del contenido
  const wordCount = description.split(' ').length;
  if (wordCount < 20) return 60; // 1 minuto
  if (wordCount < 50) return 90; // 1.5 minutos
  if (wordCount < 100) return 120; // 2 minutos
  return 180; // 3 minutos
}

function getSlideCategory(title: string): string {
  if (title.includes("mundo real")) return "introduccion";
  if (title.includes("Suma")) return "suma";
  if (title.includes("Resta")) return "resta";
  if (title.includes("Multiplicación")) return "multiplicacion";
  if (title.includes("División")) return "division";
  return "general";
}

function getSubtitle(title: string): string | undefined {
  const subtitles: Record<string, string> = {
    "¿Qué es una fracción en el mundo real?": "Ejemplos cotidianos y aplicaciones prácticas",
    "➕ Suma de Fracciones (Regla de Oro)": "Método paso a paso para sumar fracciones",
    "➖ Resta de Fracciones": "Técnica para restar fracciones correctamente",
    "✖️ Multiplicación de Fracciones": "Proceso simplificado de multiplicación",
    "➗ División de Fracciones": "Método de inversión y multiplicación",
  };
  
  return subtitles[title];
}

function getDifficulty(category: string): "beginner" | "intermediate" | "advanced" {
  const difficultyMap: Record<string, "beginner" | "intermediate" | "advanced"> = {
    introduccion: "beginner",
    suma: "intermediate",
    resta: "intermediate", 
    multiplicacion: "advanced",
    division: "advanced",
  };
  
  return difficultyMap[category] || "beginner";
}

function getTags(title: string): string[] {
  const baseTags = ["fracciones", "matematicas", "educacion"];
  
  if (title.includes("mundo real")) return [...baseTags, "aplicaciones", "vida-cotidiana"];
  if (title.includes("Suma")) return [...baseTags, "suma", "operaciones"];
  if (title.includes("Resta")) return [...baseTags, "resta", "operaciones"];
  if (title.includes("Multiplicación")) return [...baseTags, "multiplicacion", "operaciones"];
  if (title.includes("División")) return [...baseTags, "division", "operaciones"];
  
  return baseTags;
}

export default migrateLegacyData;
