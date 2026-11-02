import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Flame, Gift } from 'lucide-react';
import { soundManager } from '../../utils/soundSynthesizer';

interface Chapter2Props {
  onDiscoverSurprises: () => void;
}

export const Chapter2BirthdayCelebration: React.FC<Chapter2Props> = ({ onDiscoverSurprises }) => {
  const [candlesBlown, setCandlesBlown] = useState<boolean>(false);
  const [wishMade, setWishMade] = useState<boolean>(false);

  const handleBlowCandles = () => {
    if (candlesBlown) return;
    soundManager.playBlowingCandle();
    setCandlesBlown(true);

    setTimeout(() => {
      soundManager.playCelebrationChord();
      setWishMade(true);

      // Canvas confetti burst
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D8C7FF', '#9B7BD3', '#F8DDF0', '#FFFFFF', '#FFD700'],
        });

        setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#D8C7FF', '#F8DDF0', '#FF80BF'],
          });
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#D8C7FF', '#9B7BD3', '#FFD700'],
          });
        }, 300);
      } catch {
        // Safe confetti fallback
      }
    }, 450);
  };

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

        {/* Interactive Glowing Birthday Cake Card */}
        <div className="backdrop-blur-xl bg-[#21132F]/80 border border-[#D8C7FF]/40 rounded-3xl p-6 md:p-8 shadow-2xl mb-10 max-w-lg mx-auto">
          <div className="relative flex flex-col items-center justify-center">
            {/* Candles on Cake */}
            <div className="flex justify-center gap-4 mb-2">
              {[0, 1, 2].map((candle) => (
                <div key={candle} className="flex flex-col items-center">
                  {/* Candle Flame */}
                  {!candlesBlown ? (
                    <div className="relative">
                      <Flame className="w-6 h-6 text-[#FFB703] fill-[#FFB703] animate-pulse drop-shadow-[0_0_12px_#FFB703]" />
                      <div className="absolute inset-0 bg-[#FFD700]/50 rounded-full blur-sm" />
                    </div>
                  ) : (
                    <div className="w-1.5 h-3 bg-white/40 rounded-full animate-bounce" />
                  )}
                  {/* Candle Stick */}
                  <div className="w-2.5 h-7 rounded-sm bg-gradient-to-b from-[#F8DDF0] to-[#9B7BD3] shadow-sm" />
                </div>
              ))}
            </div>

            {/* Cake Layers SVG / Graphic */}
            <div className="w-48 sm:w-56 h-28 bg-gradient-to-b from-[#D8C7FF] via-[#9B7BD3] to-[#49306D] rounded-t-3xl rounded-b-xl border-2 border-white/40 shadow-inner flex flex-col justify-between p-3 relative overflow-hidden">
              <div className="flex justify-around text-xs opacity-75">
                <span>💜</span>
                <span>✨</span>
                <span>🌸</span>
                <span>✨</span>
                <span>💜</span>
              </div>
              <div className="text-center">
                <span className="font-handwriting text-2xl text-white font-bold drop-shadow">
                  Nandani
                </span>
              </div>
              <div className="w-full h-2 bg-[#F8DDF0]/60 rounded-full" />
            </div>

            {/* Cake Plate */}
            <div className="w-60 sm:w-68 h-3 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full mt-1" />

            {/* Cake Action Prompt */}
            {!candlesBlown ? (
              <button
                onClick={handleBlowCandles}
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFB703]/20 border border-[#FFB703]/60 text-[#FFD700] hover:bg-[#FFB703]/30 transition-all text-sm font-semibold hover:scale-105 active:scale-95"
              >
                <span>Blow out your candles! 🌬️✨</span>
              </button>
            ) : (
              <div className="mt-5 text-center animate-fadeIn">
                <p className="font-handwriting text-2xl text-[#F8DDF0]">
                  May every wish your heart holds come true! 💫
                </p>
                <p className="text-xs text-[#D8C7FF]/70 mt-1">
                  Candles blown with all Prajjwal's love.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Discover Surprises Button */}
        <button
          onClick={() => {
            soundManager.playSparkle();
            onDiscoverSurprises();
          }}
          className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#9B7BD3] via-[#D8C7FF] to-[#F8DDF0] text-[#21132F] font-serif font-bold text-base md:text-lg shadow-[0_10px_35px_rgba(216,199,255,0.4)] hover:shadow-[0_15px_45px_rgba(216,199,255,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform text-[#21132F]" />
          <span>Discover Your Surprises 💜</span>
          <Heart className="w-5 h-5 fill-current text-[#21132F]" />
        </button>
      </div>
    </div>
  );
};
