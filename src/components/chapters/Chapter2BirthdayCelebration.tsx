import React, { useState } from 'react';
import { Sparkles, Heart, Gift } from 'lucide-react';
import { soundManager } from '../../utils/soundSynthesizer';
import { LuxuryTwoTierCake } from '../LuxuryTwoTierCake';

interface Chapter2Props {
  onDiscoverSurprises: () => void;
}

export const Chapter2BirthdayCelebration: React.FC<Chapter2Props> = ({ onDiscoverSurprises }) => {
  const [wishMade, setWishMade] = useState<boolean>(false);

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-16">
      {/* Floating birthday balloons backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {[
          { x: '10%', y: '15%', delay: '0s', emoji: '🎈' },
          { x: '85%', y: '20%', delay: '1s', emoji: '🎈' },
          { x: '20%', y: '65%', delay: '2s', emoji: '✨' },
          { x: '80%', y: '70%', delay: '1.5s', emoji: '💜' },
          { x: '50%', y: '10%', delay: '0.8s', emoji: '🎂' },
        ].map((item, idx) => (
          <span
            key={idx}
            className="absolute text-4xl opacity-30 animate-float"
            style={{ left: item.x, top: item.y, animationDelay: item.delay }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      <div className="max-w-2xl w-full mx-auto">
        {/* Date pill */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#9B7BD3]/30 border border-[#D8C7FF]/40 text-[#F8DDF0] font-serif text-sm md:text-base font-semibold shadow-lg mb-6 animate-pulse">
          <Sparkles className="w-4 h-4 text-[#FFD700]" />
          <span>3 November</span>
          <Sparkles className="w-4 h-4 text-[#FFD700]" />
        </div>

        {/* Quotes */}
        <p className="font-sans text-base md:text-xl text-[#D8C7FF]/90 font-light mb-2">
          Some dates are special because they change the world of someone.
        </p>
        <p className="font-handwriting text-2xl md:text-3xl text-[#F8DDF0] font-normal mb-8">
          And this date gave the world YOU.
        </p>

        {/* Main Heading */}
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D8C7FF] to-[#F8DDF0] tracking-tight leading-tight mb-8 drop-shadow-[0_10px_20px_rgba(155,123,211,0.5)]">
          HAPPY BIRTHDAY NANDANI!
        </h2>

        {/* Luxurious Two-Tier Realistic Birthday Cake Section */}
        <div className="mb-10 w-full">
          <LuxuryTwoTierCake
            onWishComplete={() => {
              setWishMade(true);
            }}
          />
        </div>

        {/* Discover Surprises Button */}
        <button
          onClick={() => {
            soundManager.playSparkle();
            onDiscoverSurprises();
          }}
          className={`group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-[#21132F] font-serif font-bold text-base md:text-lg transition-all duration-500 cursor-pointer ${
            wishMade
              ? 'bg-gradient-to-r from-[#FFD700] via-[#F8DDF0] to-[#D8C7FF] shadow-[0_12px_45px_rgba(255,215,0,0.55)] scale-105 animate-pulse'
              : 'bg-gradient-to-r from-[#9B7BD3] via-[#D8C7FF] to-[#F8DDF0] shadow-[0_10px_35px_rgba(216,199,255,0.4)] hover:shadow-[0_15px_45px_rgba(216,199,255,0.6)] hover:scale-105 active:scale-95'
          }`}
        >
          <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform text-[#21132F]" />
          <span>Discover Your Surprises 💜</span>
          <Heart className="w-5 h-5 fill-current text-[#21132F]" />
        </button>
      </div>
    </div>
  );
};
