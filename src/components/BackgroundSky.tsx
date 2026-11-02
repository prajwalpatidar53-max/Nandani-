import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

export const BackgroundSky: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    const starColors = ['#FFFFFF', '#D8C7FF', '#F8DDF0', '#C4B5FD', '#E9D5FF'];
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];

    const initStars = () => {
      stars = [];
      const count = Math.floor((width * height) / 3800);
      for (let i = 0; i < count; i++) {
        const baseAlpha = 0.2 + Math.random() * 0.7;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.6,
          alpha: baseAlpha,
          baseAlpha,
          twinkleSpeed: 0.015 + Math.random() * 0.035,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    const spawnShootingStar = () => {
      if (shootingStars.length < 2 && Math.random() < 0.015) {
        shootingStars.push({
          x: Math.random() * (width * 0.7),
          y: Math.random() * (height * 0.4),
          length: 80 + Math.random() * 100,
          speed: 8 + Math.random() * 7,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2, // ~45 deg
          alpha: 1,
          active: true,
        });
      }
    };

    initStars();

    let time = 0;
    const render = () => {
      time += 0.05;
      ctx.clearRect(0, 0, width, height);

      // Draw starry sky
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.alpha = s.baseAlpha + Math.sin(time * s.twinkleSpeed * 15 + i) * 0.25;
        const currentAlpha = Math.max(0.1, Math.min(1, s.alpha));

        ctx.fillStyle = s.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra twinkle cross on larger stars
        if (s.size > 1.8 && currentAlpha > 0.6) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x - s.size * 2, s.y);
          ctx.lineTo(s.x + s.size * 2, s.y);
          ctx.moveTo(s.x, s.y - s.size * 2);
          ctx.lineTo(s.x, s.y + s.size * 2);
          ctx.stroke();
        }
      }

      // Draw and update shooting stars
      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        if (!ss.active) {
          shootingStars.splice(i, 1);
          continue;
        }

        const headX = ss.x;
        const headY = ss.y;
        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
        grad.addColorStop(0, 'rgba(216, 199, 255, 0)');
        grad.addColorStop(0.8, 'rgba(216, 199, 255, 0.6)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 1)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.stroke();

        // Move
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.alpha -= 0.012;

        if (ss.x > width || ss.y > height || ss.alpha <= 0) {
          ss.active = false;
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Deep cosmic lavender background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#170B24] via-[#2D1B4E] to-[#12071E]" />

      {/* Dreamy nebula glow clouds */}
      <div
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-[#9B7BD3]/20 blur-[130px] animate-pulse pointer-events-none"
        style={{ animationDuration: '8s' }}
      />
      <div
        className="absolute top-1/3 -right-36 w-[650px] h-[650px] rounded-full bg-[#7C3AED]/18 blur-[160px] animate-pulse pointer-events-none"
        style={{ animationDuration: '11s', animationDelay: '2s' }}
      />
      <div
        className="absolute -bottom-40 left-1/4 w-[700px] h-[700px] rounded-full bg-[#D8C7FF]/15 blur-[150px] animate-pulse pointer-events-none"
        style={{ animationDuration: '9s', animationDelay: '4s' }}
      />

      {/* Twinkling starfield canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
