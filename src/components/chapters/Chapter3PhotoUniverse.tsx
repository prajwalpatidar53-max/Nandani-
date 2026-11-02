import React, { useState } from 'react';
import { UNIVERSE_PHOTOS } from '../../data/universeData';
import { Sparkles, Heart, Eye, Calendar, Tag, Layers, Clock, Star, Maximize2 } from 'lucide-react';
import { soundManager } from '../../utils/soundSynthesizer';
import { OptimizedPhoto } from '../OptimizedPhoto';

interface Chapter3Props {
  onPhotoClick: (photoId: string) => void;
  onNextChapter: () => void;
}

type GalleryViewMode = 'polaroid' | 'cards' | 'timeline' | 'favorites';

export const Chapter3PhotoUniverse: React.FC<Chapter3Props> = ({ onPhotoClick, onNextChapter }) => {
  const [viewMode, setViewMode] = useState<GalleryViewMode>('polaroid');
  const [revealedCaptions, setRevealedCaptions] = useState<Record<string, boolean>>({});

  const toggleCaption = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playSparkle();
    setRevealedCaptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePhotoSelect = (id: string) => {
    soundManager.playSparkle();
    onPhotoClick(id);
  };

  const favoritePhotos = UNIVERSE_PHOTOS.filter((p) => p.isFavorite);

  return (
    <div className="relative min-h-[92vh] px-4 py-16 max-w-6xl mx-auto">
      {/* Chapter Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D8C7FF]/30 text-xs text-[#D8C7FF] mb-4">
          <Heart className="w-3.5 h-3.5 text-[#F8DDF0] fill-current" />
          <span>Chapter 3 — Our Real Memories</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          Our Photo Universe 📸
        </h2>
        <p className="font-sans text-sm md:text-base text-[#D8C7FF]/80 max-w-xl mx-auto">
          Every picture tells the story of our love. Tap any photograph to open full-screen with
          high-resolution zoom and rotate controls.
        </p>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {[
            { id: 'polaroid', label: 'Floating Polaroids', icon: <Layers className="w-4 h-4" /> },
            { id: 'cards', label: 'Interactive Cards', icon: <Eye className="w-4 h-4" /> },
            { id: 'timeline', label: 'Memory Timeline', icon: <Clock className="w-4 h-4" /> },
            { id: 'favorites', label: 'Special Highlights', icon: <Star className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playSparkle();
                setViewMode(tab.id as GalleryViewMode);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs md:text-sm font-medium transition-all ${
                viewMode === tab.id
                  ? 'bg-gradient-to-r from-[#9B7BD3] to-[#D8C7FF] text-[#21132F] font-bold shadow-lg scale-105'
                  : 'bg-white/10 hover:bg-white/15 text-[#D8C7FF] border border-white/10'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* VIEW A: Floating Polaroid Gallery */}
      {viewMode === 'polaroid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
          {UNIVERSE_PHOTOS.map((photo, index) => {
            // Apply slight natural polaroid tilts
            const rotations = [-3, 2, -2, 4, -4, 3, -1, 2, -3, 1, -2, 3, -1];
            const rot = rotations[index % rotations.length];

            return (
              <div
                key={photo.id}
                onClick={() => handlePhotoSelect(photo.id)}
                className="group relative cursor-pointer bg-white p-3 pb-6 rounded-sm shadow-[0_10px_25px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-[0_20px_40px_rgba(216,199,255,0.4)]"
                style={{ transform: `rotate(${rot}deg)` }}
              >
                {/* Tape graphic top center */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/40 backdrop-blur-xs border border-white/60 shadow-xs rotate-[-2deg]" />

                {/* Photo container with progressive loading */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#21132F] rounded-xs mb-3 flex items-center justify-center">
                  <OptimizedPhoto
                    src={photo.webpSrc || photo.src}
                    fallbackSrc={photo.fallbackSrc}
                    placeholder={photo.placeholder}
                    alt={photo.title}
                    priority={index < 3}
                    aspectRatioClass="aspect-[4/5]"
                    className="transition-transform duration-500 group-hover:scale-105"
                    style={{
                      transform: photo.defaultRotation
                        ? `rotate(${photo.defaultRotation}deg)`
                        : undefined,
                    }}
                  />

                  {/* Hover view overlay */}
                  <div className="absolute inset-0 bg-[#21132F]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white">
                      <Maximize2 className="w-5 h-5" />
                    </span>
                  </div>
                </div>

                {/* Polaroid handwritten caption */}
                <p className="font-handwriting text-lg text-[#21132F] text-center font-bold truncate">
                  {photo.title}
                </p>
                <p className="text-[11px] font-sans text-gray-500 text-center flex items-center justify-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-[#9B7BD3]" />
                  <span>{photo.date}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW B: Interactive Memory Cards */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {UNIVERSE_PHOTOS.map((photo, index) => {
            const isRevealed = !!revealedCaptions[photo.id];
            return (
              <div
                key={photo.id}
                onClick={() => handlePhotoSelect(photo.id)}
                className="group relative cursor-pointer backdrop-blur-xl bg-[#21132F]/80 border border-[#D8C7FF]/30 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:border-[#D8C7FF] hover:shadow-[0_12px_36px_rgba(155,123,211,0.3)] flex flex-col"
              >
                {/* Photo section */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40 flex items-center justify-center">
                  <OptimizedPhoto
                    src={photo.webpSrc || photo.src}
                    fallbackSrc={photo.fallbackSrc}
                    placeholder={photo.placeholder}
                    alt={photo.title}
                    priority={index < 2}
                    aspectRatioClass="aspect-[4/3]"
                    className="group-hover:scale-105 transition-transform duration-500"
                    style={{
                      transform: photo.defaultRotation
                        ? `rotate(${photo.defaultRotation}deg)`
                        : undefined,
                    }}
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-[#D8C7FF] flex items-center gap-1 pointer-events-none">
                    <Tag className="w-3 h-3" />
                    {photo.tag}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white mb-1 flex items-center justify-between">
                      <span>{photo.title}</span>
                      <Heart className="w-4 h-4 text-[#F8DDF0] fill-[#9B7BD3]" />
                    </h3>
                    <p className="text-xs text-[#D8C7FF]/70 mb-3 flex items-center gap-1 font-sans">
                      <Calendar className="w-3.5 h-3.5 text-[#9B7BD3]" />
                      {photo.date}
                    </p>

                    {/* Expandable Caption */}
                    <div
                      className={`text-xs text-white/90 bg-white/5 rounded-xl p-3 border border-white/10 transition-all ${
                        isRevealed ? 'block' : 'line-clamp-2'
                      }`}
                    >
                      "{photo.caption}"
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={(e) => toggleCaption(photo.id, e)}
                      className="text-xs text-[#D8C7FF] hover:underline"
                    >
                      {isRevealed ? 'Collapse Note' : 'Read Full Note'}
                    </button>
                    <span className="text-xs text-white/60 flex items-center gap-1 group-hover:text-white transition-colors">
                      <Maximize2 className="w-3.5 h-3.5" /> Enlarge
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW C: Memory Timeline */}
      {viewMode === 'timeline' && (
        <div className="relative border-l-2 border-[#D8C7FF]/40 ml-4 md:ml-32 pl-6 md:pl-10 space-y-12">
          {UNIVERSE_PHOTOS.map((photo, idx) => (
            <div key={photo.id} className="relative group">
              {/* Timeline circle icon */}
              <div className="absolute -left-[35px] md:-left-[51px] top-4 w-7 h-7 rounded-full bg-[#9B7BD3] border-2 border-white flex items-center justify-center text-[10px] text-white shadow-[0_0_15px_#9B7BD3]">
                <Heart className="w-3.5 h-3.5 fill-current" />
              </div>

              {/* Date banner */}
              <div className="md:absolute md:-left-36 md:top-4 text-xs font-serif font-bold text-[#D8C7FF] mb-2 md:mb-0">
                {photo.date}
              </div>

              {/* Memory Card */}
              <div
                onClick={() => handlePhotoSelect(photo.id)}
                className="cursor-pointer max-w-xl backdrop-blur-xl bg-[#21132F]/80 border border-[#D8C7FF]/30 rounded-2xl p-4 shadow-xl hover:scale-102 hover:border-[#D8C7FF] transition-all"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-36 h-36 shrink-0 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                    <OptimizedPhoto
                      src={photo.webpSrc || photo.src}
                      fallbackSrc={photo.fallbackSrc}
                      placeholder={photo.placeholder}
                      alt={photo.title}
                      aspectRatioClass="w-full sm:w-36 h-36"
                      containerClassName="rounded-xl"
                      className="group-hover:scale-105 transition-transform"
                      style={{
                        transform: photo.defaultRotation
                          ? `rotate(${photo.defaultRotation}deg)`
                          : undefined,
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-white mb-1">
                      {photo.title}
                    </h4>
                    <p className="font-sans text-xs text-[#D8C7FF]/90 mb-2 italic">
                      "{photo.caption}"
                    </p>
                    <span className="text-[11px] text-[#F8DDF0] bg-white/10 px-2 py-0.5 rounded-full">
                      Step #{idx + 1} in our journey
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW D: Favorites / Special Highlights */}
      {viewMode === 'favorites' && (
        <div>
          <div className="text-center mb-6">
            <h3 className="font-serif text-xl font-bold text-white flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
              <span>Special Moments Closest to Prajjwal's Heart</span>
              <Star className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
            </h3>
            <p className="text-xs text-[#D8C7FF]/70 mt-1">
              Photographs where your light shines brightest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritePhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => handlePhotoSelect(photo.id)}
                className="group cursor-pointer relative rounded-3xl overflow-hidden border-2 border-[#D8C7FF] shadow-[0_10px_35px_rgba(216,199,255,0.3)] bg-[#21132F]"
              >
                <div className="aspect-[3/4] w-full overflow-hidden relative flex items-center justify-center">
                  <OptimizedPhoto
                    src={photo.webpSrc || photo.src}
                    fallbackSrc={photo.fallbackSrc}
                    placeholder={photo.placeholder}
                    alt={photo.title}
                    priority={index < 2}
                    aspectRatioClass="aspect-[3/4]"
                    className="group-hover:scale-110 transition-transform duration-700"
                    style={{
                      transform: photo.defaultRotation
                        ? `rotate(${photo.defaultRotation}deg)`
                        : undefined,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#21132F] via-[#21132F]/30 to-transparent flex flex-col justify-end p-5 pointer-events-none">
                    <span className="text-xs text-[#FFD700] font-semibold flex items-center gap-1 mb-1">
                      <Star className="w-3.5 h-3.5 fill-current" /> Favorite Memory
                    </span>
                    <h4 className="font-serif text-lg font-bold text-white">{photo.title}</h4>
                    <p className="font-sans text-xs text-[#D8C7FF]/90 line-clamp-2 mt-1 italic">
                      "{photo.caption}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Chapter CTA Button */}
      <div className="mt-16 text-center">
        <button
          onClick={() => {
            soundManager.playSparkle();
            onNextChapter();
          }}
          className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#9B7BD3] via-[#D8C7FF] to-[#F8DDF0] text-[#21132F] font-serif font-bold text-base md:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <span>Continue to Chapter 4: A Letter For You</span>
          <Sparkles className="w-5 h-5 text-[#21132F] group-hover:rotate-45 transition-transform" />
        </button>
      </div>
    </div>
  );
};
