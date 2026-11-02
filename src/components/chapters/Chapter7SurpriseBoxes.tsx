import React, { useState } from 'react';
import { SURPRISE_BOXES } from '../../data/universeData';
import { GiftBoxItem } from '../../types';
import { areAllGiftsOpened } from '../../utils/universeLogic';
import { Sparkles, Heart, Gift, X, CheckCircle, Ticket } from 'lucide-react';
import { soundManager } from '../../utils/soundSynthesizer';
import confetti from 'canvas-confetti';

interface Chapter7Props {
  onPhotoClick: (photoId: string) => void;
  onNextChapter: () => void;
}

export const Chapter7SurpriseBoxes: React.FC<Chapter7Props> = ({ onPhotoClick, onNextChapter }) => {
  const [openedBoxIds, setOpenedBoxIds] = useState<Set<number>>(new Set());
  const [activeBoxModal, setActiveBoxModal] = useState<GiftBoxItem | null>(null);

  const handleOpenBox = (box: GiftBoxItem) => {
    soundManager.playSparkle();
    soundManager.playHeartPop();

    setOpenedBoxIds((prev) => {
      const next = new Set(prev);
      next.add(box.id);
      if (areAllGiftsOpened(next, SURPRISE_BOXES.length)) {
        setTimeout(() => {
          soundManager.playCelebrationChord();
          try {
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#D8C7FF', '#9B7BD3', '#F8DDF0', '#FFD700'],
            });
          } catch {}
        }, 300);
      }
      return next;
    });

    setActiveBoxModal(box);
  };

  return (
    <div className="relative min-h-[92vh] px-4 py-16 max-w-5xl mx-auto">
      {/* Chapter header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D8C7FF]/30 text-xs text-[#D8C7FF] mb-4">
          <Gift className="w-3.5 h-3.5 text-[#F8DDF0]" />
          <span>Chapter 7 — Unfold The Magic</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          The 5 Surprise Boxes 🎁
        </h2>
        <p className="font-sans text-sm md:text-base text-[#D8C7FF]/80 max-w-xl mx-auto">
          Five wrapped presents crafted specially for your birthday. Tap each mystery box to unwrap
          its contents.
        </p>

        {/* Counter */}
        <div className="mt-4 inline-flex items-center gap-2 text-xs font-serif text-[#D8C7FF] bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
          <Heart className="w-3.5 h-3.5 text-[#F8DDF0] fill-current" />
          <span>
            {openedBoxIds.size} of {SURPRISE_BOXES.length} Surprises Unwrapped
          </span>
        </div>
      </div>

      {/* Grid of 5 Surprise Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SURPRISE_BOXES.map((box) => {
          const isOpened = openedBoxIds.has(box.id);
          return (
            <div
              key={box.id}
              onClick={() => handleOpenBox(box)}
              className={`group cursor-pointer rounded-3xl p-6 transition-all duration-300 border flex flex-col items-center text-center relative overflow-hidden ${
                isOpened
                  ? 'bg-gradient-to-b from-[#2D1B4E]/90 to-[#180D24]/90 border-[#D8C7FF] shadow-[0_10px_30px_rgba(216,199,255,0.2)]'
                  : 'bg-[#21132F]/70 border-white/10 hover:border-[#D8C7FF]/60 hover:scale-105 shadow-xl'
              }`}
            >
              {/* Ribbon graphic on top of box */}
              <div className="relative mb-6">
                <div
                  className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl shadow-lg transition-transform duration-500 ${
                    isOpened
                      ? 'bg-gradient-to-tr from-[#9B7BD3] to-[#D8C7FF] text-[#21132F] rotate-12 scale-105'
                      : 'bg-[#49306D] text-[#D8C7FF] group-hover:scale-110 group-hover:rotate-[-6deg]'
                  }`}
                >
                  {isOpened ? box.icon : '🎁'}
                </div>
                {/* Ribbon Bow */}
                {!isOpened && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-[#F8DDF0] rounded-full shadow-md animate-pulse" />
                )}
              </div>

              <span className="text-[10px] uppercase font-serif tracking-widest text-[#D8C7FF]/70 mb-1">
                Surprise #{box.id}
              </span>
              <h3 className="font-serif text-lg font-bold text-white mb-2">{box.title}</h3>

              <p className="text-xs text-[#D8C7FF]/80 font-sans line-clamp-2">
                {isOpened ? box.content : 'Tap to unwrap this ribbon and discover what lies inside.'}
              </p>

              <div className="mt-5 pt-3 border-t border-white/10 w-full flex items-center justify-between text-xs">
                <span className="text-[#D8C7FF]/60">{box.ribbonColor}</span>
                {isOpened ? (
                  <span className="text-[#F8DDF0] font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Opened
                  </span>
                ) : (
                  <span className="text-[#D8C7FF] group-hover:underline flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Unwrap Box
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Popup for Unwrapped Surprise */}
      {activeBoxModal && (
        <div
          className="fixed inset-0 z-50 bg-[#12071E]/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveBoxModal(null)}
        >
          <div
            className="bg-gradient-to-b from-[#2D1B4E] to-[#180D24] border-2 border-[#D8C7FF] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveBoxModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#9B7BD3] to-[#D8C7FF] text-[#21132F] flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg animate-bounce">
              {activeBoxModal.icon}
            </div>

            <span className="text-xs uppercase font-serif tracking-widest text-[#D8C7FF] mb-1 inline-block">
              Surprise #{activeBoxModal.id} Unwrapped!
            </span>

            <h3 className="font-serif text-2xl font-bold text-white mb-4">
              {activeBoxModal.title}
            </h3>

            {/* Special content styling depending on box type */}
            {activeBoxModal.type === 'coupon' ? (
              <div className="p-4 rounded-2xl border-2 border-dashed border-[#D8C7FF] bg-[#21132F]/80 my-4 text-left">
                <div className="flex items-center gap-2 mb-2 text-[#F8DDF0]">
                  <Ticket className="w-5 h-5" />
                  <span className="font-serif font-bold text-sm tracking-wider uppercase">
                    Golden Lifetime Love Pass
                  </span>
                </div>
                <p className="font-handwriting text-xl text-white mb-3">
                  "{activeBoxModal.content}"
                </p>
                <div className="text-[11px] text-[#D8C7FF]/70 flex justify-between border-t border-white/10 pt-2 font-sans">
                  <span>Issued to: Nandani</span>
                  <span>Issued by: Prajjwal</span>
                  <span>Expiry: Never</span>
                </div>
              </div>
            ) : activeBoxModal.type === 'photo' && activeBoxModal.photoTargetId ? (
              <div>
                <p className="font-handwriting text-2xl text-[#F8DDF0] mb-4">
                  "{activeBoxModal.content}"
                </p>
                <button
                  onClick={() => {
                    setActiveBoxModal(null);
                    if (activeBoxModal.photoTargetId) onPhotoClick(activeBoxModal.photoTargetId);
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#9B7BD3] to-[#D8C7FF] text-[#21132F] text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>View Special Photo Fullscreen 📸</span>
                </button>
              </div>
            ) : (
              <p className="font-handwriting text-2xl md:text-3xl text-[#F8DDF0] leading-relaxed my-4">
                "{activeBoxModal.content}"
              </p>
            )}

            <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-[#D8C7FF]/70 mt-4">
              <Heart className="w-4 h-4 text-[#9B7BD3] fill-current" />
              <span>Happy Birthday, my favorite person 💜</span>
            </div>
          </div>
        </div>
      )}

      {/* Next CTA */}
      <div className="mt-16 text-center">
        <button
          onClick={() => {
            soundManager.playSparkle();
            onNextChapter();
          }}
          className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#9B7BD3] via-[#D8C7FF] to-[#F8DDF0] text-[#21132F] font-serif font-bold text-base md:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <span>Continue to Chapter 8: The Memory Game</span>
          <Sparkles className="w-5 h-5 text-[#21132F] group-hover:rotate-45 transition-transform" />
        </button>
      </div>
    </div>
  );
};
