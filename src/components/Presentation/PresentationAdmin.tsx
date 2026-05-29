import { useState, useEffect } from 'react';
import { presentationService } from '../../services/presentationService';
import { migrateLegacyData } from '../../utils/migrationHelper';
import type { Presentation, Slide } from '../../types/presentation';

export const PresentationAdmin = () => {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [selectedPresentation, setSelectedPresentation] = useState<Presentation | null>(null);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    loadPresentations();
  }, []);

  const loadPresentations = async () => {
    setLoading(true);
    try {
      const data = await presentationService.getAllPresentations();
      setPresentations(data);
      
      // Si no hay presentaciones, crear la presentación por defecto
      if (data.length === 0) {
        const defaultPresentation = migrateLegacyData();
        await presentationService.createPresentation(defaultPresentation);
        setPresentations([defaultPresentation]);
      }
    } catch (error) {
      setMessage('Error loading presentations: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createNewPresentation = async () => {
    const title = prompt('Título de la nueva presentación:');
    if (!title) return;

    try {
      const newPresentation: Omit<Presentation, 'id' | 'createdAt' | 'updatedAt'> = {
        title,
        description: 'Nueva presentación',
        slides: [],
        targetAudience: 'primaria',
        estimatedDuration: 30,
        isPublished: false,
        author: 'Usuario',
        version: '1.0.0',
      };

      await presentationService.createPresentation(newPresentation);
      await loadPresentations();
      setMessage('Presentación creada exitosamente');
    } catch (error) {
      setMessage('Error creating presentation: ' + (error as Error).message);
    }
  };

  const deletePresentation = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta presentación?')) return;

    try {
      await presentationService.deletePresentation(id);
      await loadPresentations();
      setSelectedPresentation(null);
      setMessage('Presentación eliminada exitosamente');
    } catch (error) {
      setMessage('Error deleting presentation: ' + (error as Error).message);
    }
  };

  const updatePresentationTitle = async (id: string, title: string) => {
    try {
      await presentationService.updatePresentation(id, { title });
      await loadPresentations();
      setMessage('Título actualizado exitosamente');
    } catch (error) {
      setMessage('Error updating title: ' + (error as Error).message);
    }
  };

  const addSlideToPresentation = async (presentationId: string) => {
    const title = prompt('Título del nuevo slide:');
    if (!title) return;

    try {
      const newSlide: Omit<Slide, 'id' | 'createdAt' | 'updatedAt'> = {
        title,
        subtitle: '',
        steps: [],
        category: 'general',
        difficulty: 'beginner',
        tags: [],
        isActive: true,
        order: selectedPresentation?.slides.length || 0 + 1,
      };

      await presentationService.addSlideToPresentation(presentationId, newSlide);
      await loadPresentations();
      setMessage('Slide agregado exitosamente');
    } catch (error) {
      setMessage('Error adding slide: ' + (error as Error).message);
    }
  };

  const duplicatePresentation = async (presentation: Presentation) => {
    try {
      const duplicatedPresentation: Omit<Presentation, 'id' | 'createdAt' | 'updatedAt'> = {
        ...presentation,
        title: `${presentation.title} (Copia)`,
        version: '1.0.0',
        isPublished: false,
      };

      await presentationService.createPresentation(duplicatedPresentation);
      await loadPresentations();
      setMessage('Presentación duplicada exitosamente');
    } catch (error) {
      setMessage('Error duplicating presentation: ' + (error as Error).message);
    }
  };

  const exportPresentation = (presentation: Presentation) => {
    const dataStr = JSON.stringify(presentation, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${presentation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importPresentation = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedPresentation = JSON.parse(text) as Presentation;
      
      // Limpiar campos que se generarán automáticamente
      const { id, createdAt, updatedAt, ...presentationData } = importedPresentation;
      
      await presentationService.createPresentation(presentationData);
      await loadPresentations();
      setMessage('Presentación importada exitosamente');
    } catch (error) {
      setMessage('Error importing presentation: ' + (error as Error).message);
    }
  };

  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Administrador de Presentaciones</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            {message}
          </div>
        )}

        <div className="flex gap-4 mb-4">
          <button
            onClick={createNewPresentation}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Nueva Presentación
          </button>
          
          <label className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
            Importar Presentación
            <input
              type="file"
              accept=".json"
              onChange={importPresentation}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Presentaciones */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Presentaciones</h2>
          <div className="space-y-2">
            {presentations.map((presentation) => (
              <div
                key={presentation.id}
                className={`p-3 border rounded cursor-pointer ${
                  selectedPresentation?.id === presentation.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setSelectedPresentation(presentation)}
              >
                <h3 className="font-medium">{presentation.title}</h3>
                <p className="text-sm text-gray-600">
                  {presentation.slides.length} slides • {presentation.estimatedDuration} min
                </p>
                <p className="text-xs text-gray-500">
                  {presentation.isPublished ? 'Publicada' : 'Borrador'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Detalles de Presentación */}
        {selectedPresentation && (
          <div className="lg:col-span-2">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {selectedPresentation.title}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => exportPresentation(selectedPresentation)}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                >
                  Exportar
                </button>
                <button
                  onClick={() => duplicatePresentation(selectedPresentation)}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Duplicar
                </button>
                <button
                  onClick={() => deletePresentation(selectedPresentation.id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>

            <div className="mb-4 p-4 border rounded">
              <h3 className="font-medium mb-2">Información General</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block font-medium">Título:</label>
                  <input
                    type="text"
                    value={selectedPresentation.title}
                    onChange={(e) => updatePresentationTitle(selectedPresentation.id, e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block font-medium">Audiencia:</label>
                  <span>{selectedPresentation.targetAudience}</span>
                </div>
                <div>
                  <label className="block font-medium">Duración estimada:</label>
                  <span>{selectedPresentation.estimatedDuration} minutos</span>
                </div>
                <div>
                  <label className="block font-medium">Estado:</label>
                  <span>{selectedPresentation.isPublished ? 'Publicada' : 'Borrador'}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Slides ({selectedPresentation.slides.length})</h3>
                <button
                  onClick={() => addSlideToPresentation(selectedPresentation.id)}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                >
                  Agregar Slide
                </button>
              </div>

              <div className="space-y-2">
                {selectedPresentation.slides.map((slide) => (
                  <div
                    key={slide.id}
                    className="p-3 border rounded hover:border-gray-400"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{slide.title}</h4>
                        {slide.subtitle && (
                          <p className="text-sm text-gray-600">{slide.subtitle}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {slide.steps.length} pasos • {slide.difficulty} • {slide.category}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingSlide(slide)}
                          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de edición de slide (simplificado) */}
      {editingSlide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Editando: {editingSlide.title}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Esta funcionalidad se puede expandir para editar el contenido completo del slide.
            </p>
            <button
              onClick={() => setEditingSlide(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
