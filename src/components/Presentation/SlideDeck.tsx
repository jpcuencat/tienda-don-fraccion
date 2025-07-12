import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import { presentationService } from "../../services/presentationService";
import { migrateLegacyData } from "../../utils/migrationHelper";
import type { Presentation, Slide, SlideStep } from "../../types/presentation";

// Importaciones de animaciones (mantenidas para compatibilidad)
import pizzaAnim from "./animations/pizza.json";
import pizzaSliceAnim from "./animations/pizza_slice.json";
import chocolateAnim from "./animations/chocolate.json";
import fabricAnim from "./animations/fabric.json";
import pasosAnim from "./animations/pasos.json";
import igualarAnim from "./animations/igualar.json";
import igualAnim from "./animations/igual.json";
import buscarAnim from "./animations/buscar.json";
import resultadoAnim from "./animations/resultado.json";
import pizza from '../../assets/images/pizza.png';
import tanque from '../../assets/images/tanque.png';
import descuento from '../../assets/images/descuento.png';
import receta from '../../assets/images/receta.png';
import dolarAnim from "./animations/dolar.json";

const animationMap: Record<string, any> = {
  s1: pizzaAnim,
  s2: pizzaSliceAnim,
  s3: pasosAnim,
  s4: pasosAnim,
  s5: pasosAnim,
  r1: igualarAnim,
  r2: buscarAnim,
  r3: igualAnim,
  r4: resultadoAnim,
  m1: chocolateAnim,
  m2: pasosAnim,
  m3: resultadoAnim,
  m4: dolarAnim,
  d1: pizzaAnim,
  d2: pasosAnim,
  d3: pasosAnim,
  d4: resultadoAnim,
  d5: fabricAnim,
};

// Mapeo de imágenes
const imageMap: Record<string, string> = {
  pizza: pizza,
  tanque: tanque,
  descuento: descuento,
  receta: receta,
};

interface SlideDeckProps {
  presentationId?: string;
  showControls?: boolean;
  enableDatabase?: boolean; // Nueva prop para habilitar el sistema de BD
}

const slides: SlideStep[] = [
  {
    title: "¿Qué es una fracción en el mundo real?",
        steps: [
            { id: "i1", description: `🍕 Una Pizza dividida en 8 partes iguales, de la cual alguien ya ha comido 4 partes.
        ¿Qué significa que alguien se haya comido 1/2(4/8) de pizza?` , image: pizza},
            { id: "i2", description: `⛽ Un tanque de gasolina que está lleno hasta 3/4 de su capacidad.
        ¿Cómo interpretamos que el tanque está 3/4 lleno?`,image: tanque },
            { id: "i3", description: `🏷️ Un letrero en una tienda que anuncia una promoción con “1/3 de descuento”.
        ¿Por qué es importante comprender qué es 1/3 de descuento cuando compramos?`,image: descuento },
            { id: "i4", description: `🥣 Una receta de cocina que pide exactamente 2 ½ tazas de harina para preparar un pastel.
        ¿Qué sucede si en una receta solo usamos 2 tazas en vez de 2 ½?`,image: receta },
            { id: "i5", description: `Reflexión:

        "¿Por qué creen que usamos fracciones en la vida real, como en el comercio, la cocina o la medición, en lugar de solo números enteros?"

        Usamos fracciones porque muchas veces necesitamos expresar cantidades que no son completas.

        Por ejemplo:
        ✅ En una pizza, si solo comemos una parte, no es una pizza entera.
        ✅ En una receta, muchas veces usamos la mitad o una cuarta parte de un ingrediente para que la comida quede bien.
        ✅ Cuando vamos a la tienda, los descuentos o el peso de los productos a veces son menos de una unidad entera (como 1/2 kilo de queso).

        En resumen, las fracciones nos permiten describir cantidades más precisas cuando algo está dividido en partes.

        Sin ellas, solo podríamos usar números enteros, y muchas cosas en el día a día serían menos exactas o difíciles de expresar.` },
            ]
  },
  {
    title: "➕ Suma de Fracciones (Regla de Oro)",
    steps: [
      { id: "s1", description: "✨ Regla de oro: “Para sumar fracciones, necesitamos que tengan el mismo tamaño de pedazo”." },
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


export const SlideDeck = ({ enableDatabase = false }: { enableDatabase?: boolean } = {}) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [presentationData, setPresentationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Cargar datos desde la base de datos si está habilitada
  useEffect(() => {
    if (enableDatabase) {
      const loadFromDatabase = async () => {
        setLoading(true);
        try {
          const presentation = await presentationService.getPresentationById("fracciones-basicas");
          if (presentation) {
            setPresentationData(presentation);
          } else {
            // Si no existe, migrar datos legacy
            const migratedData = migrateLegacyData();
            await presentationService.createPresentation(migratedData);
            setPresentationData(migratedData);
          }
        } catch (error) {
          console.error("Error loading presentation:", error);
          // Fallback a datos estáticos
          setPresentationData(null);
        } finally {
          setLoading(false);
        }
      };
      
      loadFromDatabase();
    }
  }, [enableDatabase]);

  // Usar datos de la base de datos o fallback a datos estáticos
  const slidesData = presentationData?.slides || slides;
  const currentSlide = slidesData[slideIndex];
  const currentStep = currentSlide.steps[stepIndex];
  const totalSteps = currentSlide.steps.length;

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    } else if (slideIndex > 0) {
      const prevSlide = slidesData[slideIndex - 1];
      setSlideIndex(slideIndex - 1);
      setStepIndex(prevSlide.steps.length - 1);
    }
  };

  const handleNext = () => {
    if (stepIndex < totalSteps - 1) {
      setStepIndex(stepIndex + 1);
    } else if (slideIndex < slidesData.length - 1) {
      setSlideIndex(slideIndex + 1);
      setStepIndex(0);
    }
  };

  // Función para obtener imagen
  const getImageSrc = (imageId: string | undefined) => {
    if (!imageId) return undefined;
    return imageMap[imageId] || imageId;
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-pink-800 to-yellow-700 p-6 md:p-12 flex items-center justify-center">
        <div className="text-white text-xl">Cargando presentación...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-pink-800 to-yellow-700 p-6 md:p-12 flex flex-col items-center gap-6">
      <h1 className="text-white text-3xl md:text-4xl font-bold text-center">
        Las Fracciones
      </h1>

      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-xl text-white text-center flex flex-col items-center gap-4">
        <h2 className="text-xl md:text-2xl font-semibold">{currentSlide.title}</h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            className="w-full flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            {animationMap[currentStep.id] && (
              <div className="w-40 h-40 mx-auto">
                <Lottie animationData={animationMap[currentStep.id]} loop autoplay />
              </div>
            )}          
            {currentStep.image && (
              <img
                src={currentStep.image}
                alt={currentStep.description}
                className="w-40 h-40 object-contain rounded-lg shadow-lg"
              />
            )}
            <div className="text-base md:text-lg text-white text-center whitespace-pre-line">
                {currentStep.description}
            </div>
            
            
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handlePrev}
          disabled={slideIndex === 0 && stepIndex === 0}
          className="px-4 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 disabled:opacity-40"
        >
          ⬅ Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={
            slideIndex === slides.length - 1 &&
            stepIndex === currentSlide.steps.length - 1
          }
          className="px-4 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 disabled:opacity-40"
        >
          Siguiente ➡
        </button>
      </div>

      <p className="text-white/80 text-sm mt-2">
        Página {stepIndex + 1} de {totalSteps} en esta operación
      </p>
      <Link to="/" className="mt-4 text-sm text-white underline hover:text-yellow-300">
  ⬅ Volver al inicio
</Link>

    </div>
  );
};
