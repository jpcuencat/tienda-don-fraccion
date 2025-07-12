# 🎓 Plataforma Educativa de Fracciones

Una aplicación web educativa interactiva diseñada para enseñar fracciones de manera visual y práctica. El proyecto incluye múltiples simuladores y juegos que ayudan a los estudiantes a comprender conceptos de fracciones de forma divertida.

## 🚀 Tecnologías Utilizadas

- **Frontend Framework**: React 19.1.0 con TypeScript
- **Build Tool**: Vite 6.3.5
- **Estilos**: Tailwind CSS 3.4.1
- **Animaciones**: Framer Motion 12.18.1 y Lottie React 2.4.1
- **Routing**: React Router DOM 7.6.2
- **Drag & Drop**: React DnD 16.0.1
- **Matemáticas**: Fraction.js 5.2.2
- **Utilidades**: Lodash 4.17.21
- **Efectos Visuales**: Canvas Confetti 1.9.3

## 📁 Estructura del Proyecto

```
src/
├── pages/                     # Páginas principales
│   ├── Home.tsx              # Página de inicio con navegación
│   ├── PizzaSimulatorPage.tsx # Simulador de fracciones con pizzas
│   ├── SlideDeckPage.tsx     # Presentación educativa paso a paso
│   ├── StaircasePage.tsx     # Juego de escalera de fracciones
│   └── DonFraccionPage.tsx   # Simulador de tienda de fracciones
├── components/
│   ├── Footer.tsx            # Componente de pie de página
│   ├── DonFraccion/         # Componentes del juego de tienda
│   │   ├── DonFraccionGame.tsx    # Juego principal de la tienda
│   │   ├── ProductItem.tsx        # Elemento de producto
│   │   ├── ProductList.tsx        # Lista de productos
│   │   ├── PurchaseCalculator.tsx # Calculadora de compras
│   │   ├── SalesManager.tsx       # Gestión de ventas
│   │   └── DiscountManager.tsx    # Gestión de descuentos
│   ├── Presentation/        # Sistema de presentaciones
│   │   ├── SlideDeck.tsx          # Conjunto de diapositivas
│   │   ├── Slide.tsx              # Diapositiva individual
│   │   ├── PresenterModeToggle.tsx # Control de modo presentador
│   │   ├── PresenterNoteOverlay.tsx # Notas del presentador
│   │   └── animations/            # Animaciones Lottie
│   ├── SimulatorPizza/      # Simulador de fracciones con pizzas
│   │   ├── PizzaSimulator.tsx     # Simulador principal
│   │   ├── PizzaPiece.tsx         # Pieza de pizza arrastrable
│   │   ├── PizzaDropZone.tsx      # Zona de soltar pizzas
│   │   └── HistorialPanel.tsx     # Panel de historial
│   └── Staircase/          # Juego de escalera de fracciones
│       ├── FractionStaircase.tsx  # Escalera principal
│       ├── DraggableFraction.tsx  # Fracción arrastrable
│       ├── FractionDropZone.tsx   # Zona de soltar fracciones
│       └── index.ts               # Exportaciones
├── assets/
│   ├── css/                 # Estilos CSS personalizados
│   ├── images/             # Imágenes del proyecto
│   └── img/productos/      # Iconos SVG de productos
├── services/                  # Servicios de la aplicación
│   ├── presentationService.ts  # Servicio de gestión de presentaciones
├── hooks/                     # Hooks personalizados
│   ├── usePresentation.ts      # Hook para gestión de presentaciones
├── utils/                     # Utilidades varias
│   ├── migrationHelper.ts      # Funciones de migración de datos
└── App.tsx                 # Componente principal con rutas
```

## 🎮 Funcionalidades Principales

### 1. 🍕 Simulador de Fracciones con Pizza
- Drag & drop interactivo de piezas de pizza
- Niveles de dificultad progresivos
- Feedback visual inmediato
- Persistencia del progreso en localStorage

### 2. 📘 Presentación Educativa Paso a Paso (Refactorizada)
- **Sistema de base de datos flexible** para gestión de contenido
- Sistema de diapositivas con animaciones Lottie
- **Administrador de presentaciones** con funcionalidades CRUD
- Modo presentador con notas
- Navegación fluida entre conceptos
- **Importación/Exportación** de presentaciones en formato JSON
- **Migración automática** de datos legacy
- **Estadísticas de uso** y progreso
- Ejemplos visuales prácticos

### 3. 🪜 Escalera de Fracciones
- Ordenamiento de fracciones por valor
- Tres niveles de dificultad (fácil, intermedio, difícil)
- Sistema de retroalimentación con efectos visuales
- Generación aleatoria de fracciones

### 4. 🛍️ Don Fracción - Simulador de Tienda
- Compra de productos usando fracciones
- Cálculo de precios con operaciones fraccionarias
- Gestión de inventario y descuentos
- 20 productos diferentes con iconos SVG
- Sistema de puntuación y niveles

## 🔧 Nueva Arquitectura del Sistema de Presentaciones

El sistema de presentaciones ha sido completamente refactorizado para ofrecer:

### Gestión Basada en Base de Datos
- **Servicio de persistencia** (`PresentationService`)
- **Tipos TypeScript** bien definidos para toda la estructura
- **Hook personalizado** (`usePresentation`) para gestión de estado
- **Migración automática** de datos existentes

### Funcionalidades Administrativas
- ✅ **Crear, editar y eliminar** presentaciones
- ✅ **Gestión de slides** individual
- ✅ **Importación/Exportación** en JSON
- ✅ **Duplicación** de presentaciones
- ✅ **Control de versiones** y estado de publicación
- ✅ **Estadísticas de uso** y progreso de estudiantes

### Flexibilidad de Contenido
- **Assets dinámicos**: Animaciones e imágenes gestionables
- **Metadatos ricos**: Categorías, dificultad, tags, notas
- **Configuración personalizable**: Temas, auto-avance, navegación
- **Modo presentador**: Notas y controles especiales

### Estructura de Datos
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
  // ... metadatos adicionales
}

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  steps: SlideStep[];
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  // ... configuración adicional
}
```

## 🏃‍♂️ Ejecución del Proyecto

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de la build
npm run preview

# Ejecutar linter
npm run lint
```

## 🎯 Rutas de la Aplicación

- `/` - Página de inicio con navegación principal
- `/pizza` - Simulador de fracciones con pizzas
- `/fracciones` - Presentación educativa paso a paso (con BD habilitada)
- `/escalera` - Juego de escalera de fracciones
- `/don-fraccion` - Simulador de tienda de fracciones
- `/admin/presentations` - **[NUEVO]** Administrador de presentaciones (requiere autenticación)

## 🔐 Sistema de Autenticación Administrativo

### Características de Seguridad
- **Autenticación simplificada** para acceso a herramientas administrativas
- **Control de permisos** granular por funcionalidad
- **Sesión persistente** en localStorage
- **Modo de desarrollo** con credenciales de prueba

### Credenciales de Desarrollo
- **Usuario**: Administrador
- **Contraseña**: `admin123`

### Funcionalidades Administrativas
- ✅ **Gestión completa de presentaciones**
- ✅ **Acceso rápido** desde cualquier página educativa
- ✅ **Navegación contextual** con breadcrumbs
- ✅ **Modo seguro** con autenticación requerida

## 🏗️ Arquitectura de la Aplicación Refactorizada

### Layout Inteligente
- **Layout responsivo** con navegación contextual
- **Acceso rápido a administración** en páginas educativas
- **Breadcrumbs automáticos** para rutas administrativas
- **Menú flotante** con herramientas de gestión

### Gestión de Estado Global
- **Hook de permisos** (`useAdminPermissions`)
- **Componente de autenticación** (`AdminAuth`)
- **Layout adaptativo** según permisos del usuario

### Rutas Protegidas
```typescript
// Rutas públicas (sin restricciones)
/ - Home
/pizza - Simulador Pizza
/fracciones - Presentaciones (BD habilitada)
/escalera - Escalera de Fracciones
/don-fraccion - Tienda Don Fracción

// Rutas administrativas (requieren autenticación)
/admin/presentations - Gestión de Presentaciones
```

## 🗂️ Archivos y Servicios Nuevos

### Servicios
- `src/services/presentationService.ts` - Servicio de gestión de presentaciones
- `src/hooks/usePresentation.ts` - Hook personalizado para presentaciones
- `src/utils/migrationHelper.ts` - Utilidades de migración de datos

### Tipos y Interfaces
- `src/types/presentation.ts` - Definiciones TypeScript completas

### Componentes de Autenticación y Seguridad
- `src/hooks/useAdminPermissions.ts` - Hook de gestión de permisos
- `src/components/Admin/AdminAuth.tsx` - Componente de autenticación
- `src/components/Layout.tsx` - Layout inteligente con navegación contextual

### Componentes Administrativos
- `src/components/Presentation/PresentationAdmin.tsx` - Panel administrativo
- `src/components/Presentation/DynamicAsset.tsx` - Carga dinámica de assets
- `src/pages/PresentationAdminPage.tsx` - Página del administrador

## 🎨 Características Técnicas

- **Responsive Design** con Tailwind CSS
- **TypeScript** para type safety
- **Drag & Drop** con react-dnd
- **Animaciones suaves** con Framer Motion
- **Persistencia de datos** con localStorage
- **Cálculos precisos** con Fraction.js
- **Efectos visuales** con confetti y Lottie

## 📦 Dependencias Principales

```json
{
  "canvas-confetti": "^1.9.3",
  "fraction.js": "^5.2.2",
  "framer-motion": "^12.18.1",
  "lodash": "^4.17.21",
  "lottie-react": "^2.4.1",
  "react": "^19.1.0",
  "react-dnd": "^16.0.1",
  "react-dom": "^19.1.0",
  "react-router-dom": "^7.6.2"
}
```
