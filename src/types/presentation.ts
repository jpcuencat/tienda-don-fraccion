export interface SlideStep {
  id: string;
  description: string;
  image?: string;
  animationId?: string;
  notes?: string; // Notas para el presentador
  duration?: number; // Duración sugerida en segundos
  order: number; // Orden dentro del slide
}

export interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  steps: SlideStep[];
  category: string; // ej: "suma", "resta", "multiplicacion", "division", "introduccion"
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  order: number; // Orden dentro de la presentación
}

export interface Presentation {
  id: string;
  title: string;
  description: string;
  slides: Slide[];
  targetAudience: string; // ej: "primaria", "secundaria", "adultos"
  estimatedDuration: number; // en minutos
  isPublished: boolean;
  author: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnimationAsset {
  id: string;
  name: string;
  description: string;
  filePath: string;
  category: string;
  tags: string[];
}

export interface ImageAsset {
  id: string;
  name: string;
  description: string;
  filePath: string;
  alt: string;
  category: string;
  tags: string[];
}

export interface PresentationSettings {
  theme: "default" | "dark" | "light" | "colorful";
  autoAdvance: boolean;
  autoAdvanceDelay: number; // en segundos
  showNotes: boolean;
  showProgress: boolean;
  allowNavigation: boolean;
}

export interface PresentationStats {
  presentationId: string;
  totalViews: number;
  completionRate: number;
  averageTimeSpent: number; // en minutos
  lastViewed: Date;
}
