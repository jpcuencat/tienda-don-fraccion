import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { usePresentation } from "../../hooks/usePresentation";
import { DynamicAsset } from "./DynamicAsset";
import { PresenterNoteOverlay } from "./PresenterNoteOverlay";
import { PresenterModeToggle } from "./PresenterModeToggle";

interface SlideDeckProps {
  presentationId?: string;
  showControls?: boolean;
  showNotes?: boolean;
  autoAdvance?: boolean;
}

export const SlideDeck: React.FC<SlideDeckProps> = ({
  presentationId = "fracciones-basicas",
  showControls = true,
  showNotes = false,
  autoAdvance = false
}) => {
  const {
    currentPresentation,
    currentSlide,
    slideIndex,
    stepIndex,
    settings,
    loading,
    error,
    hasNext,
    hasPrev,
    nextStep,
    prevStep,
    goToSlide,
    loadPresentation,
    updateSettings,
    trackProgress,
    trackCompletion
  } = usePresentation(presentationId);

  const [isPresenterMode, setIsPresenterMode] = useState(false);

  // Configurar auto-advance si se especifica
  useEffect(() => {
    if (autoAdvance !== settings.autoAdvance) {
      updateSettings({ autoAdvance });
    }
  }, [autoAdvance, settings.autoAdvance, updateSettings]);

  // Configurar notas si se especifica
  useEffect(() => {
    if (showNotes !== settings.showNotes) {
      updateSettings({ showNotes });
    }
  }, [showNotes, settings.showNotes, updateSettings]);

  // Manejar navegación por teclado
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!settings.allowNavigation) return;

      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          if (hasNext) nextStep();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (hasPrev) prevStep();
          break;
        case 'Home':
          event.preventDefault();
          goToSlide(0, 0);
          break;
        case 'End':
          if (currentPresentation) {
            event.preventDefault();
            const lastSlideIndex = currentPresentation.slides.length - 1;
            const lastSlide = currentPresentation.slides[lastSlideIndex];
            goToSlide(lastSlideIndex, lastSlide.steps.length - 1);
          }
          break;
        case 'p':
        case 'P':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            setIsPresenterMode(!isPresenterMode);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [hasNext, hasPrev, nextStep, prevStep, goToSlide, currentPresentation, settings.allowNavigation, isPresenterMode]);

  // Rastrear progreso al cambiar de paso
  useEffect(() => {
    trackProgress();
  }, [slideIndex, stepIndex, trackProgress]);

  // Rastrear finalización al llegar al final
  useEffect(() => {
    if (currentPresentation && !hasNext) {
      trackCompletion();
    }
  }, [hasNext, currentPresentation, trackCompletion]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-pink-800 to-yellow-700 p-6 md:p-12 flex items-center justify-center">
        <div className="text-white text-xl">Cargando presentación...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-pink-800 to-yellow-700 p-6 md:p-12 flex items-center justify-center">
        <div className="text-white text-xl bg-red-500/20 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!currentPresentation || !currentSlide) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-pink-800 to-yellow-700 p-6 md:p-12 flex items-center justify-center">
        <div className="text-white text-xl">No se encontró la presentación</div>
      </div>
    );
  }

  const currentStep = currentSlide.steps[stepIndex];
  const totalSteps = currentSlide.steps.length;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-pink-800 to-yellow-700 p-6 md:p-12 flex flex-col items-center gap-6 relative">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center">
        <h1 className="text-white text-2xl md:text-4xl font-bold">
          {currentPresentation.title}
        </h1>
        
        {showControls && (
          <div className="flex gap-2">
            <PresenterModeToggle 
              isActive={isPresenterMode}
              onToggle={() => setIsPresenterMode(!isPresenterMode)}
            />
          </div>
        )}
      </div>

      {/* Slide Content */}
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-xl text-white text-center flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl md:text-2xl font-semibold">{currentSlide.title}</h2>
          {currentSlide.subtitle && (
            <p className="text-lg text-white/80">{currentSlide.subtitle}</p>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${slideIndex}-${stepIndex}`}
            className="w-full flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            {/* Asset dinámico */}
            {(currentStep.animationId || currentStep.image) && (
              <DynamicAsset
                animationId={currentStep.animationId}
                imageId={currentStep.image}
                className="w-40 h-40 mx-auto"
                fallback={
                  <div className="w-40 h-40 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-white/60">🎯</span>
                  </div>
                }
              />
            )}

            {/* Contenido del paso */}
            <div className="text-base md:text-lg text-white text-center whitespace-pre-line max-w-3xl">
              {currentStep.description}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <button
              onClick={prevStep}
              disabled={!hasPrev}
              className="px-6 py-3 bg-white/20 rounded-lg text-white hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Paso anterior (← o Shift+Espacio)"
            >
              ⬅ Anterior
            </button>
            
            <button
              onClick={nextStep}
              disabled={!hasNext}
              className="px-6 py-3 bg-white/20 rounded-lg text-white hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Siguiente paso (→ o Espacio)"
            >
              Siguiente ➡
            </button>
          </div>

          {/* Progress indicators */}
          {settings.showProgress && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-white/80 text-sm">
                Paso {stepIndex + 1} de {totalSteps} en "{currentSlide.title}"
              </p>
              
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(slideIndex, i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === stepIndex 
                        ? 'bg-white' 
                        : i < stepIndex 
                        ? 'bg-white/60' 
                        : 'bg-white/20'
                    }`}
                    title={`Ir al paso ${i + 1}`}
                  />
                ))}
              </div>

              <p className="text-white/60 text-xs">
                Slide {slideIndex + 1} de {currentPresentation.slides.length}
              </p>
            </div>
          )}

          {/* Auto-advance indicator */}
          {settings.autoAdvance && (
            <div className="text-white/60 text-xs flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Avance automático activado
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <Link 
        to="/" 
        className="mt-4 text-sm text-white/80 underline hover:text-yellow-300 transition-colors"
      >
        ⬅ Volver al inicio
      </Link>

      {/* Presenter Notes Overlay */}
      {isPresenterMode && currentStep.notes && (
        <PresenterNoteOverlay
          notes={currentStep.notes}
          onClose={() => setIsPresenterMode(false)}
        />
      )}

      {/* Keyboard shortcuts help */}
      {showControls && (
        <div className="fixed bottom-4 right-4 text-white/40 text-xs">
          <div>← → Navegar</div>
          <div>Ctrl+P Modo presentador</div>
        </div>
      )}
    </div>
  );
};
