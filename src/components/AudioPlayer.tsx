import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/soundSynthesizer';

interface AudioPlayerProps {
  autoStartPrompt?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [usingSynthesizer, setUsingSynthesizer] = useState<boolean>(false);

  useEffect(() => {
    // Attempt to load /audio/romantic-music.mp3
    const audio = new Audio('/audio/romantic-music.mp3');
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    const handleError = () => {
      // If external mp3 is missing, smoothly fall back to our procedural synthesizer
      setUsingSynthesizer(true);
    };

    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('error', handleError);
      soundManager.stopAmbient();
    };
  }, []);

  const handlePlayToggle = () => {
    soundManager.playSparkle();

    if (isPlaying) {
      if (audioRef.current && !usingSynthesizer) {
        audioRef.current.pause();
      }
      soundManager.stopAmbient();
      setIsPlaying(false);
    } else {
      if (audioRef.current && !usingSynthesizer) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay restriction or 404, fallback to synthesizer
            setUsingSynthesizer(true);
            soundManager.startAmbient();
            setIsPlaying(true);
          });
      } else {
        soundManager.startAmbient();
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    soundManager.setVolume(val);
    if (val === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
    soundManager.toggleMute();
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      <div
        className={`backdrop-blur-md bg-[#21132F]/80 border border-[#D8C7FF]/30 rounded-2xl shadow-[0_8px_32px_rgba(155,123,211,0.25)] transition-all duration-300 flex items-center p-2.5 gap-3 ${
          isExpanded ? 'w-72' : 'w-auto'
        }`}
      >
        {/* Play / Pause button */}
        <button
          onClick={handlePlayToggle}
          className="relative group w-11 h-11 rounded-xl bg-gradient-to-tr from-[#9B7BD3] to-[#D8C7FF] text-[#21132F] flex items-center justify-center font-bold shadow-md hover:scale-105 active:scale-95 transition-transform"
          title={isPlaying ? 'Pause romantic melody' : 'Play romantic melody'}
          aria-label={isPlaying ? 'Pause romantic melody' : 'Play romantic melody'}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          {isPlaying && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-pastel-pink rounded-full animate-ping pointer-events-none" />
          )}
        </button>

        {/* Melody Info & Equalizer */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer flex flex-col justify-center min-w-0 pr-1"
        >
          <div className="flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-[#D8C7FF]" />
            <span className="text-xs font-semibold text-[#D8C7FF] truncate max-w-[130px]">
              {isPlaying ? 'Prajjwal & Nandani 💜' : 'Romantic Melody'}
            </span>
            <Sparkles className="w-3 h-3 text-[#F8DDF0] opacity-80" />
          </div>

          <div className="flex items-center gap-1 mt-1">
            {/* Visualizer bars */}
            <div className="flex items-end gap-0.5 h-3">
              {[0.4, 0.9, 0.6, 1, 0.7].map((heightRatio, i) => (
                <div
                  key={i}
                  className={`w-0.5 bg-[#D8C7FF] rounded-full transition-all duration-300 ${
                    isPlaying ? 'animate-pulse' : 'h-1'
                  }`}
                  style={{
                    height: isPlaying ? `${heightRatio * 12}px` : '4px',
                    animationDuration: `${0.4 + i * 0.15}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] text-white/60 ml-1.5">
              {isPlaying ? (usingSynthesizer ? 'Music Box Live' : 'Playing') : 'Tap to Play'}
            </span>
          </div>
        </div>

        {/* Expanded Volume Controls */}
        {isExpanded && (
          <div className="flex items-center gap-2 pl-2 border-l border-white/10 animate-fadeIn">
            <button
              onClick={handleMuteToggle}
              className="text-[#D8C7FF] hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1.5 accent-[#D8C7FF] bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};
