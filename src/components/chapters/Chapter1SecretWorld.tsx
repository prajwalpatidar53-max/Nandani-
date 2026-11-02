import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../../utils/soundSynthesizer';

interface Chapter1Props {
  onEnter: () => void;
}

export const Chapter1SecretWorld: React.FC<Chapter1Props> = ({ onEnter }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleEnterClick = () => {
    soundManager.playSparkle();
    soundManager.playHeartPop();
    setIsOpening(true);
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-16">
      {/* Center glowing card & animated envelope */}
      <div className="relative max-w-xl w-full mx-auto">
        {/* Glow halo */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-[#9B7BD3]/30 via-[#D8C7FF]/20 to-[#F8DDF0]/30 rounded-3xl blur-2xl pointer-events-none" />

        <div className="relative backdrop-blur-2xl bg-[#21132F]/80 border border-[#D8C7FF]/40 rounded-3xl p-8 md:p-12 shadow-[0_20px_60px_rgba(33,19,47,0.7)] overflow-hidden">
          {/* Floating animated envelope */}
          <div
            onClick={handleEnterClick}
            className={`cursor-pointer mx-auto mb-8 w-36 h-28 md:w-44 md:h-32 rounded-2xl bg-gradient-to-br from-[#9B7BD3] via-[#7C3AED] to-[#49306D] border-2 border-[#D8C7FF] shadow-[0_0_40px_rgba(216,199,255,0.4)] flex items-center justify-center transition-all duration-500 hover:scale-105 group relative ${
              isOpening ? 'scale-125 rotate-6 opacity-0' : 'animate-float'
            }`}
          >
            {/* Wax seal heart */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F8DDF0] to-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-[#9B7BD3] fill-[#9B7BD3]" />
            </div>

            {/* Sparkles around envelope */}
            <Sparkles className="absolute -top-3 -right-3 w-6 h-6 text-[#F8DDF0] animate-spin" />
            <Sparkles className="absolute -bottom-2 -left-2 w-5 h-5 text-[#D8C7FF] animate-pulse" />
          </div>

          {/* Subtitle / Intro greeting */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D8C7FF]/30 text-xs text-[#D8C7FF] mb-6">
            <Heart className="w-3.5 h-3.5 text-[#F8DDF0] fill-current" />
            <span>Dedicated to Nandani, created by Prajjwal</span>
            <Heart className="w-3.5 h-3.5 text-[#F8DDF0] fill-current" />
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
            Hey Nandani... <span className="text-[#D8C7FF]">💜</span>
          </h2>

          <p className="font-sans text-base md:text-lg text-[#D8C7FF]/90 font-light leading-relaxed max-w-md mx-auto mb-3">
            Someone has created an entire little universe just for you.
          </p>

          <p className="font-handwriting text-2xl md:text-3xl text-[#F8DDF0] mb-8">
            Are you ready to enter?
          </p>

          {/* Primary Action Button */}
          <button
            onClick={handleEnterClick}
            disabled={isOpening}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#9B7BD3] via-[#D8C7FF] to-[#F8DDF0] text-[#21132F] font-serif font-bold text-base md:text-lg shadow-[0_10px_35px_rgba(216,199,255,0.4)] hover:shadow-[0_15px_45px_rgba(216,199,255,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span>Enter My Little World</span>
            <Sparkles className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
