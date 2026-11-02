import React from 'react';
import { UNIVERSE_PHOTOS } from '../../data/universeData';
import { Sparkles, Heart, RotateCcw, Share2, Compass } from 'lucide-react';
import { soundManager } from '../../utils/soundSynthesizer';
import { VirtualGuestbook } from '../VirtualGuestbook';
import confetti from 'canvas-confetti';

interface Chapter9Props {
  onPhotoClick: (photoId: string) => void;
  onRestart: () => void;
  onOpenMap: () => void;
}

export const Chapter9FinalUniverse: React.FC<Chapter9Props> = ({
  onPhotoClick,
  onRestart,
  onOpenMap,
}) => {
  const triggerCelebration = () => {
    soundManager.playCelebrationChord();
    try {
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#D8C7FF', '#F8DDF0', '#9B7BD3', '#FFFFFF', '#FFD700'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch {}
  };

  return (
    <div className="relative min-h-[92vh] px-4 py-16 max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
      {/* Floating Memory Orbits */}
      <div className="relative mb-8 w-full max-w-xl mx-auto flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          {/* Center glowing heart sphere */}
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-[#9B7BD3] via-[#D8C7FF] to-[#F8DDF0] flex items-center justify-center shadow-[0_0_80px_rgba(216,199,255,0.7)] animate-pulse">
            <Heart className="w-14 h-14 md:w-18 md:h-18 text-[#21132F] fill-[#21132F]" />
          </div>

          {/* Floating real mini photos orbiting around */}
          {UNIVERSE_PHOTOS.slice(0, 6).map((photo, i) => {
            const angle = (i * 360) / 6;
            const rad = (angle * Math.PI) / 180;
            const dist = 140; // radius
            const x = Math.cos(rad) * dist;
            const y = Math.sin(rad) * dist;

            return (
              <div
                key={photo.id}
                onClick={() => onPhotoClick(photo.id)}
                className="hidden sm:block absolute cursor-pointer rounded-full overflow-hidden border-2 border-white shadow-lg transition-transform hover:scale-125 hover:z-30 w-14 h-14"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                title={photo.title}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                  style={{
                    transform: photo.defaultRotation ? `rotate(${photo.defaultRotation}deg)` : undefined,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Closing Title */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D8C7FF]/30 text-xs text-[#D8C7FF] mb-4">
        <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
        <span>Chapter 9 — Infinite & Everlasting</span>
        <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
      </div>

      <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D8C7FF] to-[#F8DDF0] mb-4 tracking-tight">
        You Are My Universe, Nandani 💜
      </h2>

      <p className="font-handwriting text-2xl sm:text-3xl md:text-4xl text-[#F8DDF0] max-w-2xl mx-auto leading-relaxed mb-6">
        "May this birthday bring as much light, peace, and pure joy into your life as your very existence has brought into mine."
      </p>

      {/* Love Pledge Card */}
      <div className="backdrop-blur-xl bg-[#21132F]/80 border border-[#D8C7FF]/40 rounded-3xl p-6 md:p-8 max-w-xl mx-auto mb-10 shadow-2xl text-left">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">💫</span>
          <div>
            <h4 className="font-serif text-base font-bold text-white">Forever & Always</h4>
            <p className="text-xs text-[#D8C7FF]/70">Prajjwal's Vow to Nandani</p>
          </div>
        </div>
        <p className="font-sans text-xs md:text-sm text-[#D8C7FF]/90 font-light leading-relaxed">
          Wherever life takes us, through every triumph, every quiet morning, every celebration, and every challenge, my hand will always be reaching for yours. Happy Birthday to the most extraordinary girl in this galaxy.
        </p>
      </div>

      {/* Virtual Guestbook Component with Floating Wishes */}
      <VirtualGuestbook />

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={triggerCelebration}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#9B7BD3] via-[#D8C7FF] to-[#F8DDF0] text-[#21132F] font-serif font-bold text-base shadow-[0_10px_35px_rgba(216,199,255,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-[#21132F]" />
          <span>Shower Starlight & Confetti 🎆</span>
        </button>

        <button
          onClick={onRestart}
          className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-[#D8C7FF] font-serif font-semibold text-sm border border-white/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Experience Our Story Again</span>
        </button>

        <button
          onClick={onOpenMap}
          className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-[#F8DDF0] font-serif font-semibold text-sm border border-white/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Compass className="w-4 h-4" />
          <span>Jump to Any Chapter</span>
        </button>
      </div>
    </div>
  );
};
