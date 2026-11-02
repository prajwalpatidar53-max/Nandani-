import React, { useState } from 'react';
import { ChapterId } from '../types';
import { Sparkles, Menu, X, Heart, Compass } from 'lucide-react';
import { soundManager } from '../utils/soundSynthesizer';

interface NavbarProps {
  currentChapter: ChapterId;
  onSelectChapter: (ch: ChapterId) => void;
  progressPercent: number;
}

const CHAPTERS: { id: ChapterId; title: string; subtitle: string; icon: string }[] = [
  { id: 1, title: 'The Secret World', subtitle: 'The Gateway', icon: '💌' },
  { id: 2, title: 'The Day You Were Born', subtitle: '3 November', icon: '🎂' },
  { id: 3, title: 'Our Photo Universe', subtitle: 'Real Memories', icon: '📸' },
  { id: 4, title: 'Letter From Prajjwal', subtitle: 'From My Heart', icon: '📜' },
  { id: 5, title: '100 Little Reasons', subtitle: 'Why I Love You', icon: '✨' },
  { id: 6, title: 'Our Little Promises', subtitle: 'Sacred Vows', icon: '💍' },
  { id: 7, title: 'The Surprise Boxes', subtitle: '5 Gifts For You', icon: '🎁' },
  { id: 8, title: 'The Memory Game', subtitle: 'Our Sweet Trivia', icon: '🔮' },
  { id: 9, title: 'The Final Universe', subtitle: 'Infinite Love', icon: '🌌' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentChapter, onSelectChapter, progressPercent }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleChapterClick = (id: ChapterId) => {
    soundManager.playSparkle();
    setIsOpen(false);
    onSelectChapter(id);
  };

  const currentChInfo = CHAPTERS.find((c) => c.id === currentChapter) || CHAPTERS[0];

  return (
    <>
      {/* Top Floating Glass Navigation Bar */}
      <header className="fixed top-3 inset-x-0 mx-auto max-w-5xl px-4 z-40 select-none">
        <div className="backdrop-blur-xl bg-[#21132F]/80 border border-[#D8C7FF]/25 rounded-2xl px-4 py-2.5 shadow-[0_8px_32px_rgba(33,19,47,0.5)] flex items-center justify-between">
          {/* Logo / Title */}
          <div
            onClick={() => handleChapterClick(1)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#9B7BD3] to-[#D8C7FF] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 text-[#21132F] fill-[#21132F]" />
            </div>
            <div>
              <h1 className="font-serif text-sm md:text-base font-bold text-white tracking-wide flex items-center gap-1.5">
                The Universe of Nandani
                <Sparkles className="w-3.5 h-3.5 text-[#D8C7FF] animate-pulse" />
              </h1>
              <p className="text-[10px] text-[#D8C7FF]/70 tracking-wider font-sans">
                Made With Love By Prajjwal
              </p>
            </div>
          </div>

          {/* Current Chapter Indicator & Progress */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs font-serif text-[#D8C7FF] font-semibold flex items-center gap-1">
                <span>{currentChInfo.icon}</span>
                <span>Ch. {currentChInfo.id}: {currentChInfo.title}</span>
              </span>
              <div className="w-32 bg-white/10 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#9B7BD3] to-[#F8DDF0] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Chapters Menu Toggle */}
          <button
            onClick={() => {
              soundManager.playSparkle();
              setIsOpen(!isOpen);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-[#D8C7FF]/30 text-[#D8C7FF] text-xs font-medium transition-all active:scale-95"
            aria-label="Open chapter navigation menu"
          >
            <Compass className="w-4 h-4" />
            <span className="hidden sm:inline">Universe Map</span>
            {isOpen ? <X className="w-4 h-4 ml-1" /> : <Menu className="w-4 h-4 ml-1" />}
          </button>
        </div>
      </header>

      {/* Chapters Drawer / Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#12071E]/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-gradient-to-b from-[#2D1B4E] to-[#180D24] border border-[#D8C7FF]/30 rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌌</span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">The 9 Chapters of Nandani</h3>
                  <p className="text-xs text-[#D8C7FF]/70">Explore your romantic universe</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {CHAPTERS.map((ch) => {
                const isCurrent = ch.id === currentChapter;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleChapterClick(ch.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-200 text-left border ${
                      isCurrent
                        ? 'bg-gradient-to-r from-[#9B7BD3]/40 to-[#D8C7FF]/20 border-[#D8C7FF] text-white shadow-lg'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-[#D8C7FF]/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 rounded-xl bg-white/10">{ch.icon}</span>
                      <div>
                        <div className="text-sm font-semibold flex items-center gap-2">
                          <span>Chapter {ch.id}: {ch.title}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-[#9B7BD3] text-white px-2 py-0.5 rounded-full font-sans">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#D8C7FF]/60 font-sans">{ch.subtitle}</div>
                      </div>
                    </div>
                    <Sparkles
                      className={`w-4 h-4 transition-transform ${
                        isCurrent ? 'text-[#F8DDF0] scale-125' : 'text-white/20'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
