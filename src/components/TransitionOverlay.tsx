import React, { useEffect, useState } from 'react';
import { TransitionType } from '../types';
import { Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../utils/soundSynthesizer';

interface TransitionOverlayProps {
  isActive: boolean;
  transitionType: TransitionType;
  onComplete: () => void;
}

export const TransitionOverlay: React.FC<TransitionOverlayProps> = ({
  isActive,
  transitionType,
  onComplete,
}) => {
  const [stage, setStage] = useState<'entering' | 'holding' | 'leaving' | 'idle'>('idle');

  useEffect(() => {
    if (!isActive) {
      setStage('idle');
      return;
    }

    soundManager.playPortalSwoosh();
    setStage('entering');

    // Transition stages:
    // 0 -> 400ms: entering
    // 400 -> 650ms: peak hold (state swap happens here in parent)
    // 650 -> 1000ms: reveal / leaving
    const holdTimer = setTimeout(() => {
      setStage('holding');
    }, 380);

    const leaveTimer = setTimeout(() => {
      setStage('leaving');
    }, 650);

    const finishTimer = setTimeout(() => {
      setStage('idle');
      onComplete();
    }, 980);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(leaveTimer);
      clearTimeout(finishTimer);
    };
  }, [isActive, transitionType, onComplete]);

  if (!isActive && stage === 'idle') return null;

  // Render specific transition effect graphics
  const renderEffectGraphic = () => {
    switch (transitionType) {
      case 'portal':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className={`w-96 h-96 rounded-full border-4 border-[#D8C7FF] shadow-[0_0_120px_#9B7BD3] bg-gradient-to-tr from-[#9B7BD3]/60 via-[#D8C7FF]/40 to-transparent transition-all duration-700 ease-out ${stage === 'entering' ? 'scale-0 rotate-180 opacity-0' : stage === 'holding' ? 'scale-150 rotate-0 opacity-100' : 'scale-[3] opacity-0'}`} />
            <div className="absolute text-center">
              <Sparkles className="w-16 h-16 text-[#F8DDF0] animate-spin mx-auto" />
              <p className="mt-3 font-serif text-lg text-[#D8C7FF] tracking-widest uppercase">Opening Portal...</p>
            </div>
          </div>
        );

      case 'heart-expansion':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <Heart
              className={`text-[#D8C7FF] fill-[#9B7BD3] drop-shadow-[0_0_60px_#F8DDF0] transition-all duration-700 ${stage === 'entering' ? 'scale-0 opacity-0' : stage === 'holding' ? 'scale-[8] opacity-100' : 'scale-[25] opacity-0'}`}
              style={{ width: '80px', height: '80px' }}
            />
          </div>
        );

      case 'curtain':
        return (
          <div className="relative w-full h-full flex overflow-hidden">
            <div
              className={`w-1/2 h-full bg-gradient-to-r from-[#21132F] to-[#49306D] border-r-2 border-[#D8C7FF]/40 shadow-2xl transition-transform duration-700 ease-in-out ${stage === 'leaving' ? '-translate-x-full' : 'translate-x-0'}`}
            />
            <div
              className={`w-1/2 h-full bg-gradient-to-l from-[#21132F] to-[#49306D] border-l-2 border-[#D8C7FF]/40 shadow-2xl transition-transform duration-700 ease-in-out ${stage === 'leaving' ? 'translate-x-full' : 'translate-x-0'}`}
            />
          </div>
        );

      case 'envelope':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div
              className={`w-72 h-48 bg-[#9B7BD3] rounded-2xl border-2 border-[#D8C7FF] shadow-[0_0_80px_rgba(216,199,255,0.4)] flex items-center justify-center transition-all duration-700 ${stage === 'entering' ? 'scale-50 rotate-12 opacity-0' : stage === 'holding' ? 'scale-110 rotate-0 opacity-100' : 'scale-[2.5] opacity-0'}`}
            >
              <span className="text-5xl">💌</span>
            </div>
            <p className="mt-6 font-handwriting text-2xl text-[#D8C7FF]">Unfolding a sweet memory...</p>
          </div>
        );

      case 'page-turn':
        return (
          <div className="w-full h-full flex justify-center items-center perspective-1000">
            <div
              className={`w-full max-w-xl h-4/5 bg-gradient-to-br from-[#2D1B4E] to-[#180D24] border-2 border-[#D8C7FF]/40 rounded-2xl shadow-2xl flex items-center justify-center p-8 transition-transform duration-700 origin-left ${stage === 'leaving' ? '-rotate-y-90 opacity-0' : 'rotate-y-0 opacity-100'}`}
            >
              <span className="font-serif text-2xl text-[#D8C7FF] tracking-wider">Turning Chapter... 📖</span>
            </div>
          </div>
        );

      case 'cloud-reveal':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div
              className={`absolute inset-0 bg-[#D8C7FF]/70 backdrop-blur-3xl transition-opacity duration-700 ${stage === 'leaving' ? 'opacity-0' : 'opacity-100'}`}
            />
            <div className="relative z-10 text-center">
              <span className="text-6xl animate-bounce">☁️💜☁️</span>
              <p className="mt-4 font-serif text-xl text-[#21132F] font-semibold tracking-wider">Floating through dream clouds...</p>
            </div>
          </div>
        );

      case 'star-explosion':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {[...Array(24)].map((_, i) => {
              const angle = (i * 360) / 24;
              const rad = (angle * Math.PI) / 180;
              const dist = stage === 'leaving' ? 600 : stage === 'holding' ? 240 : 20;
              const x = Math.cos(rad) * dist;
              const y = Math.sin(rad) * dist;
              return (
                <div
                  key={i}
                  className="absolute transition-all duration-700 ease-out text-[#D8C7FF]"
                  style={{
                    transform: `translate(${x}px, ${y}px) scale(${stage === 'holding' ? 1.5 : 0.2})`,
                    opacity: stage === 'leaving' ? 0 : 1,
                  }}
                >
                  ✨
                </div>
              );
            })}
            <p className="font-serif text-2xl text-[#D8C7FF] tracking-widest uppercase">Starlight Awakening ✨</p>
          </div>
        );

      case 'butterfly-flight':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div
              className={`text-8xl transition-all duration-700 ease-out ${stage === 'entering' ? '-translate-x-96 translate-y-48 scale-50 opacity-0' : stage === 'holding' ? 'translate-x-0 translate-y-0 scale-125 opacity-100' : 'translate-x-96 -translate-y-48 scale-[2] opacity-0'}`}
            >
              🦋
            </div>
          </div>
        );

      case 'petal-storm':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {[...Array(18)].map((_, i) => (
              <span
                key={i}
                className="absolute text-4xl transition-all duration-700 animate-spin"
                style={{
                  top: `${(i * 17) % 90}%`,
                  left: `${(i * 23) % 90}%`,
                  transform: `scale(${stage === 'holding' ? 1.2 : 0}) rotate(${i * 45}deg)`,
                  opacity: stage === 'leaving' ? 0 : 0.85,
                  transitionDelay: `${i * 15}ms`,
                }}
              >
                🌸
              </span>
            ))}
            <div className="relative z-10 font-handwriting text-3xl text-[#F8DDF0]">Petals in the wind...</div>
          </div>
        );

      case 'polaroid-zoom':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              className={`bg-white p-5 pb-10 rounded-sm shadow-2xl transition-all duration-700 ${stage === 'entering' ? 'scale-0 rotate-[-25deg] opacity-0' : stage === 'holding' ? 'scale-100 rotate-[-4deg] opacity-100' : 'scale-[3] rotate-12 opacity-0'}`}
            >
              <div className="w-56 h-56 bg-[#21132F] rounded flex items-center justify-center text-4xl text-[#D8C7FF]">
                📸
              </div>
              <p className="text-center font-handwriting text-[#49306D] text-lg mt-3">Next Chapter...</p>
            </div>
          </div>
        );

      case 'cinematic-fade':
        return (
          <div
            className={`w-full h-full bg-[#12071E] flex items-center justify-center transition-opacity duration-700 ${stage === 'leaving' ? 'opacity-0' : 'opacity-100'}`}
          >
            <div className="w-32 h-0.5 bg-[#D8C7FF] animate-pulse" />
          </div>
        );

      case 'purple-sweep':
        return (
          <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-[#9B7BD3]/80 to-transparent skew-x-[-20deg] transition-transform duration-700 ease-in-out ${stage === 'entering' ? '-translate-x-full' : stage === 'holding' ? 'translate-x-0' : 'translate-x-full'}`}
            />
            <span className="font-serif text-xl text-[#F8DDF0] tracking-widest">PURPLE AURORA ✨</span>
          </div>
        );

      case 'dreamy-blur':
        return (
          <div
            className={`w-full h-full bg-[#21132F]/80 backdrop-blur-2xl flex items-center justify-center transition-all duration-700 ${stage === 'leaving' ? 'backdrop-blur-none opacity-0' : 'opacity-100'}`}
          >
            <div className="text-center">
              <span className="text-4xl text-[#D8C7FF] animate-pulse">💫</span>
              <p className="font-serif text-lg text-[#D8C7FF] mt-2">Dreaming onward...</p>
            </div>
          </div>
        );

      case 'heart-mask':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              className={`text-[200px] text-[#9B7BD3] transition-all duration-700 ${stage === 'entering' ? 'scale-0 opacity-0' : stage === 'holding' ? 'scale-100 opacity-90' : 'scale-[6] opacity-0'}`}
            >
              💜
            </div>
          </div>
        );

      case 'shooting-star':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div
              className={`w-full h-2 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_50px_#D8C7FF] transition-all duration-700 ${stage === 'entering' ? '-translate-x-full -rotate-45' : stage === 'holding' ? 'translate-x-0 rotate-0' : 'translate-x-full rotate-45'}`}
            />
            <p className="absolute font-serif text-xl text-white tracking-widest uppercase">Make a wish... 🌠</p>
          </div>
        );

      case 'particle-dissolve':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="grid grid-cols-6 gap-6">
              {[...Array(36)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full bg-[#D8C7FF] transition-all duration-700 ${stage === 'leaving' ? 'scale-0 opacity-0' : 'scale-100 opacity-80'}`}
                  style={{ transitionDelay: `${(i % 6) * 40}ms` }}
                />
              ))}
            </div>
          </div>
        );

      case 'card-flip-3d':
        return (
          <div className="w-full h-full flex items-center justify-center perspective-1000">
            <div
              className={`w-80 h-96 rounded-2xl bg-gradient-to-br from-[#49306D] to-[#21132F] border-2 border-[#D8C7FF]/40 shadow-2xl flex flex-col items-center justify-center p-6 transition-all duration-700 ${stage === 'entering' ? 'rotate-y-90 scale-75 opacity-0' : stage === 'holding' ? 'rotate-y-0 scale-100 opacity-100' : '-rotate-y-90 scale-110 opacity-0'}`}
            >
              <Heart className="w-16 h-16 text-[#D8C7FF] fill-[#9B7BD3]" />
              <p className="mt-4 font-serif text-lg text-white font-medium">To My Favorite Girl...</p>
            </div>
          </div>
        );

      case 'aurora-wave':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div
              className={`absolute inset-0 bg-gradient-to-t from-[#21132F] via-[#9B7BD3]/50 to-[#49306D] transition-transform duration-700 ${stage === 'leaving' ? 'translate-y-full' : 'translate-y-0'}`}
            />
            <p className="relative z-10 font-serif text-2xl text-[#D8C7FF] tracking-widest uppercase">Lavender Aurora 🌌</p>
          </div>
        );

      case 'circular-ripple':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {[1, 2, 3].map((ring) => (
              <div
                key={ring}
                className={`absolute rounded-full border-2 border-[#D8C7FF] transition-all duration-700 ease-out`}
                style={{
                  width: stage === 'entering' ? '0px' : stage === 'holding' ? `${ring * 160}px` : `${ring * 400}px`,
                  height: stage === 'entering' ? '0px' : stage === 'holding' ? `${ring * 160}px` : `${ring * 400}px`,
                  opacity: stage === 'leaving' ? 0 : 0.7 / ring,
                  transitionDelay: `${ring * 80}ms`,
                }}
              />
            ))}
            <span className="relative z-10 text-4xl text-[#F8DDF0]">💜</span>
          </div>
        );

      case 'firework-burst':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              className={`w-2 h-2 rounded-full bg-white shadow-[0_0_120px_40px_#D8C7FF] transition-all duration-700 ${stage === 'entering' ? 'scale-100' : stage === 'holding' ? 'scale-[20]' : 'scale-[60] opacity-0'}`}
            />
            <p className="absolute font-serif text-3xl text-[#21132F] font-bold tracking-wider z-20">
              HAPPY BIRTHDAY NANDANI! 🎆
            </p>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center w-full h-full">
            <Sparkles className="w-12 h-12 text-[#D8C7FF] animate-spin" />
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#170B24]/90 backdrop-blur-md pointer-events-auto transition-opacity duration-300"
      aria-hidden="true"
    >
      {renderEffectGraphic()}
    </div>
  );
};
