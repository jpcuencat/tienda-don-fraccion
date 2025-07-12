import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { presentationService } from '../services/presentationService';
import type { AnimationAsset, ImageAsset } from '../types/presentation';

interface DynamicAssetProps {
  animationId?: string;
  imageId?: string;
  fallback?: React.ReactNode;
  className?: string;
  alt?: string;
}

export const DynamicAsset: React.FC<DynamicAssetProps> = ({
  animationId,
  imageId,
  fallback,
  className = "w-40 h-40",
  alt = "Asset"
}) => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [imageAsset, setImageAsset] = useState<ImageAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAsset = async () => {
      if (!animationId && !imageId) return;

      setLoading(true);
      setError(null);

      try {
        if (animationId) {
          const asset = await presentationService.getAnimationById(animationId);
          if (asset) {
            // Cargar la animación dinámicamente
            const response = await import(`../components/Presentation/${asset.filePath}`);
            setAnimationData(response.default);
          } else {
            setError('Animation not found');
          }
        }

        if (imageId) {
          const asset = await presentationService.getImageById(imageId);
          if (asset) {
            setImageAsset(asset);
          } else {
            setError('Image not found');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading asset');
      } finally {
        setLoading(false);
      }
    };

    loadAsset();
  }, [animationId, imageId]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-200 rounded-lg`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      fallback || (
        <div className={`${className} flex items-center justify-center bg-red-100 rounded-lg text-red-600 text-sm`}>
          Error: {error}
        </div>
      )
    );
  }

  if (animationData) {
    return (
      <div className={className}>
        <Lottie 
          animationData={animationData} 
          loop 
          autoplay 
        />
      </div>
    );
  }

  if (imageAsset) {
    return (
      <img
        src={imageAsset.filePath}
        alt={imageAsset.alt || alt}
        className={`${className} object-contain rounded-lg shadow-lg`}
      />
    );
  }

  return fallback || null;
};
