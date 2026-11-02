import React, { useState } from 'react';
import { PROMISES_DATA } from '../../data/universeData';
import { Sparkles, Heart, Shield, Check, Lock, Unlock } from 'lucide-react';
import { soundManager } from '../../utils/soundSynthesizer';
import confetti from 'canvas-confetti';

interface Chapter6Props {
  onNextChapter: () => void;
}

export const Chapter6Promises: React.FC<Chapter6Props> = ({ onNextChapter }) => {
  const [unlockedPromises, setUnlockedPromises] = useState<Set<number>>(new Set([1]));

  const handleUnlock = (id: number) => {
    soundManager.playSparkle();
    soundManager.playHeartPop();
    setUnlockedPromises((prev) => {
      const next = new Set(prev);
      next.add(id);
      if (next.size === PROMISES_DATA.length) {
        soundManager.playCelebrationChord();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            colors: ['#D8C7FF', '#F8DDF0', '#FFFFFF', '#9B7BD3'],
          });
        } catch {}
      }
      return next;
    });
  };

  return (
    <div className="relative min-h-[92vh] px-4 py-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D8C7FF]/30 text-xs text-[#D8C7FF] mb-4">
          <Shield className="w-3.5 h-3.5 text-[#F8DDF0]" />
          <span>Chapter 6 — Sacred Vows</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          Our Little Promises 💍
        </h2>
        <p className="font-sans text-sm md:text-base text-[#D8C7FF]/80 max-w-xl mx-auto">
          Promises made from the deepest corners of Prajjwal’s soul. Tap to unlock each vow.
        </p>

        {/* Counter */}
        <div className="mt-4 inline-flex items-center gap-2 text-xs font-serif text-[#D8C7FF] bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
          <Heart className="w-3.5 h-3.5 text-[#F8DDF0] fill-current" />
          <span>
            {unlockedPromises.size} of {PROMISES_DATA.length} Vows Sealed
          </span>
        </div>
      </div>

      {/* Grid of Promise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROMISES_DATA.map((promise) => {
          const isUnlocked = unlockedPromises.has(promise.id);
          return (
            <div
              key={promise.id}
              onClick={() => !isUnlocked && handleUnlock(promise.id)}
              className={`group relative rounded-3xl p-6 transition-all duration-500 border overflow-hidden flex flex-col justify-between cursor-pointer ${
                isUnlocked
                  ? 'bg-gradient-to-br from-[#2D1B4E]/90 via-[#21132F]/90 to-[#180D24]/90 border-[#D8C7FF] shadow-[0_10px_35px_rgba(216,199,255,0.25)] hover:scale-102'
                  : 'bg-[#21132F]/60 border-white/10 hover:border-[#D8C7FF]/40 hover:bg-[#21132F]/80'
              }`}
            >
              {/* Card top icon & badge */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-transform duration-300 ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-[#9B7BD3] to-[#D8C7FF] text-[#21132F] group-hover:scale-110'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {promise.icon}
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-serif font-semibold flex items-center gap-1.5 ${
                      isUnlocked
                        ? 'bg-[#9B7BD3]/30 text-[#F8DDF0] border border-[#D8C7FF]/40'
                        : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {isUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    <span>{isUnlocked ? 'Sealed' : 'Tap to Reveal'}</span>
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-white mb-3">
                  {promise.title}
                </h3>

                <p
                  className={`font-sans text-xs md:text-sm leading-relaxed transition-all duration-500 ${
                    isUnlocked
                      ? 'text-[#D8C7FF]/90 font-light'
                      : 'text-white/30 blur-xs select-none'
                  }`}
                >
                  {isUnlocked ? promise.description : 'This promise is waiting for your touch to reveal its eternal vow.'}
                </p>
              </div>

              {/* Bottom footer status */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="font-serif text-[#D8C7FF]/70">Promise #{promise.id}</span>
                {isUnlocked ? (
                  <span className="text-[#F8DDF0] font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> For Eternity
                  </span>
                ) : (
                  <span className="text-[#9B7BD3] group-hover:underline">Touch to seal 💍</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Next CTA */}
      <div className="mt-16 text-center">
        <button
          onClick={() => {
            soundManager.playSparkle();
            onNextChapter();
          }}
          className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#9B7BD3] via-[#D8C7FF] to-[#F8DDF0] text-[#21132F] font-serif font-bold text-base md:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <span>Continue to Chapter 7: The Surprise Boxes</span>
          <Sparkles className="w-5 h-5 text-[#21132F] group-hover:rotate-45 transition-transform" />
        </button>
      </div>
    </div>
  );
};
