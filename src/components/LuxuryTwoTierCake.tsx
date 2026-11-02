import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../utils/soundSynthesizer';

interface LuxuryTwoTierCakeProps {
  onWishComplete?: () => void;
}

export const LuxuryTwoTierCake: React.FC<LuxuryTwoTierCakeProps> = ({ onWishComplete }) => {
  // Candle states: [left, center, right]
  const [candlesLit, setCandlesLit] = useState<[boolean, boolean, boolean]>([true, true, true]);
  const [smokeVisible, setSmokeVisible] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [isBlowing, setIsBlowing] = useState<boolean>(false);
  const [isDimmed, setIsDimmed] = useState<boolean>(false);
  const [isCelebrationActive, setIsCelebrationActive] = useState<boolean>(false);
  const [cakeSparkles, setCakeSparkles] = useState<Array<{ id: number; x: number; y: number; delay: string; size: number }>>([]);

  // Generate subtle sparkling sugar crystals around the cake
  useEffect(() => {
    const sparkles = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: 18 + Math.random() * 64,
      y: 15 + Math.random() * 70,
      delay: `${(i * 0.3).toFixed(1)}s`,
      size: 3 + Math.floor(Math.random() * 4),
    }));
    setCakeSparkles(sparkles);
  }, []);

  const handleBlowCandles = () => {
    if (isBlowing || (!candlesLit[0] && !candlesLit[1] && !candlesLit[2])) return;

    setIsBlowing(true);
    soundManager.playBlowingCandle();

    // Momentary slight ambient dimming as breath blows over flames
    setIsDimmed(true);

    // Candle 1 (Left) extinguishes at 320ms
    setTimeout(() => {
      setCandlesLit((prev) => [false, prev[1], prev[2]]);
      setSmokeVisible((prev) => [true, prev[1], prev[2]]);
    }, 320);

    // Candle 2 (Right) extinguishes at 680ms
    setTimeout(() => {
      setCandlesLit((prev) => [prev[0], prev[1], false]);
      setSmokeVisible((prev) => [prev[0], prev[1], true]);
    }, 680);

    // Candle 3 (Center) extinguishes at 1050ms
    setTimeout(() => {
      setCandlesLit([false, false, false]);
      setSmokeVisible([true, true, true]);
    }, 1050);

    // Celebration burst after all candles go out
    setTimeout(() => {
      setIsDimmed(false);
      setIsCelebrationActive(true);
      soundManager.playCelebrationChord();
      soundManager.playSparkle();

      // Golden & lavender celebration confetti explosion
      try {
        confetti({
          particleCount: 130,
          spread: 90,
          origin: { y: 0.55 },
          colors: ['#FFD700', '#F8DDF0', '#D8C7FF', '#9B7BD3', '#FFFFFF', '#FFA7D1'],
        });

        setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 60,
            origin: { x: 0.1, y: 0.6 },
            colors: ['#FFD700', '#D8C7FF', '#FFFFFF'],
          });
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 60,
            origin: { x: 0.9, y: 0.6 },
            colors: ['#F8DDF0', '#9B7BD3', '#FFD700'],
          });
        }, 320);
      } catch {
        // Safe confetti fallback
      }

      if (onWishComplete) {
        onWishComplete();
      }
    }, 1350);

    // Clear smoke wisps after 3.5s
    setTimeout(() => {
      setSmokeVisible([false, false, false]);
    }, 4500);
  };

  const allCandlesOut = !candlesLit[0] && !candlesLit[1] && !candlesLit[2];

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Dynamic Keyframe Styles for Realistic Flame, Smoke & Gold Sheen */}
      <style>{`
        @keyframes flameFlicker {
          0%, 100% {
            transform: scale(1) skewX(0deg) translateY(0);
            opacity: 0.98;
          }
          20% {
            transform: scale(1.06, 0.96) skewX(-2deg) translateY(-1px);
            opacity: 1;
          }
          40% {
            transform: scale(0.95, 1.05) skewX(1.8deg) translateY(-2px);
            opacity: 0.92;
          }
          65% {
            transform: scale(1.08, 0.94) skewX(-1.5deg) translateY(0px);
            opacity: 1;
          }
          85% {
            transform: scale(0.98, 1.03) skewX(1.2deg) translateY(-1px);
            opacity: 0.95;
          }
        }

        @keyframes flameBlowing {
          0% { transform: scale(1) skewX(0deg); opacity: 1; }
          30% { transform: scale(1.15, 0.75) skewX(18deg) translateX(4px); opacity: 0.85; }
          60% { transform: scale(0.85, 0.6) skewX(26deg) translateX(8px); opacity: 0.7; }
          100% { transform: scale(0.2, 0.2) skewX(30deg) translateX(12px); opacity: 0; }
        }

        @keyframes smokeRiseCurl {
          0% {
            opacity: 0.75;
            transform: translateY(0) scale(0.8) translateX(0);
          }
          35% {
            opacity: 0.6;
            transform: translateY(-16px) scale(1.2) translateX(4px);
          }
          70% {
            opacity: 0.35;
            transform: translateY(-34px) scale(1.7) translateX(-6px);
          }
          100% {
            opacity: 0;
            transform: translateY(-52px) scale(2.3) translateX(8px);
          }
        }

        @keyframes goldGleam {
          0%, 100% {
            filter: drop-shadow(0 2px 6px rgba(255, 215, 0, 0.5)) drop-shadow(0 0 14px rgba(255, 235, 150, 0.4));
          }
          50% {
            filter: drop-shadow(0 3px 12px rgba(255, 215, 0, 0.85)) drop-shadow(0 0 24px rgba(255, 240, 180, 0.7));
          }
        }

        @keyframes celebrationHaloPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.45;
          }
          50% {
            transform: scale(1.12);
            opacity: 0.8;
          }
        }

        @keyframes sugarTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.7) rotate(0deg); }
          50% { opacity: 0.95; transform: scale(1.3) rotate(45deg); }
        }

        .anim-flame-flicker-1 {
          transform-origin: bottom center;
          animation: flameFlicker 1.4s ease-in-out infinite;
        }
        .anim-flame-flicker-2 {
          transform-origin: bottom center;
          animation: flameFlicker 1.6s ease-in-out infinite 0.25s;
        }
        .anim-flame-flicker-3 {
          transform-origin: bottom center;
          animation: flameFlicker 1.35s ease-in-out infinite 0.5s;
        }
        .anim-flame-blow {
          transform-origin: bottom center;
          animation: flameBlowing 0.5s cubic-bezier(0.25, 0.8, 0.5, 1) forwards;
        }
        .anim-smoke {
          transform-origin: bottom center;
          animation: smokeRiseCurl 2.4s ease-out forwards;
        }
        .anim-gold-topper {
          animation: goldGleam 4s ease-in-out infinite;
        }
        .anim-celebration-halo {
          animation: celebrationHaloPulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* Atmospheric lighting container with smooth dimming when blowing */}
      <div
        className={`relative w-full rounded-3xl p-4 sm:p-7 md:p-8 transition-all duration-700 ${
          isDimmed
            ? 'bg-[#150a20]/95 shadow-[0_0_80px_rgba(73,48,109,0.9)]'
            : isCelebrationActive
            ? 'bg-gradient-to-b from-[#2a173d]/90 via-[#21132F]/90 to-[#190d26]/90 shadow-[0_0_70px_rgba(216,199,255,0.45)] border border-[#FFD700]/40'
            : 'bg-gradient-to-b from-[#2a173d]/80 via-[#21132F]/80 to-[#190d26]/85 shadow-[0_15px_45px_rgba(0,0,0,0.6)] border border-[#D8C7FF]/30'
        } backdrop-blur-xl`}
      >
        {/* Celebration Golden & Lavender Radial Glow Aura */}
        {isCelebrationActive && (
          <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,215,0,0.22),rgba(216,199,255,0.2),transparent_75%)] anim-celebration-halo" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FFD700]/15 rounded-full blur-3xl animate-pulse" />
          </div>
        )}

        {/* Floating sugar crystals and romantic micro-sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {cakeSparkles.map((sp) => (
            <span
              key={sp.id}
              className="absolute text-yellow-200 select-none"
              style={{
                left: `${sp.x}%`,
                top: `${sp.y}%`,
                fontSize: `${sp.size}px`,
                animation: `sugarTwinkle 3s ease-in-out infinite ${sp.delay}`,
              }}
            >
              ✦
            </span>
          ))}
        </div>

        {/* Ambient Candle Cast Glow (warm light illuminating the cake) */}
        {!allCandlesOut && (
          <div
            className={`absolute top-14 left-1/2 -translate-x-1/2 w-64 h-36 rounded-full bg-gradient-to-b from-[#FFB703]/25 via-[#FF9E00]/15 to-transparent blur-2xl pointer-events-none transition-opacity duration-500 ${
              isDimmed ? 'opacity-30' : 'opacity-90'
            }`}
          />
        )}

        {/* ============================================================== */}
        {/* 3D LUXURY TWO-TIER (DOUBLE-DECKER) CAKE SVG                    */}
        {/* ============================================================== */}
        <div className="relative w-full flex items-center justify-center">
          <svg
            viewBox="0 0 460 450"
            className="w-full max-w-[420px] h-auto drop-shadow-[0_20px_35px_rgba(10,5,20,0.6)] select-none"
            aria-label="Luxurious two-tier lavender and white birthday cake"
          >
            <defs>
              {/* Metallic Gold Pedestal Stand Gradient */}
              <linearGradient id="pedestalPlateGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="25%" stopColor="#FFF2B2" />
                <stop offset="50%" stopColor="#F5D77F" />
                <stop offset="75%" stopColor="#FFEAA7" />
                <stop offset="100%" stopColor="#B8860B" />
              </linearGradient>

              {/* Lower Stand Foot Gradient */}
              <linearGradient id="pedestalFootGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8A6721" />
                <stop offset="35%" stopColor="#E2B755" />
                <stop offset="60%" stopColor="#FFF6CD" />
                <stop offset="100%" stopColor="#735213" />
              </linearGradient>

              {/* Bottom Tier Cylindrical Fondant Gradient */}
              <linearGradient id="bottomTierCylinderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5D4380" />
                <stop offset="15%" stopColor="#8C6BB8" />
                <stop offset="35%" stopColor="#D8C7FF" />
                <stop offset="55%" stopColor="#EFE6FF" />
                <stop offset="80%" stopColor="#B397DC" />
                <stop offset="100%" stopColor="#5D4380" />
              </linearGradient>

              {/* Bottom Tier Top Ellipse (Smooth Fondant Top) */}
              <linearGradient id="bottomTierTopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#EADDFE" />
                <stop offset="100%" stopColor="#C9B3EC" />
              </linearGradient>

              {/* Top Tier Cylindrical Fondant Gradient (Ivory & Soft Lavender) */}
              <linearGradient id="topTierCylinderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6C4C8F" />
                <stop offset="18%" stopColor="#B298D4" />
                <stop offset="42%" stopColor="#F5EEFD" />
                <stop offset="65%" stopColor="#FFFFFF" />
                <stop offset="85%" stopColor="#D4C2F0" />
                <stop offset="100%" stopColor="#75529C" />
              </linearGradient>

              {/* Top Tier Top Ellipse (Velvety Ivory Fondant) */}
              <linearGradient id="topTierTopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#FAF5FF" />
                <stop offset="100%" stopColor="#DFCFF5" />
              </linearGradient>

              {/* Fondant Draped Swag Gradient */}
              <linearGradient id="fondantSwagGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#E8DCFC" />
                <stop offset="100%" stopColor="#BFA6E8" />
              </linearGradient>

              {/* Pearl Bead Gradient (Gleaming 3D Iridescence) */}
              <radialGradient id="pearlSphereGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#FFF0F8" />
                <stop offset="75%" stopColor="#D8C7FF" />
                <stop offset="100%" stopColor="#8C6DB8" />
              </radialGradient>

              {/* Golden Edible Sugar Bead Gradient */}
              <radialGradient id="goldBeadGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFDF2" />
                <stop offset="40%" stopColor="#FFE585" />
                <stop offset="80%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#7D5700" />
              </radialGradient>

              {/* Cake Topper Metallic Gold Gradient */}
              <linearGradient id="topperGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9DF" />
                <stop offset="25%" stopColor="#FFDE6A" />
                <stop offset="50%" stopColor="#F3B728" />
                <stop offset="75%" stopColor="#FFEAA7" />
                <stop offset="100%" stopColor="#9E7307" />
              </linearGradient>

              {/* Candle Body Spiral Gradient */}
              <linearGradient id="candleSpiralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#FFF4D0" />
                <stop offset="65%" stopColor="#D8C7FF" />
                <stop offset="100%" stopColor="#EADDFE" />
              </linearGradient>

              {/* Candle Gold Stripe Gradient */}
              <linearGradient id="candleGoldStripe" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="50%" stopColor="#FFF3B8" />
                <stop offset="100%" stopColor="#AA7A1E" />
              </linearGradient>

              {/* Realistic Candle Flame Outer Gradient */}
              <radialGradient id="flameOuterGrad" cx="50%" cy="75%" r="75%">
                <stop offset="0%" stopColor="#FFE066" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#FF9500" stopOpacity="0.85" />
                <stop offset="85%" stopColor="#FF3B00" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#FF0055" stopOpacity="0" />
              </radialGradient>

              {/* Candle Flame Inner Bright Core Gradient */}
              <linearGradient id="flameInnerGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#64B5F6" stopOpacity="0.9" />
                <stop offset="20%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="60%" stopColor="#FFF9A6" stopOpacity="1" />
                <stop offset="100%" stopColor="#FFB300" stopOpacity="0.9" />
              </linearGradient>

              {/* Soft Drop Shadow Filter for Tiers */}
              <filter id="cakeDropShadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#12061E" floodOpacity="0.65" />
              </filter>
            </defs>

            {/* ============================================================== */}
            {/* 1. CAKE STAND / PEDESTAL BASE                                  */}
            {/* ============================================================== */}
            <g id="cakeStand">
              {/* Floor Shadow */}
              <ellipse cx="230" cy="426" rx="195" ry="16" fill="#0E0517" opacity="0.7" />
              <ellipse cx="230" cy="425" rx="150" ry="10" fill="#08020E" opacity="0.5" />

              {/* Pedestal Foot Base */}
              <path
                d="M 180 422 C 180 412, 195 404, 215 402 L 245 402 C 265 404, 280 412, 280 422 C 280 426, 180 426, 180 422 Z"
                fill="url(#pedestalFootGrad)"
              />
              <ellipse cx="230" cy="422" rx="50" ry="4" fill="#6A4E16" />

              {/* Pedestal Stem / Column */}
              <path
                d="M 216 402 C 214 388, 212 376, 218 368 L 242 368 C 248 376, 246 388, 244 402 Z"
                fill="url(#pedestalFootGrad)"
              />

              {/* Pedestal Top Plate Rim (Gold Mirror Finish) */}
              <ellipse cx="230" cy="370" rx="180" ry="24" fill="url(#pedestalPlateGrad)" filter="url(#cakeDropShadow)" />
              {/* Upper Plate Inner Rim */}
              <ellipse cx="230" cy="368" rx="174" ry="21" fill="#FFFBF0" opacity="0.95" />
              <ellipse cx="230" cy="367" rx="168" ry="19" fill="#E6D3A3" opacity="0.7" />

              {/* Scalloped Gold & Crystal Pearl Rim along edge of plate */}
              {Array.from({ length: 28 }).map((_, i) => {
                const angle = (i / 28) * Math.PI;
                const px = 230 + 172 * Math.cos(angle);
                const py = 369 + 21 * Math.sin(angle);
                return (
                  <circle
                    key={`stand-bead-${i}`}
                    cx={px}
                    cy={py}
                    r="3.5"
                    fill="url(#goldBeadGrad)"
                    stroke="#FFF7D1"
                    strokeWidth="0.5"
                  />
                );
              })}
            </g>

            {/* ============================================================== */}
            {/* 2. BOTTOM TIER (LOWER DOUBLE-DECKER TIER)                      */}
            {/* ============================================================== */}
            <g id="bottomTier" filter="url(#cakeDropShadow)">
              {/* Tier Cylinder Body */}
              <path
                d="M 75 272
                   C 75 304, 144 328, 230 328
                   C 316 328, 385 304, 385 272
                   L 385 352
                   C 385 384, 316 408, 230 408
                   C 144 408, 75 384, 75 352
                   Z"
                fill="url(#bottomTierCylinderGrad)"
              />

              {/* Subtle vertical frosting striations / light sheen */}
              <path
                d="M 175 285 L 175 365 C 190 372, 210 375, 230 375 L 230 295 C 210 295, 190 292, 175 285 Z"
                fill="#FFFFFF"
                opacity="0.14"
              />
              <path
                d="M 230 295 L 230 375 C 255 375, 280 371, 300 363 L 300 283 C 280 291, 255 295, 230 295 Z"
                fill="#FFFFFF"
                opacity="0.22"
              />

              {/* Bottom Tier Top Ellipse Surface */}
              <ellipse cx="230" cy="272" rx="155" ry="28" fill="url(#bottomTierTopGrad)" />

              {/* Fondant Draped Baroque Swags (Lace Drapery) */}
              {/* Swag 1 (Left) */}
              <path
                d="M 85 285 Q 128 322 170 295"
                fill="none"
                stroke="url(#fondantSwagGrad)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 85 288 Q 128 328 170 298"
                fill="none"
                stroke="url(#topperGoldGrad)"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.9"
              />

              {/* Swag 2 (Center-Left) */}
              <path
                d="M 165 296 Q 230 338 295 296"
                fill="none"
                stroke="url(#fondantSwagGrad)"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
              <path
                d="M 165 300 Q 230 344 295 300"
                fill="none"
                stroke="url(#topperGoldGrad)"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.95"
              />

              {/* Swag 3 (Right) */}
              <path
                d="M 290 295 Q 332 322 375 285"
                fill="none"
                stroke="url(#fondantSwagGrad)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 290 298 Q 332 328 375 288"
                fill="none"
                stroke="url(#topperGoldGrad)"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.9"
              />

              {/* Lower Tier Base Pearl Garland Border (Hand-placed fondant pearls) */}
              {Array.from({ length: 32 }).map((_, i) => {
                const angle = (i / 32) * Math.PI;
                const bx = 230 + 153 * Math.cos(angle);
                const by = 352 + 28 * Math.sin(angle);
                return (
                  <circle
                    key={`btm-base-pearl-${i}`}
                    cx={bx}
                    cy={by}
                    r="4.2"
                    fill="url(#pearlSphereGrad)"
                    stroke="#FFFFFF"
                    strokeWidth="0.6"
                  />
                );
              })}

              {/* Lower Tier Upper Rim Pearl Border */}
              {Array.from({ length: 28 }).map((_, i) => {
                const angle = (i / 28) * Math.PI;
                const tx = 230 + 154 * Math.cos(angle);
                const ty = 272 + 27 * Math.sin(angle);
                return (
                  <circle
                    key={`btm-top-pearl-${i}`}
                    cx={tx}
                    cy={ty}
                    r="3.2"
                    fill="url(#pearlSphereGrad)"
                    stroke="#FFFFFF"
                    strokeWidth="0.5"
                  />
                );
              })}

              {/* Gold Leaf Flakes & Sugar Crystal Accents on Bottom Tier */}
              <polygon points="120,330 126,334 122,338 116,333" fill="url(#topperGoldGrad)" opacity="0.85" />
              <polygon points="195,348 202,352 198,356 191,351" fill="url(#topperGoldGrad)" opacity="0.9" />
              <polygon points="265,348 272,352 268,356 261,351" fill="url(#topperGoldGrad)" opacity="0.9" />
              <polygon points="340,330 346,334 342,338 336,333" fill="url(#topperGoldGrad)" opacity="0.85" />

              {/* Edible Handcrafted Sugar Flower Cluster 1 (Left Drape Junction) */}
              <g transform="translate(166, 296)">
                {/* Gold Leaf Accent */}
                <path d="M 0 0 C -8 -6 -12 -2 -8 6 Z" fill="url(#topperGoldGrad)" />
                {/* Outer Petals */}
                <circle cx="-5" cy="-2" r="5" fill="#F8DDF0" opacity="0.95" />
                <circle cx="4" cy="-3" r="5" fill="#EBD2F7" opacity="0.95" />
                <circle cx="0" cy="5" r="5" fill="#D8C7FF" opacity="0.95" />
                {/* Flower Rosebud Center */}
                <circle cx="0" cy="0" r="3.2" fill="#FFFFFF" stroke="#9B7BD3" strokeWidth="0.8" />
                <circle cx="0" cy="0" r="1.5" fill="url(#goldBeadGrad)" />
              </g>

              {/* Edible Handcrafted Sugar Flower Cluster 2 (Right Drape Junction) */}
              <g transform="translate(294, 296)">
                {/* Gold Leaf Accent */}
                <path d="M 0 0 C 8 -6 12 -2 8 6 Z" fill="url(#topperGoldGrad)" />
                {/* Outer Petals */}
                <circle cx="-4" cy="-3" r="5" fill="#EBD2F7" opacity="0.95" />
                <circle cx="5" cy="-2" r="5" fill="#F8DDF0" opacity="0.95" />
                <circle cx="0" cy="5" r="5" fill="#D8C7FF" opacity="0.95" />
                {/* Flower Rosebud Center */}
                <circle cx="0" cy="0" r="3.2" fill="#FFFFFF" stroke="#9B7BD3" strokeWidth="0.8" />
                <circle cx="0" cy="0" r="1.5" fill="url(#goldBeadGrad)" />
              </g>

              {/* Center Sugar Flower Blossom (Apex of Center Drape) */}
              <g transform="translate(230, 338)">
                <circle cx="-5" cy="-2" r="5.5" fill="#F8DDF0" />
                <circle cx="5" cy="-2" r="5.5" fill="#E8D2FA" />
                <circle cx="0" cy="5" r="5.5" fill="#D8C7FF" />
                <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" stroke="#9B7BD3" strokeWidth="0.8" />
                <circle cx="0" cy="0" r="1.6" fill="url(#goldBeadGrad)" />
              </g>
            </g>

            {/* ============================================================== */}
            {/* 3. TOP TIER (UPPER DOUBLE-DECKER TIER)                         */}
            {/* ============================================================== */}
            <g id="topTier" filter="url(#cakeDropShadow)">
              {/* Upper Tier Cylinder Body */}
              <path
                d="M 125 178
                   C 125 204, 172 222, 230 222
                   C 288 222, 335 204, 335 178
                   L 335 248
                   C 335 274, 288 292, 230 292
                   C 172 292, 125 274, 125 248
                   Z"
                fill="url(#topTierCylinderGrad)"
              />

              {/* Specular Fondant Highlights on Top Tier */}
              <path
                d="M 195 186 L 195 256 C 210 262, 222 264, 230 264 L 230 194 C 222 194, 210 191, 195 186 Z"
                fill="#FFFFFF"
                opacity="0.25"
              />
              <path
                d="M 230 194 L 230 264 C 248 264, 266 261, 280 254 L 280 184 C 266 191, 248 194, 230 194 Z"
                fill="#FFFFFF"
                opacity="0.35"
              />

              {/* Top Tier Top Surface Ellipse */}
              <ellipse cx="230" cy="178" rx="105" ry="21" fill="url(#topTierTopGrad)" />

              {/* Top Tier Base Pearl Border */}
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i / 24) * Math.PI;
                const bx = 230 + 104 * Math.cos(angle);
                const by = 248 + 21 * Math.sin(angle);
                return (
                  <circle
                    key={`top-base-pearl-${i}`}
                    cx={bx}
                    cy={by}
                    r="3.6"
                    fill="url(#pearlSphereGrad)"
                    stroke="#FFFFFF"
                    strokeWidth="0.5"
                  />
                );
              })}

              {/* Top Tier Upper Rim Pearl Border */}
              {Array.from({ length: 22 }).map((_, i) => {
                const angle = (i / 22) * Math.PI;
                const tx = 230 + 104 * Math.cos(angle);
                const ty = 178 + 20 * Math.sin(angle);
                return (
                  <circle
                    key={`top-top-pearl-${i}`}
                    cx={tx}
                    cy={ty}
                    r="2.8"
                    fill="url(#pearlSphereGrad)"
                    stroke="#FFFFFF"
                    strokeWidth="0.5"
                  />
                );
              })}

              {/* Elegant Royal Icing Gold Baroque Filigree Swirls on Top Tier */}
              <path
                d="M 145 208 Q 170 236 195 214 Q 215 198 230 216"
                fill="none"
                stroke="url(#topperGoldGrad)"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.9"
              />
              <path
                d="M 230 216 Q 245 198 265 214 Q 290 236 315 208"
                fill="none"
                stroke="url(#topperGoldGrad)"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.9"
              />

              {/* Cascading Sugar Rose Garland (Draping down left side of Top Tier) */}
              <g transform="translate(132, 218)">
                <path d="M 0 0 C -8 -10 -14 -6 -10 4 Z" fill="url(#topperGoldGrad)" />
                <circle cx="-3" cy="-2" r="6" fill="#F8DDF0" />
                <circle cx="4" cy="-2" r="5.5" fill="#EBD2F7" />
                <circle cx="0" cy="4" r="5.5" fill="#D8C7FF" />
                <circle cx="0" cy="0" r="3.2" fill="#FFFFFF" stroke="#9B7BD3" strokeWidth="0.7" />
                <circle cx="0" cy="0" r="1.4" fill="url(#goldBeadGrad)" />
              </g>

              <g transform="translate(142, 246)">
                <circle cx="-2" cy="-2" r="5" fill="#FAF0F8" />
                <circle cx="3" cy="-1" r="4.5" fill="#F8DDF0" />
                <circle cx="0" cy="3" r="4.5" fill="#E8D2FA" />
                <circle cx="0" cy="0" r="2.4" fill="#FFFFFF" />
                <circle cx="0" cy="0" r="1.2" fill="url(#goldBeadGrad)" />
              </g>

              {/* Top Tier Gold Leaf Flecks */}
              <polygon points="175,235 180,238 177,242 172,238" fill="url(#topperGoldGrad)" opacity="0.95" />
              <polygon points="285,235 290,238 287,242 282,238" fill="url(#topperGoldGrad)" opacity="0.95" />
            </g>

            {/* ============================================================== */}
            {/* 4. THREE ELEGANT CANDLES WITH REALISTIC MULTI-LAYER FLAMES     */}
            {/* ============================================================== */}
            <g id="candles">
              {/* ---------------- CANDLE 1 (LEFT) ---------------- */}
              <g transform="translate(178, 140)">
                {/* Candle Stand Socket (Golden Ring) */}
                <ellipse cx="0" cy="22" rx="5" ry="2" fill="url(#topperGoldGrad)" />
                {/* Candle Stick Body (Ivory & Lavender Spiral) */}
                <rect x="-3" y="-12" width="6" height="34" rx="2" fill="url(#candleSpiralGrad)" />
                {/* Spiral Gold Stripes */}
                <path d="M -3 -8 L 3 -4 M -3 0 L 3 4 M -3 8 L 3 12 M -3 16 L 3 20" stroke="url(#candleGoldStripe)" strokeWidth="1.4" />
                {/* Wick */}
                <line x1="0" y1="-12" x2="0" y2="-17" stroke="#2D2038" strokeWidth="1.2" strokeLinecap="round" />

                {/* Candle Flame 1 */}
                {candlesLit[0] && (
                  <g
                    className={
                      isBlowing
                        ? 'anim-flame-blow'
                        : 'anim-flame-flicker-1'
                    }
                    transform="translate(0, -17)"
                  >
                    {/* Outer Ambient Glow */}
                    <circle cx="0" cy="-12" r="18" fill="url(#flameOuterGrad)" opacity="0.75" />
                    {/* Main Teardrop Flame Body */}
                    <path
                      d="M 0 -24 C -5 -16, -6 -6, 0 0 C 6 -6, 5 -16, 0 -24 Z"
                      fill="url(#flameOuterGrad)"
                    />
                    {/* Inner Core Bright White/Yellow Flame */}
                    <path
                      d="M 0 -18 C -2.5 -12, -3 -4, 0 0 C 3 -4, 2.5 -12, 0 -18 Z"
                      fill="url(#flameInnerGrad)"
                    />
                  </g>
                )}

                {/* Smoke Wisp 1 */}
                {smokeVisible[0] && (
                  <g className="anim-smoke" transform="translate(0, -17)">
                    <path
                      d="M 0 0 Q 3 -8 0 -16 T 4 -32 T 0 -48"
                      fill="none"
                      stroke="#EADDFE"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                  </g>
                )}
              </g>

              {/* ---------------- CANDLE 2 (CENTER) ---------------- */}
              <g transform="translate(230, 132)">
                {/* Candle Stand Socket (Golden Ring) */}
                <ellipse cx="0" cy="24" rx="5.5" ry="2.2" fill="url(#topperGoldGrad)" />
                {/* Candle Stick Body (Taller Center Candle) */}
                <rect x="-3.5" y="-18" width="7" height="42" rx="2.5" fill="url(#candleSpiralGrad)" />
                {/* Spiral Gold Stripes */}
                <path d="M -3.5 -14 L 3.5 -10 M -3.5 -5 L 3.5 -1 M -3.5 4 L 3.5 8 M -3.5 13 L 3.5 17 M -3.5 22 L 3.5 26" stroke="url(#candleGoldStripe)" strokeWidth="1.5" />
                {/* Wick */}
                <line x1="0" y1="-18" x2="0" y2="-24" stroke="#2D2038" strokeWidth="1.3" strokeLinecap="round" />

                {/* Candle Flame 2 */}
                {candlesLit[1] && (
                  <g
                    className={
                      isBlowing
                        ? 'anim-flame-blow'
                        : 'anim-flame-flicker-2'
                    }
                    transform="translate(0, -24)"
                  >
                    {/* Outer Ambient Glow */}
                    <circle cx="0" cy="-14" r="22" fill="url(#flameOuterGrad)" opacity="0.8" />
                    {/* Main Teardrop Flame Body */}
                    <path
                      d="M 0 -28 C -6 -18, -7 -7, 0 0 C 7 -7, 6 -18, 0 -28 Z"
                      fill="url(#flameOuterGrad)"
                    />
                    {/* Inner Core Bright White/Yellow Flame */}
                    <path
                      d="M 0 -21 C -3.2 -14, -3.5 -5, 0 0 C 3.5 -5, 3.2 -14, 0 -21 Z"
                      fill="url(#flameInnerGrad)"
                    />
                  </g>
                )}

                {/* Smoke Wisp 2 */}
                {smokeVisible[1] && (
                  <g className="anim-smoke" transform="translate(0, -24)">
                    <path
                      d="M 0 0 Q -4 -10 0 -20 T -3 -40 T 2 -56"
                      fill="none"
                      stroke="#F8DDF0"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                  </g>
                )}
              </g>

              {/* ---------------- CANDLE 3 (RIGHT) ---------------- */}
              <g transform="translate(282, 140)">
                {/* Candle Stand Socket (Golden Ring) */}
                <ellipse cx="0" cy="22" rx="5" ry="2" fill="url(#topperGoldGrad)" />
                {/* Candle Stick Body */}
                <rect x="-3" y="-12" width="6" height="34" rx="2" fill="url(#candleSpiralGrad)" />
                {/* Spiral Gold Stripes */}
                <path d="M -3 -8 L 3 -4 M -3 0 L 3 4 M -3 8 L 3 12 M -3 16 L 3 20" stroke="url(#candleGoldStripe)" strokeWidth="1.4" />
                {/* Wick */}
                <line x1="0" y1="-12" x2="0" y2="-17" stroke="#2D2038" strokeWidth="1.2" strokeLinecap="round" />

                {/* Candle Flame 3 */}
                {candlesLit[2] && (
                  <g
                    className={
                      isBlowing
                        ? 'anim-flame-blow'
                        : 'anim-flame-flicker-3'
                    }
                    transform="translate(0, -17)"
                  >
                    {/* Outer Ambient Glow */}
                    <circle cx="0" cy="-12" r="18" fill="url(#flameOuterGrad)" opacity="0.75" />
                    {/* Main Teardrop Flame Body */}
                    <path
                      d="M 0 -24 C -5 -16, -6 -6, 0 0 C 6 -6, 5 -16, 0 -24 Z"
                      fill="url(#flameOuterGrad)"
                    />
                    {/* Inner Core Bright White/Yellow Flame */}
                    <path
                      d="M 0 -18 C -2.5 -12, -3 -4, 0 0 C 3 -4, 2.5 -12, 0 -18 Z"
                      fill="url(#flameInnerGrad)"
                    />
                  </g>
                )}

                {/* Smoke Wisp 3 */}
                {smokeVisible[2] && (
                  <g className="anim-smoke" transform="translate(0, -17)">
                    <path
                      d="M 0 0 Q 3 -9 -1 -18 T 3 -36 T -2 -50"
                      fill="none"
                      stroke="#EADDFE"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                  </g>
                )}
              </g>
            </g>

            {/* ============================================================== */}
            {/* 5. LUXURY METALLIC GOLDEN CAKE TOPPER                          */}
            {/* EXACT TEXT REQUIRED: "Happy Birthday Sweetie 😘"               */}
            {/* (NO "Nandani" on the topper as strictly requested)             */}
            {/* ============================================================== */}
            <g id="luxuryCakeTopper" className="anim-gold-topper">
              {/* Dual Gold Support Prongs inserting into cake top */}
              <line x1="165" y1="88" x2="165" y2="168" stroke="url(#topperGoldGrad)" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
              <line x1="295" y1="88" x2="295" y2="168" stroke="url(#topperGoldGrad)" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />

              {/* Romantic Acrylic Gold Backing Halo for crisp legibility */}
              <rect
                x="65"
                y="26"
                width="330"
                height="64"
                rx="32"
                fill="#21132F"
                fillOpacity="0.75"
                stroke="url(#topperGoldGrad)"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />

              {/* Topper Background Drop Shadow for depth */}
              <text
                x="230"
                y="67"
                textAnchor="middle"
                fontFamily="'Dancing Script', 'Caveat', cursive, serif"
                fontSize="27"
                fontWeight="700"
                fill="#190924"
                letterSpacing="0.4"
                opacity="0.9"
              >
                Happy Birthday Sweetie 😘
              </text>

              {/* Main Golden Cursive Metallic Foil Lettering */}
              <text
                x="230"
                y="65"
                textAnchor="middle"
                fontFamily="'Dancing Script', 'Caveat', cursive, serif"
                fontSize="27"
                fontWeight="700"
                fill="url(#topperGoldGrad)"
                stroke="#FFFFFF"
                strokeWidth="0.5"
                letterSpacing="0.4"
              >
                Happy Birthday Sweetie 😘
              </text>

              {/* Small Golden Stars on Topper Plate */}
              <text x="88" y="63" fontSize="13" fill="url(#topperGoldGrad)">✨</text>
              <text x="362" y="63" fontSize="13" fill="url(#topperGoldGrad)">✨</text>
            </g>
          </svg>
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE CONTROLS & STATUS MESSAGES                        */}
        {/* ============================================================== */}
        <div className="mt-4 sm:mt-6 flex flex-col items-center justify-center text-center">
          {/* Phase 1: Initial Prompt & Candle-Blowing Button */}
          {!allCandlesOut ? (
            <div className="flex flex-col items-center animate-fadeIn">
              {/* Exact Initial Prompt: "Make a wish, Sweetie! ✨" */}
              <p className="font-handwriting text-2xl sm:text-3xl text-[#F8DDF0] font-medium drop-shadow-[0_2px_10px_rgba(248,221,240,0.5)] mb-3">
                Make a wish, Sweetie! ✨
              </p>
              <p className="text-xs sm:text-sm text-[#D8C7FF]/80 max-w-sm mb-4">
                Close your eyes, make your deepest birthday wish in your heart, and blow out the candles...
              </p>

              {/* Exact Interactive Button: "Blow the Candles 💨" */}
              <button
                onClick={handleBlowCandles}
                disabled={isBlowing}
                className={`group relative inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full text-base font-semibold transition-all duration-300 shadow-[0_4px_25px_rgba(255,183,3,0.4)] hover:shadow-[0_6px_35px_rgba(255,183,3,0.65)] hover:scale-105 active:scale-95 cursor-pointer ${
                  isBlowing
                    ? 'bg-[#FFB703]/40 text-yellow-200 cursor-wait'
                    : 'bg-gradient-to-r from-[#FFB703] via-[#FFA200] to-[#FF80BF] text-[#21132F]'
                }`}
              >
                <span className="text-lg">💨</span>
                <span className="font-sans font-bold tracking-wide">
                  {isBlowing ? 'Blowing softly...' : 'Blow the Candles 💨'}
                </span>
                <Sparkles className="w-4 h-4 text-[#21132F] animate-spin" style={{ animationDuration: '4s' }} />
              </button>
            </div>
          ) : (
            /* Phase 2: Exact Celebration Message After Blowing: "Happy Birthday Sweetie! ❤️😘" */
            <div className="flex flex-col items-center animate-fadeIn py-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD700]/20 border border-[#FFD700]/50 text-[#FFD700] text-xs font-semibold mb-3 animate-bounce">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Wish sent to the stars! ✨</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>

              {/* Exact Message: "Happy Birthday Sweetie! ❤️😘" */}
              <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF4CC] via-[#FFD700] to-[#F8DDF0] drop-shadow-[0_4px_18px_rgba(255,215,0,0.6)] mb-2">
                Happy Birthday Sweetie! ❤️😘
              </h3>

              <p className="font-handwriting text-2xl sm:text-3xl text-[#F8DDF0] font-normal mt-1">
                May all your wishes and dreams bloom into reality.
              </p>

              <div className="flex items-center justify-center gap-2 mt-2 text-xs sm:text-sm text-[#D8C7FF]/80">
                <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
                <span>Blown with all Prajjwal's eternal love</span>
                <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
