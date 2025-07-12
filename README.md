# 🎓 EstalMat Fracciones - Plataforma Educativa

Una plataforma educativa interactiva diseñada para enseñar fracciones de manera visual y práctica a través de múltiples actividades gamificadas.

## 📋 Características del Proyecto

### 🎯 Propósito Educativo
Esta plataforma tiene como objetivo facilitar el aprendizaje de fracciones mediante experiencias interactivas que permiten a los estudiantes:
- Visualizar conceptos abstractos de fracciones
- Practicar operaciones con fracciones de forma intuitiva
- Desarrollar comprensión conceptual a través del juego
- Aplicar conocimientos en contextos cotidianos

### 🎮 Actividades Disponibles

#### 🍕 Simulador de Fracciones con Pizza
- Representación visual de fracciones usando porciones de pizza
- Sistema de arrastrar y soltar para combinar fracciones
- Retroalimentación inmediata y seguimiento de progreso
- Desafíos progresivos de dificultad creciente

#### 📘 Aprende Fracciones Paso a Paso
- Presentación estructurada de conceptos de fracciones
- Animaciones explicativas usando Lottie
- Progresión didáctica desde conceptos básicos hasta avanzados

#### 🪜 Escalera de Fracciones
- Juego de ordenamiento de fracciones
- Interfaz de arrastrar y soltar
- Validación automática de respuestas
- Efectos visuales de celebración

#### 🛍️ Don Fracción - Tienda Virtual
- Simulación de compras usando fracciones
- Cálculo de precios y cantidades fraccionarias
- Aplicación práctica de operaciones con fracciones
- Gestión de descuentos y cálculos comerciales

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19.1.0** - Biblioteca principal de UI
- **TypeScript** - Tipado estático para mayor robustez
- **Vite** - Herramienta de build rápida y moderna
- **React Router Dom** - Navegación entre páginas

### Estilos y Animaciones
- **Tailwind CSS** - Framework de CSS utilitario
- **Framer Motion** - Animaciones fluidas
- **Lottie React** - Animaciones vectoriales complejas
- **Canvas Confetti** - Efectos de celebración

### Funcionalidades Interactivas
- **React DnD** - Sistema de arrastrar y soltar
- **Fraction.js** - Manejo preciso de operaciones con fracciones
- **Lodash** - Utilidades para manipulación de datos

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Compatibilidad de CSS

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/jpcuencat/tienda-don-fraccion.git

# Navegar al directorio del proyecto
cd tienda-don-fraccion

# Instalar dependencias
npm install
```

### Comandos Disponibles
```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de la build
npm run preview

# Ejecutar linter
npm run lint
```

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── DonFraccion/     # Componentes del juego de tienda
│   ├── Presentation/    # Componentes de presentación educativa
│   ├── SimulatorPizza/  # Componentes del simulador de pizza
│   └── Staircase/       # Componentes de la escalera de fracciones
├── pages/               # Páginas principales de la aplicación
├── assets/              # Recursos estáticos (imágenes, CSS, animaciones)
└── main.tsx            # Punto de entrada de la aplicación
```

## 🎓 Objetivos Pedagógicos

- **Comprensión Visual**: Representar fracciones de manera gráfica y tangible
- **Aprendizaje Interactivo**: Participación activa del estudiante en el proceso
- **Aplicación Práctica**: Conexión con situaciones de la vida real
- **Retroalimentación Inmediata**: Validación instantánea del aprendizaje
- **Progresión Adaptativa**: Dificultad incremental según el avance

## 🤝 Contribuciones

Este proyecto está diseñado para ser extensible. Se pueden agregar nuevas actividades, mejorar las existentes o implementar funcionalidades adicionales siguiendo la arquitectura establecida.

## 📄 Licencia

Proyecto educativo desarrollado con fines pedagógicos.
