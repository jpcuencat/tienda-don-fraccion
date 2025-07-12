# Documentación Técnica - Sistema de Presentaciones Refactorizado

## 🏗️ Arquitectura del Sistema

El sistema de presentaciones ha sido completamente refactorizado de un enfoque estático a uno dinámico basado en base de datos, proporcionando flexibilidad total en la gestión de contenido educativo.

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend React                           │
├─────────────────────────────────────────────────────────────┤
│  Components        │  Hooks           │  Pages              │
│  - SlideDeck       │  - usePresentation│  - SlideDeckPage   │
│  - PresentationAdmin│                  │  - AdminPage       │
│  - DynamicAsset    │                  │                    │
├─────────────────────────────────────────────────────────────┤
│                    Services Layer                           │
│  - PresentationService (CRUD operations)                   │
│  - MigrationHelper (Data transformation)                   │
├─────────────────────────────────────────────────────────────┤
│                Storage Layer (LocalStorage)                │
│  - presentation_data                                        │
│  - presentation_settings                                    │
│  - presentation_stats                                       │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Componentes Principales

### 1. PresentationService
**Ubicación**: `src/services/presentationService.ts`

Maneja todas las operaciones CRUD para presentaciones:
- Crear, leer, actualizar, eliminar presentaciones
- Gestión de slides y pasos
- Manejo de assets (animaciones e imágenes)
- Configuraciones y estadísticas

**Métodos principales**:
```typescript
// Presentaciones
getAllPresentations(): Promise<Presentation[]>
getPresentationById(id: string): Promise<Presentation | null>
createPresentation(presentation): Promise<Presentation>
updatePresentation(id: string, updates): Promise<Presentation | null>
deletePresentation(id: string): Promise<boolean>

// Slides
addSlideToPresentation(presentationId: string, slide): Promise<Slide | null>
updateSlide(presentationId: string, slideId: string, updates): Promise<Slide | null>
deleteSlide(presentationId: string, slideId: string): Promise<boolean>

// Assets
getAnimationAssets(): Promise<AnimationAsset[]>
getImageAssets(): Promise<ImageAsset[]>
getAnimationById(id: string): Promise<AnimationAsset | null>
getImageById(id: string): Promise<ImageAsset | null>
```

### 2. usePresentation Hook
**Ubicación**: `src/hooks/usePresentation.ts`

Hook personalizado que maneja el estado completo de una presentación:
- Navegación entre slides y pasos
- Configuraciones (auto-avance, notas, tema)
- Estadísticas de progreso
- Gestión de errores y carga

**API del Hook**:
```typescript
const {
  // Estado
  presentations,
  currentPresentation,
  currentSlide,
  slideIndex,
  stepIndex,
  settings,
  loading,
  error,

  // Navegación
  goToSlide,
  nextStep,
  prevStep,
  hasNext,
  hasPrev,

  // Gestión
  loadPresentation,
  createPresentation,
  updatePresentation,
  deletePresentation,

  // Configuración
  updateSettings,
} = usePresentation(presentationId);
```

### 3. Tipos TypeScript
**Ubicación**: `src/types/presentation.ts`

Definiciones completas para toda la estructura de datos:

```typescript
interface Presentation {
  id: string;
  title: string;
  description: string;
  slides: Slide[];
  targetAudience: string;
  estimatedDuration: number;
  isPublished: boolean;
  author: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  steps: SlideStep[];
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

interface SlideStep {
  id: string;
  description: string;
  image?: string;
  animationId?: string;
  notes?: string;
  duration?: number;
  order: number;
}
```

## 🔄 Migración de Datos

### MigrationHelper
**Ubicación**: `src/utils/migrationHelper.ts`

Utilidad que convierte los datos estáticos del formato anterior al nuevo formato de base de datos:

```typescript
const migrateLegacyData = (): Presentation => {
  // Convierte slides estáticos a formato de BD
  // Añade metadatos enriquecidos
  // Genera IDs únicos
  // Asigna categorías y dificultades
}
```

**Características de la migración**:
- ✅ Preserva todo el contenido existente
- ✅ Añade metadatos enriquecidos automáticamente
- ✅ Genera notas para presentadores
- ✅ Calcula duración estimada por paso
- ✅ Asigna categorías y niveles de dificultad

## 🎛️ Panel Administrativo

### PresentationAdmin Component
**Ubicación**: `src/components/Presentation/PresentationAdmin.tsx`

Interface completo para gestión de presentaciones:

**Funcionalidades**:
- 📋 Lista de todas las presentaciones
- ➕ Crear nuevas presentaciones
- ✏️ Editar presentaciones existentes
- 🗑️ Eliminar presentaciones
- 📁 Importar/Exportar en formato JSON
- 📋 Duplicar presentaciones
- 📊 Ver estadísticas básicas

## 🔌 Integración con Componentes Existentes

### SlideDeck Refactorizado
El componente SlideDeck original mantiene compatibilidad total pero ahora puede trabajar en dos modos:

```typescript
// Modo legacy (por defecto)
<SlideDeck />

// Modo con base de datos
<SlideDeck enableDatabase={true} presentationId="fracciones-basicas" />
```

### DynamicAsset Component
**Ubicación**: `src/components/Presentation/DynamicAsset.tsx`

Componente que carga assets dinámicamente:
- Soporte para animaciones Lottie
- Soporte para imágenes
- Manejo de errores y estados de carga
- Fallbacks personalizables

## 📈 Estadísticas y Analytics

El sistema incluye seguimiento básico de uso:

```typescript
interface PresentationStats {
  presentationId: string;
  totalViews: number;
  completionRate: number;
  averageTimeSpent: number;
  lastViewed: Date;
}
```

## 🚀 Extensibilidad Futura

### Preparado para Base de Datos Real
El sistema está diseñado para migrar fácilmente a una base de datos real:
- Interfaz abstracta en PresentationService
- Operaciones async/await ya implementadas
- Estructura de datos normalizada

### Funcionalidades Pendientes
- [ ] Editor WYSIWYG para slides
- [ ] Colaboración en tiempo real
- [ ] Temas personalizables avanzados
- [ ] Analytics detallados
- [ ] API REST para integración externa
- [ ] Autenticación y autorización
- [ ] Versionado de presentaciones
- [ ] Comentarios y feedback

## 🧪 Testing y Desarrollo

### Datos de Prueba
El sistema incluye datos de prueba automáticos:
- Presentación por defecto migrada
- Assets de ejemplo
- Configuraciones predeterminadas

### Desarrollo Local
```bash
# El sistema funciona inmediatamente con localStorage
npm run dev

# Para simular migración, limpiar localStorage:
localStorage.clear()
```

## 📝 Notas de Implementación

### Decisiones de Diseño
1. **LocalStorage como BD**: Permite funcionar sin backend
2. **Tipos TypeScript estrictos**: Previene errores en runtime
3. **Hooks personalizados**: Facilita reutilización y testing
4. **Compatibilidad hacia atrás**: No rompe funcionalidad existente
5. **Interfaz familiar**: Mantiene UX consistente

### Limitaciones Actuales
- LocalStorage tiene límite de ~5-10MB
- No hay sincronización entre dispositivos
- No hay autenticación/autorización
- Búsqueda básica sin indexación

### Rendimiento
- Carga lazy de assets
- Memoización en hooks
- Actualizaciones granulares
- Estados de carga optimizados
