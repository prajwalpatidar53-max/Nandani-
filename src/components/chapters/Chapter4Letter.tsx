import React, { useState, useEffect } from 'react';
import { LETTER_DATA } from '../../data/universeData';
import { Sparkles, Heart, Feather, Check, Play, Pause } from 'lucide-react';
import { soundManager } from '../../utils/soundSynthesizer';

interface Chapter4Props {
  onNextChapter: () => void;
}

export const Chapter4Letter: React.FC<Chapter4Props> = ({ onNextChapter }) => {
  const [visibleLineCount, setVisibleLineCount] = useState<number>(2);
  const [isAutoRevealing, setIsAutoRevealing] = useState<boolean>(true);
  const [isSealed, setIsSealed] = useState<boolean>(false);

  // Line-by-line reveal timer
  useEffect(() => {
    if (!isAutoRevealing || visibleLineCount >= LETTER_DATA.paragraphs.length) return;

    const timer = setTimeout(() => {
      setVisibleLineCount((prev) => prev + 1);
      soundManager.playSparkle();
    }, 1400);

    return () => clearTimeout(timer);
  }, [visibleLineCount, isAutoRevealing]);

  const handleSealWithLove = () => {
    soundManager.playHeartPop();
    setIsSealed(true);
  };

  const handleRevealAll = () => {
    soundManager.playSparkle();
    setVisibleLineCount(LETTER_DATA.paragraphs.length);
    setIsAutoRevealing(false);
  };

  return (
    <div className="relative min-h-[92vh] px-4 py-16 max-w-4xl mx-auto flex flex-col items-center justify-center">
      {/* Chapter Tag */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D8C7FF]/30 text-xs text-[#D8C7FF] mb-4">
        <Feather className="w-3.5 h-3.5 text-[#F8DDF0]" />
        <span>Chapter 4 — Handwritten With Love</span>
      </div>

      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-8 tracking-tight">
        A Little Letter For You 💌
      </h2>

      {/* Romantic Parchment Container */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#FAF5FF] via-[#F5EDFF] to-[#EDE4FA] rounded-3xl p-8 md:p-12 shadow-[0_20px_60px_rgba(33,19,47,0.6)] border-4 border-[#D8C7FF]/60 text-[#21132F] overflow-hidden select-text">
        {/* Soft watermark heart */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <Heart className="w-96 h-96 fill-[#9B7BD3]" />
        </div>

        {/* Vintage Letter Header */}
        <div className="flex items-center justify-between border-b border-[#9B7BD3]/30 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌸</span>
            <span className="font-serif text-xs md:text-sm text-[#49306D] font-bold tracking-widest uppercase">
              To My Beloved Nandani
            </span>
          </div>
          <span className="font-handwriting text-lg text-[#9B7BD3]">3 November</span>
        </div>

        {/* Salutation */}
        <h3 className="font-handwriting text-3xl md:text-4xl font-bold text-[#49306D] mb-6">
          {LETTER_DATA.salutation}
        </h3>

        {/* Letter Paragraphs Revealing Line by Line */}
        <div className="space-y-4 mb-8">
          {LETTER_DATA.paragraphs.map((p, idx) => {
            const isVisible = idx < visibleLineCount;
            return (
              <p
                key={idx}
                className={`font-handwriting text-xl md:text-2xl text-[#21132F] leading-relaxed transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 translate-y-0 filter-none'
                    : 'opacity-0 translate-y-4 blur-xs pointer-events-none'
                }`}
              >
                {p}
              </p>
            );
          })}
        </div>

        {/* Closing & Signature */}
        {visibleLineCount >= LETTER_DATA.paragraphs.length && (
          <div className="pt-6 border-t border-[#9B7BD3]/30 flex flex-col items-end animate-fadeIn">
            <p className="font-handwriting text-2xl text-[#49306D]">{LETTER_DATA.closing}</p>
            <p className="font-handwriting text-4xl font-bold text-[#7C3AED] mt-1">
              {LETTER_DATA.signature} 💜
            </p>
          </div>
        )}

        {/* Floating wax seal bottom left / center */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#9B7BD3]/20">
          <div className="flex items-center gap-2">
            {visibleLineCount < LETTER_DATA.paragraphs.length ? (
              <button
                onClick={handleRevealAll}
                className="text-xs text-[#7C3AED] hover:underline flex items-center gap-1 font-sans"
              >
                <Play className="w-3 h-3 fill-current" /> Read whole letter immediately
              </button>
            ) : (
              <span className="text-xs text-[#49306D] font-sans flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-green-600" /> Letter completely revealed
              </span>
            )}
          </div>

          {/* Seal button */}
          <button
            onClick={handleSealWithLove}
            disabled={isSealed}
            className={`px-5 py-2.5 rounded-full text-xs font-serif font-bold transition-all flex items-center gap-2 shadow-md ${
              isSealed
                ? 'bg-purple-900 text-white cursor-default'
                : 'bg-gradient-to-r from-[#9B7BD3] to-[#49306D] text-white hover:scale-105 active:scale-95'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSealed ? 'fill-red-400 text-red-400' : 'fill-white'}`} />
            <span>{isSealed ? 'Sealed in Prajjwal’s Heart Forever 💍' : 'Seal With a Heart 💌'}</span>
          </button>
        </div>
      </div>

      {/* Next CTA */}
      <div className="mt-12 text-center">
        <button
          onClick={() => {
            soundManager.playSparkle();
            onNextChapter();
          }}
          className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#9B7BD3] via-[#D8C7FF] to-[#F8DDF0] text-[#21132F] font-serif font-bold text-base md:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <span>Explore Chapter 5: 100 Reasons Why I Love You</span>
          <Sparkles className="w-5 h-5 text-[#21132F] group-hover:rotate-45 transition-transform" />
        </button>
      </div>
    </div>
  );
};
