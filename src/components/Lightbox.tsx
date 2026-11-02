import React, { useState, useEffect, useCallback } from 'react';
import { PhotoMemory } from '../types';
import { X, ChevronLeft, ChevronRight, RotateCw, ZoomIn, ZoomOut, Heart, Calendar } from 'lucide-react';
import { soundManager } from '../utils/soundSynthesizer';

interface LightboxProps {
  photos: PhotoMemory[];
  currentPhotoId: string | null;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ photos, currentPhotoId, onClose }) => {
  const currentIndex = photos.findIndex((p) => p.id === currentPhotoId);
  const currentPhoto = photos[currentIndex];

  const [rotation, setRotation] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Set default rotation from photo metadata when switching photos
  useEffect(() => {
    if (currentPhoto) {
      setRotation(currentPhoto.defaultRotation || 0);
      setIsZoomed(false);
    }
  }, [currentPhoto]);

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      soundManager.playSparkle();
      const nextPhoto = photos[currentIndex + 1];
      setRotation(nextPhoto.defaultRotation || 0);
      setIsZoomed(false);
      // We pass the new ID back through parent or we can dispatch
      onSelectPhoto(nextPhoto.id);
    }
  }, [currentIndex, photos]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      soundManager.playSparkle();
      const prevPhoto = photos[currentIndex - 1];
      setRotation(prevPhoto.defaultRotation || 0);
      setIsZoomed(false);
      onSelectPhoto(prevPhoto.id);
    }
  }, [currentIndex, photos]);

  const onSelectPhoto = (id: string) => {
    // update parent state by dispatching custom event or calling onClose with new target
    const evt = new CustomEvent('open-lightbox-photo', { detail: { id } });
    window.dispatchEvent(evt);
  };

  const handleRotate = () => {
    soundManager.playSparkle();
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomToggle = () => {
    soundManager.playSparkle();
    setIsZoomed((prev) => !prev);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  if (!currentPhoto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#12071E]/95 backdrop-blur-xl animate-fadeIn p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top action controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={handleRotate}
          className="p-2.5 rounded-full bg-white/10 text-[#D8C7FF] hover:bg-white/20 transition-all active:scale-95 shadow-lg backdrop-blur-sm"
          title="Rotate Image 90°"
          aria-label="Rotate image"
        >
          <RotateCw className="w-5 h-5" />
        </button>

        <button
          onClick={handleZoomToggle}
          className="p-2.5 rounded-full bg-white/10 text-[#D8C7FF] hover:bg-white/20 transition-all active:scale-95 shadow-lg backdrop-blur-sm"
          title={isZoomed ? 'Zoom Out' : 'Zoom In'}
          aria-label={isZoomed ? 'Zoom Out' : 'Zoom In'}
        >
          {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
        </button>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-red-500/20 text-[#F8DDF0] hover:bg-red-500/40 transition-all active:scale-95 shadow-lg backdrop-blur-sm ml-2"
          title="Close Lightbox (Esc)"
          aria-label="Close photo"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Prev button */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 transition-all shadow-xl backdrop-blur-sm hover:scale-110 active:scale-95"
          aria-label="Previous photograph"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {currentIndex < photos.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 transition-all shadow-xl backdrop-blur-sm hover:scale-110 active:scale-95"
          aria-label="Next photograph"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Image Container */}
      <div className="flex flex-col items-center justify-center max-w-4xl w-full max-h-[90vh]">
        <div className="relative overflow-hidden flex items-center justify-center max-h-[70vh] w-full p-2">
          <picture>
            {currentPhoto.fallbackSrc && (
              <source type="image/jpeg" srcSet={currentPhoto.fallbackSrc} />
            )}
            <img
              src={currentPhoto.webpSrc || currentPhoto.src}
              alt={currentPhoto.title}
              onError={(e) => {
                const target = e.currentTarget;
                if (currentPhoto.fallbackSrc && target.src !== currentPhoto.fallbackSrc) {
                  target.src = currentPhoto.fallbackSrc;
                }
              }}
              className={`max-h-[66vh] max-w-full object-contain rounded-xl shadow-[0_10px_40px_rgba(216,199,255,0.25)] border-2 border-white/20 transition-all duration-300 ease-out select-none ${
                isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
              }`}
              style={{
                transform: `rotate(${rotation}deg) scale(${isZoomed ? 1.4 : 1})`,
              }}
              onClick={handleZoomToggle}
            />
          </picture>
        </div>

        {/* Romantic Caption & Info Card */}
        <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-[#D8C7FF]/20 text-center max-w-xl w-full shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-[#D8C7FF] fill-[#9B7BD3]" />
            <h3 className="font-serif text-lg md:text-xl font-bold text-white tracking-wide">
              {currentPhoto.title}
            </h3>
            <Heart className="w-4 h-4 text-[#D8C7FF] fill-[#9B7BD3]" />
          </div>

          <p className="font-sans text-xs md:text-sm text-[#D8C7FF]/90 italic">
            "{currentPhoto.caption}"
          </p>

          <div className="flex items-center justify-between text-[11px] text-white/50 mt-3 pt-2 border-t border-white/10">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#D8C7FF]" />
              {currentPhoto.date}
            </span>
            <span className="bg-[#9B7BD3]/30 px-2.5 py-0.5 rounded-full text-[#F8DDF0]">
              {currentIndex + 1} of {photos.length} memories
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
