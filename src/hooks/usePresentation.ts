import { useState, useEffect, useCallback } from 'react';
import type { Presentation, Slide, PresentationSettings, PresentationStats } from '../types/presentation';
import { presentationService } from '../services/presentationService';

export interface UsePresentationReturn {
  // Estado
  presentations: Presentation[];
  currentPresentation: Presentation | null;
  currentSlide: Slide | null;
  slideIndex: number;
  stepIndex: number;
  settings: PresentationSettings;
  stats: PresentationStats | null;
  loading: boolean;
  error: string | null;

  // Navegación
  goToSlide: (slideIndex: number, stepIndex?: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  hasNext: boolean;
  hasPrev: boolean;

  // Gestión de presentaciones
  loadPresentation: (id: string) => Promise<void>;
  createPresentation: (presentation: Omit<Presentation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string | null>;
  updatePresentation: (id: string, updates: Partial<Presentation>) => Promise<void>;
  deletePresentation: (id: string) => Promise<void>;

  // Configuración
  updateSettings: (settings: Partial<PresentationSettings>) => Promise<void>;

  // Estadísticas
  trackProgress: () => void;
  trackCompletion: () => void;
}

export const usePresentation = (initialPresentationId?: string): UsePresentationReturn => {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [currentPresentation, setCurrentPresentation] = useState<Presentation | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [settings, setSettings] = useState<PresentationSettings>({
    theme: "default",
    autoAdvance: false,
    autoAdvanceDelay: 5,
    showNotes: false,
    showProgress: true,
    allowNavigation: true,
  });
  const [stats, setStats] = useState<PresentationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentSlide = currentPresentation?.slides[slideIndex] || null;

  // Computed values
  const hasNext = useCallback(() => {
    if (!currentPresentation || !currentSlide) return false;
    
    const isLastStep = stepIndex >= currentSlide.steps.length - 1;
    const isLastSlide = slideIndex >= currentPresentation.slides.length - 1;
    
    return !isLastStep || !isLastSlide;
  }, [currentPresentation, currentSlide, slideIndex, stepIndex]);

  const hasPrev = useCallback(() => {
    return slideIndex > 0 || stepIndex > 0;
  }, [slideIndex, stepIndex]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [presentationsData, settingsData] = await Promise.all([
          presentationService.getAllPresentations(),
          presentationService.getSettings(),
        ]);

        setPresentations(presentationsData);
        setSettings(settingsData);

        if (initialPresentationId) {
          await loadPresentation(initialPresentationId);
        } else if (presentationsData.length > 0) {
          await loadPresentation(presentationsData[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [initialPresentationId]);

  // Auto-advance
  useEffect(() => {
    if (!settings.autoAdvance || loading) return;

    const timer = setTimeout(() => {
      if (hasNext()) {
        nextStep();
      }
    }, settings.autoAdvanceDelay * 1000);

    return () => clearTimeout(timer);
  }, [settings.autoAdvance, settings.autoAdvanceDelay, slideIndex, stepIndex, loading]);

  // Navegación
  const goToSlide = useCallback((newSlideIndex: number, newStepIndex: number = 0) => {
    if (!currentPresentation || !settings.allowNavigation) return;
    
    if (newSlideIndex >= 0 && newSlideIndex < currentPresentation.slides.length) {
      setSlideIndex(newSlideIndex);
      setStepIndex(newStepIndex);
    }
  }, [currentPresentation, settings.allowNavigation]);

  const nextStep = useCallback(() => {
    if (!currentPresentation || !currentSlide || !hasNext()) return;

    if (stepIndex < currentSlide.steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else if (slideIndex < currentPresentation.slides.length - 1) {
      setSlideIndex(slideIndex + 1);
      setStepIndex(0);
    }

    trackProgress();
  }, [currentPresentation, currentSlide, slideIndex, stepIndex, hasNext]);

  const prevStep = useCallback(() => {
    if (!currentPresentation || !hasPrev()) return;

    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    } else if (slideIndex > 0) {
      const prevSlide = currentPresentation.slides[slideIndex - 1];
      setSlideIndex(slideIndex - 1);
      setStepIndex(prevSlide.steps.length - 1);
    }
  }, [currentPresentation, slideIndex, stepIndex, hasPrev]);

  // Gestión de presentaciones
  const loadPresentation = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const presentation = await presentationService.getPresentationById(id);
      if (presentation) {
        setCurrentPresentation(presentation);
        setSlideIndex(0);
        setStepIndex(0);
        
        // Cargar estadísticas
        const presentationStats = await presentationService.getStats(id);
        setStats(presentationStats);
        
        // Actualizar estadísticas de visualización
        if (presentationStats) {
          await presentationService.updateStats({
            ...presentationStats,
            totalViews: presentationStats.totalViews + 1,
            lastViewed: new Date(),
          });
        } else {
          await presentationService.updateStats({
            presentationId: id,
            totalViews: 1,
            completionRate: 0,
            averageTimeSpent: 0,
            lastViewed: new Date(),
          });
        }
      } else {
        setError('Presentation not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading presentation');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPresentation = useCallback(async (presentation: Omit<Presentation, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newPresentation = await presentationService.createPresentation(presentation);
      setPresentations((prev: Presentation[]) => [...prev, newPresentation]);
      return newPresentation.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating presentation');
      return null;
    }
  }, []);

  const updatePresentation = useCallback(async (id: string, updates: Partial<Presentation>) => {
    try {
      const updatedPresentation = await presentationService.updatePresentation(id, updates);
      if (updatedPresentation) {
        setPresentations((prev: Presentation[]) => 
          prev.map((p: Presentation) => p.id === id ? updatedPresentation : p)
        );
        
        if (currentPresentation?.id === id) {
          setCurrentPresentation(updatedPresentation);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating presentation');
    }
  }, [currentPresentation]);

  const deletePresentation = useCallback(async (id: string) => {
    try {
      const success = await presentationService.deletePresentation(id);
      if (success) {
        setPresentations((prev: Presentation[]) => prev.filter((p: Presentation) => p.id !== id));
        
        if (currentPresentation?.id === id) {
          setCurrentPresentation(null);
          setSlideIndex(0);
          setStepIndex(0);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting presentation');
    }
  }, [currentPresentation]);

  // Configuración
  const updateSettings = useCallback(async (newSettings: Partial<PresentationSettings>) => {
    try {
      const updatedSettings = await presentationService.updateSettings(newSettings);
      setSettings(updatedSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating settings');
    }
  }, []);

  // Estadísticas
  const trackProgress = useCallback(() => {
    if (!currentPresentation || !stats) return;

    // Calcular porcentaje de progreso
    const totalSteps = currentPresentation.slides.reduce((acc: number, slide: Slide) => acc + slide.steps.length, 0);
    const currentStep = currentPresentation.slides.slice(0, slideIndex).reduce((acc: number, slide: Slide) => acc + slide.steps.length, 0) + stepIndex + 1;
    const progressPercent = (currentStep / totalSteps) * 100;

    // Actualizar estadísticas (debounced para no hacer demasiadas llamadas)
    const updateStats = setTimeout(async () => {
      await presentationService.updateStats({
        ...stats,
        completionRate: Math.max(stats.completionRate, progressPercent),
        lastViewed: new Date(),
      });
    }, 1000);

    return () => clearTimeout(updateStats);
  }, [currentPresentation, stats, slideIndex, stepIndex]);

  const trackCompletion = useCallback(async () => {
    if (!currentPresentation || !stats) return;

    await presentationService.updateStats({
      ...stats,
      completionRate: 100,
      lastViewed: new Date(),
    });
  }, [currentPresentation, stats]);

  return {
    // Estado
    presentations,
    currentPresentation,
    currentSlide,
    slideIndex,
    stepIndex,
    settings,
    stats,
    loading,
    error,

    // Navegación
    goToSlide,
    nextStep,
    prevStep,
    hasNext: hasNext(),
    hasPrev: hasPrev(),

    // Gestión de presentaciones
    loadPresentation,
    createPresentation,
    updatePresentation,
    deletePresentation,

    // Configuración
    updateSettings,

    // Estadísticas
    trackProgress,
    trackCompletion,
  };
};
