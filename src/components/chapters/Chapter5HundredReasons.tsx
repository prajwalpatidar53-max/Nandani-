import React, { useState } from 'react';
import { HUNDRED_REASONS, REASON_CATEGORIES, ReasonCategory } from '../../data/reasonsData';
import { filterReasons, calculateOpenedPercentage } from '../../utils/universeLogic';
import { ReasonItem } from '../../types';
import { Sparkles, Heart, Search, Shuffle, CheckCircle, X, Award } from 'lucide-react';
import { soundManager } from '../../utils/soundSynthesizer';
import confetti from 'canvas-confetti';

interface Chapter5Props {
  onNextChapter: () => void;
}

export const Chapter5HundredReasons: React.FC<Chapter5Props> = ({ onNextChapter }) => {
  const [selectedCategory, setSelectedCategory] = useState<ReasonCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openedIds, setOpenedIds] = useState<Set<number>>(new Set([1, 2, 3]));
  const [modalReason, setModalReason] = useState<ReasonItem | null>(null);

  const filteredReasons = filterReasons(HUNDRED_REASONS, selectedCategory, searchQuery);
  const percentage = calculateOpenedPercentage(openedIds.size, 100);

  const handleCardClick = (reason: ReasonItem) => {
    soundManager.playSparkle();
    setOpenedIds((prev) => {
      const next = new Set(prev);
      next.add(reason.id);
      // Check celebration milestone
      if (next.size === 25 || next.size === 50 || next.size === 75 || next.size === 100) {
        soundManager.playCelebrationChord();
        try {
          confetti({ particleCount: 70, spread: 60, colors: ['#D8C7FF', '#F8DDF0', '#9B7BD3'] });
        } catch {}
      }
      return next;
    });
    setModalReason(reason);
  };

  const handleRandomPick = () => {
    soundManager.playHeartPop();
    const randomIndex = Math.floor(Math.random() * HUNDRED_REASONS.length);
    const chosen = HUNDRED_REASONS[randomIndex];
    handleCardClick(chosen);
  };

  return (
    <div className="relative min-h-[92vh] px-4 py-16 max-w-6xl mx-auto">
      {/* Chapter Tag */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D8C7FF]/30 text-xs text-[#D8C7FF] mb-4">
          <Heart className="w-3.5 h-3.5 text-[#F8DDF0] fill-current" />
          <span>Chapter 5 — A Hundred Ways You Enchant Me</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          100 Little Reasons 💜
        </h2>
        <p className="font-sans text-sm md:text-base text-[#D8C7FF]/80 max-w-2xl mx-auto">
          One hundred genuine reasons why Prajjwal loves you with all his heart. Tap any card to
          unfold that memory.
        </p>

        {/* Progress bar & Random button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          <div className="w-full bg-white/10 rounded-full h-3 border border-white/20 p-0.5">
            <div
              className="bg-gradient-to-r from-[#9B7BD3] via-[#D8C7FF] to-[#F8DDF0] h-full rounded-full transition-all duration-500 shadow-[0_0_12px_#D8C7FF]"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs font-serif text-[#D8C7FF] whitespace-nowrap font-semibold">
            {openedIds.size} of 100 Discovered ({percentage}%)
          </span>

          <button
            onClick={handleRandomPick}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#9B7BD3] to-[#D8C7FF] text-[#21132F] text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Pick a Random Reason 🎲</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="mb-8 space-y-4">
        {/* Search input */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D8C7FF]/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reasons (e.g. smile, eyes, laughter, warm)..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#21132F]/80 border border-[#D8C7FF]/30 text-white placeholder-white/40 text-xs md:text-sm focus:outline-hidden focus:border-[#D8C7FF] transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories scrollable pill row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center px-2">
          {REASON_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundManager.playSparkle();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#D8C7FF] text-[#21132F] font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-[#D8C7FF]/80 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Reason Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {filteredReasons.map((reason) => {
          const isOpened = openedIds.has(reason.id);
          return (
            <div
              key={reason.id}
              onClick={() => handleCardClick(reason)}
              className={`group cursor-pointer rounded-2xl p-4 transition-all duration-300 relative border flex flex-col justify-between min-h-[140px] ${
                isOpened
                  ? 'bg-gradient-to-b from-[#2D1B4E]/90 to-[#180D24]/90 border-[#D8C7FF]/40 shadow-md hover:scale-105 hover:border-[#D8C7FF]'
                  : 'bg-[#21132F]/60 border-white/10 hover:bg-[#21132F]/90 hover:scale-102'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{reason.icon}</span>
                  <span className="text-[10px] font-serif font-bold text-[#D8C7FF]/80 px-2 py-0.5 rounded-full bg-white/10">
                    #{reason.id}
                  </span>
                </div>
                <h4 className="font-serif text-xs md:text-sm font-semibold text-white line-clamp-2">
                  {reason.title}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#D8C7FF]/70">
                <span className="truncate max-w-[80px]">{reason.category}</span>
                {isOpened ? (
                  <CheckCircle className="w-3.5 h-3.5 text-[#F8DDF0]" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:rotate-45 transition-all" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal View for Selected Reason */}
      {modalReason && (
        <div
          className="fixed inset-0 z-50 bg-[#12071E]/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setModalReason(null)}
        >
          <div
            className="bg-gradient-to-b from-[#2D1B4E] to-[#180D24] border-2 border-[#D8C7FF] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalReason(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-5xl mb-4 inline-block animate-bounce">{modalReason.icon}</span>

            <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs text-[#D8C7FF] font-serif font-semibold mb-3">
              Reason #{modalReason.id} • {modalReason.category}
            </div>

            <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
              {modalReason.title}
            </h3>

            <p className="font-handwriting text-2xl md:text-3xl text-[#F8DDF0] leading-relaxed mb-6">
              "{modalReason.text}"
            </p>

            <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-[#D8C7FF]/70">
              <Heart className="w-4 h-4 text-[#9B7BD3] fill-current" />
              <span>Written with love by Prajjwal for Nandani</span>
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
          <span>Proceed to Chapter 6: Our Little Promises</span>
          <Sparkles className="w-5 h-5 text-[#21132F] group-hover:rotate-45 transition-transform" />
        </button>
      </div>
    </div>
  );
};
