import type { 
  Presentation, 
  Slide, 
  AnimationAsset, 
  ImageAsset, 
  PresentationSettings,
  PresentationStats 
} from '../types/presentation';

// Datos de animaciones disponibles
const animationAssets: AnimationAsset[] = [
  { id: 's1', name: 'Pizza', description: 'Animación de pizza', filePath: './animations/pizza.json', category: 'fracciones', tags: ['pizza', 'suma'] },
  { id: 's2', name: 'Pizza Slice', description: 'Animación de rebanada de pizza', filePath: './animations/pizza_slice.json', category: 'fracciones', tags: ['pizza', 'suma'] },
  { id: 's3', name: 'Pasos', description: 'Animación de pasos', filePath: './animations/pasos.json', category: 'general', tags: ['proceso', 'pasos'] },
  { id: 'r1', name: 'Igualar', description: 'Animación de igualar', filePath: './animations/igualar.json', category: 'fracciones', tags: ['resta', 'igualar'] },
  { id: 'r2', name: 'Buscar', description: 'Animación de búsqueda', filePath: './animations/buscar.json', category: 'general', tags: ['buscar', 'proceso'] },
  { id: 'r3', name: 'Igual', description: 'Animación de igualdad', filePath: './animations/igual.json', category: 'matemáticas', tags: ['igual', 'resultado'] },
  { id: 'r4', name: 'Resultado', description: 'Animación de resultado', filePath: './animations/resultado.json', category: 'general', tags: ['resultado', 'final'] },
  { id: 'm1', name: 'Chocolate', description: 'Animación de chocolate', filePath: './animations/chocolate.json', category: 'fracciones', tags: ['chocolate', 'multiplicacion'] },
  { id: 'm4', name: 'Dólar', description: 'Animación de dinero', filePath: './animations/dolar.json', category: 'dinero', tags: ['dinero', 'comercio'] },
  { id: 'd5', name: 'Fabric', description: 'Animación de tela', filePath: './animations/fabric.json', category: 'materiales', tags: ['tela', 'division'] },
];

// Datos de imágenes disponibles
const imageAssets: ImageAsset[] = [
  { id: 'pizza', name: 'Pizza', description: 'Imagen de pizza', filePath: '../../assets/images/pizza.png', alt: 'Pizza dividida en partes', category: 'comida', tags: ['pizza', 'fracciones'] },
  { id: 'tanque', name: 'Tanque', description: 'Tanque de gasolina', filePath: '../../assets/images/tanque.png', alt: 'Tanque de gasolina', category: 'vehiculos', tags: ['tanque', 'combustible'] },
  { id: 'descuento', name: 'Descuento', description: 'Cartel de descuento', filePath: '../../assets/images/descuento.png', alt: 'Cartel de descuento', category: 'comercio', tags: ['descuento', 'tienda'] },
  { id: 'receta', name: 'Receta', description: 'Receta de cocina', filePath: '../../assets/images/receta.png', alt: 'Receta de cocina', category: 'cocina', tags: ['receta', 'cocinar'] },
];

class PresentationService {
  private storageKey = 'presentation_data';
  private settingsKey = 'presentation_settings';
  private statsKey = 'presentation_stats';

  // Simulación de una base de datos con localStorage
  private async saveToStorage<T>(key: string, data: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  private async getFromStorage<T>(key: string): Promise<T | null> {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting from storage:', error);
      return null;
    }
  }

  // Métodos para presentaciones
  async getAllPresentations(): Promise<Presentation[]> {
    const presentations = await this.getFromStorage<Presentation[]>(this.storageKey);
    return presentations || this.getDefaultPresentations();
  }

  async getPresentationById(id: string): Promise<Presentation | null> {
    const presentations = await this.getAllPresentations();
    return presentations.find(p => p.id === id) || null;
  }

  async createPresentation(presentation: Omit<Presentation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Presentation> {
    const newPresentation: Presentation = {
      ...presentation,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const presentations = await this.getAllPresentations();
    presentations.push(newPresentation);
    await this.saveToStorage(this.storageKey, presentations);
    
    return newPresentation;
  }

  async updatePresentation(id: string, updates: Partial<Presentation>): Promise<Presentation | null> {
    const presentations = await this.getAllPresentations();
    const index = presentations.findIndex(p => p.id === id);
    
    if (index === -1) return null;

    presentations[index] = {
      ...presentations[index],
      ...updates,
      updatedAt: new Date(),
    };

    await this.saveToStorage(this.storageKey, presentations);
    return presentations[index];
  }

  async deletePresentation(id: string): Promise<boolean> {
    const presentations = await this.getAllPresentations();
    const filteredPresentations = presentations.filter(p => p.id !== id);
    
    if (filteredPresentations.length === presentations.length) {
      return false; // No se encontró la presentación
    }

    await this.saveToStorage(this.storageKey, filteredPresentations);
    return true;
  }

  // Métodos para slides
  async addSlideToPresentation(presentationId: string, slide: Omit<Slide, 'id' | 'createdAt' | 'updatedAt'>): Promise<Slide | null> {
    const presentations = await this.getAllPresentations();
    const presentation = presentations.find(p => p.id === presentationId);
    
    if (!presentation) return null;

    const newSlide: Slide = {
      ...slide,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    presentation.slides.push(newSlide);
    presentation.updatedAt = new Date();
    
    await this.saveToStorage(this.storageKey, presentations);
    return newSlide;
  }

  async updateSlide(presentationId: string, slideId: string, updates: Partial<Slide>): Promise<Slide | null> {
    const presentations = await this.getAllPresentations();
    const presentation = presentations.find(p => p.id === presentationId);
    
    if (!presentation) return null;

    const slideIndex = presentation.slides.findIndex(s => s.id === slideId);
    if (slideIndex === -1) return null;

    presentation.slides[slideIndex] = {
      ...presentation.slides[slideIndex],
      ...updates,
      updatedAt: new Date(),
    };

    presentation.updatedAt = new Date();
    await this.saveToStorage(this.storageKey, presentations);
    
    return presentation.slides[slideIndex];
  }

  async deleteSlide(presentationId: string, slideId: string): Promise<boolean> {
    const presentations = await this.getAllPresentations();
    const presentation = presentations.find(p => p.id === presentationId);
    
    if (!presentation) return false;

    const originalLength = presentation.slides.length;
    presentation.slides = presentation.slides.filter(s => s.id !== slideId);
    
    if (presentation.slides.length === originalLength) {
      return false; // No se encontró el slide
    }

    presentation.updatedAt = new Date();
    await this.saveToStorage(this.storageKey, presentations);
    return true;
  }

  // Métodos para assets
  async getAnimationAssets(): Promise<AnimationAsset[]> {
    return animationAssets;
  }

  async getImageAssets(): Promise<ImageAsset[]> {
    return imageAssets;
  }

  async getAnimationById(id: string): Promise<AnimationAsset | null> {
    return animationAssets.find(a => a.id === id) || null;
  }

  async getImageById(id: string): Promise<ImageAsset | null> {
    return imageAssets.find(i => i.id === id) || null;
  }

  // Métodos para configuración
  async getSettings(): Promise<PresentationSettings> {
    const settings = await this.getFromStorage<PresentationSettings>(this.settingsKey);
    return settings || this.getDefaultSettings();
  }

  async updateSettings(settings: Partial<PresentationSettings>): Promise<PresentationSettings> {
    const currentSettings = await this.getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    await this.saveToStorage(this.settingsKey, updatedSettings);
    return updatedSettings;
  }

  // Métodos para estadísticas
  async getStats(presentationId: string): Promise<PresentationStats | null> {
    const allStats = await this.getFromStorage<PresentationStats[]>(this.statsKey);
    return allStats?.find(s => s.presentationId === presentationId) || null;
  }

  async updateStats(stats: PresentationStats): Promise<void> {
    const allStats = await this.getFromStorage<PresentationStats[]>(this.statsKey) || [];
    const index = allStats.findIndex(s => s.presentationId === stats.presentationId);
    
    if (index >= 0) {
      allStats[index] = stats;
    } else {
      allStats.push(stats);
    }
    
    await this.saveToStorage(this.statsKey, allStats);
  }

  // Datos por defecto
  private getDefaultSettings(): PresentationSettings {
    return {
      theme: "default",
      autoAdvance: false,
      autoAdvanceDelay: 5,
      showNotes: false,
      showProgress: true,
      allowNavigation: true,
    };
  }

  private getDefaultPresentations(): Presentation[] {
    return [
      {
        id: "fracciones-basicas",
        title: "Las Fracciones",
        description: "Introducción completa a las operaciones con fracciones",
        targetAudience: "primaria",
        estimatedDuration: 45,
        isPublished: true,
        author: "Sistema",
        version: "1.0",
        createdAt: new Date(),
        updatedAt: new Date(),
        slides: [
          {
            id: "intro",
            title: "¿Qué es una fracción en el mundo real?",
            subtitle: "Ejemplos cotidianos de fracciones",
            category: "introduccion",
            difficulty: "beginner",
            tags: ["introduccion", "vida-real", "ejemplos"],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            order: 1,
            steps: [
              {
                id: "i1",
                description: "🍕 Una Pizza dividida en 8 partes iguales, de la cual alguien ya ha comido 4 partes.\n¿Qué significa que alguien se haya comido 1/2(4/8) de pizza?",
                image: "pizza",
                notes: "Enfatizar la relación entre partes y el todo",
                duration: 120,
                order: 1
              },
              {
                id: "i2",
                description: "⛽ Un tanque de gasolina que está lleno hasta 3/4 de su capacidad.\n¿Cómo interpretamos que el tanque está 3/4 lleno?",
                image: "tanque",
                notes: "Conectar con experiencias de los estudiantes",
                duration: 90,
                order: 2
              },
              {
                id: "i3",
                description: "🏷️ Un letrero en una tienda que anuncia una promoción con \"1/3 de descuento\".\n¿Por qué es importante comprender qué es 1/3 de descuento cuando compramos?",
                image: "descuento",
                notes: "Importancia práctica de las fracciones",
                duration: 90,
                order: 3
              },
              {
                id: "i4",
                description: "🥣 Una receta de cocina que pide exactamente 2 ½ tazas de harina para preparar un pastel.\n¿Qué sucede si en una receta solo usamos 2 tazas en vez de 2 ½?",
                image: "receta",
                notes: "Precisión en las medidas",
                duration: 90,
                order: 4
              }
            ]
          }
          // Más slides se pueden agregar aquí...
        ]
      }
    ];
  }
}

export const presentationService = new PresentationService();
