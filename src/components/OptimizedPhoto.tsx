import React, { useState } from 'react';
import { Heart, RefreshCw, Sparkles } from 'lucide-react';

interface OptimizedPhotoProps {
  src: string;
  fallbackSrc?: string;
  placeholder?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  aspectRatioClass?: string;
  onClick?: () => void;
}

export const OptimizedPhoto: React.FC<OptimizedPhotoProps> = ({
  src,
  fallbackSrc,
  placeholder,
  alt,
  className = '',
  containerClassName = '',
  style,
  priority = false,
  aspectRatioClass = 'aspect-[4/5]',
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [fallbackAttempt, setFallbackAttempt] = useState<number>(0);

  // Extract base file name in case secondary fallbacks are needed
  const extractFilename = (url: string) => {
    try {
      const clean = url.split('?')[0].split('#')[0];
      const parts = clean.split('/');
      const last = parts[parts.length - 1];
      return last.replace(/\.(webp|jpg|jpeg|png)$/i, '');
    } catch {
      return '';
    }
  };

  const handleError = () => {
    const baseName = extractFilename(src);
    if (fallbackAttempt === 0 && fallbackSrc && currentSrc !== fallbackSrc) {
      setFallbackAttempt(1);
      setCurrentSrc(fallbackSrc);
    } else if (fallbackAttempt <= 1 && baseName) {
      setFallbackAttempt(2);
      // Secondary fallback to public/assets/photos JPG
      setCurrentSrc(`/assets/photos/${baseName}.jpg`);
    } else if (fallbackAttempt <= 2 && baseName) {
      setFallbackAttempt(3);
      // Tertiary fallback to public/assets/aistudio JPG
      setCurrentSrc(`/assets/aistudio/${baseName}.jpg`);
    } else {
      setHasError(true);
    }
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasError(false);
    setFallbackAttempt(0);
    setIsLoaded(false);
    setCurrentSrc(`${src}?t=${Date.now()}`);
  };

  return (
    <div
      className={`relative overflow-hidden w-full ${aspectRatioClass} bg-[#21132F] rounded-sm select-none ${containerClassName}`}
      onClick={onClick}
    >
      {/* 1. Instant Shimmering Lavender Placeholder / Micro Blur preview */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#2a173d] via-[#21132F] to-[#1a0e26]">
          {placeholder ? (
            <img
              src={placeholder}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-70"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-[#D8C7FF]/40">
              <Heart className="w-6 h-6 animate-pulse text-[#9B7BD3]" />
              <span className="text-[10px] tracking-wider uppercase font-sans text-[#D8C7FF]/60">
                Loading...
              </span>
            </div>
          )}
          {/* Shimmer light bar across placeholder */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      )}

      {/* 2. Responsive Image with smooth fade-in */}
      {!hasError ? (
        <picture>
          {fallbackSrc && fallbackSrc.endsWith('.webp') && (
            <source type="image/webp" srcSet={fallbackSrc} />
          )}
          <img
            src={currentSrc}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={() => setIsLoaded(true)}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            style={style}
          />
        </picture>
      ) : (
        /* 3. Graceful Romantic Fallback Card on Connection Error */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-[#21132F]/95 border border-[#D8C7FF]/30 rounded-sm">
          <Sparkles className="w-5 h-5 text-[#FFD700] mb-2 animate-bounce" />
          <p className="text-xs text-[#F8DDF0] font-serif font-medium line-clamp-2 mb-2">
            {alt}
          </p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#9B7BD3]/30 hover:bg-[#9B7BD3]/50 text-[#D8C7FF] text-[11px] font-sans transition-all active:scale-95 border border-[#D8C7FF]/30 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reload Photo</span>
          </button>
        </div>
      )}
    </div>
  );
};
