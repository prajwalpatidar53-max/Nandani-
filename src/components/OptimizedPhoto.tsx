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
  const [attemptedFallback, setAttemptedFallback] = useState<boolean>(false);

  // Compute clean URL relative to current deployment base
  const resolveUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${cleanBase}${cleanPath}`;
  };

  const primaryUrl = resolveUrl(currentSrc);
  const fallbackUrl = fallbackSrc ? resolveUrl(fallbackSrc) : '';

  const handleError = () => {
    // If WebP fails, try the fallback JPG once
    if (!attemptedFallback && fallbackUrl && currentSrc !== fallbackSrc) {
      setAttemptedFallback(true);
      setCurrentSrc(fallbackSrc!);
    } else {
      setHasError(true);
    }
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasError(false);
    setAttemptedFallback(false);
    setCurrentSrc(`${src}?retry=${Date.now()}`);
  };

  return (
    <div
      className={`relative overflow-hidden w-full ${aspectRatioClass} bg-[#21132F] rounded-sm select-none ${containerClassName}`}
      onClick={onClick}
    >
      {/* 1. Instant Shimmering Lavender Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#2a173d] via-[#21132F] to-[#1a0e26] animate-pulse">
          {placeholder ? (
            <img
              src={placeholder}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 opacity-70"
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

      {/* 2. Responsive WebP Picture with Fallback */}
      {!hasError ? (
        <picture>
          {primaryUrl.endsWith('.webp') && (
            <source type="image/webp" srcSet={primaryUrl} />
          )}
          {fallbackUrl && fallbackUrl.endsWith('.jpg') && (
            <source type="image/jpeg" srcSet={fallbackUrl} />
          )}
          <img
            src={primaryUrl}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
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
