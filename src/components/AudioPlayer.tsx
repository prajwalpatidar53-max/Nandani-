import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/soundSynthesizer';

// Exact audio file path uploaded by user
const PRIMARY_AUDIO_SRC = '/assets/aistudio/536_Romantic_Piano_f1d6d672.wav';
const FALLBACK_AUDIO_SRC = '/audio/536_Romantic_Piano_f1d6d672.wav';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.3); // Initial volume: 30%
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const hasUserInteractedRef = useRef<boolean>(false);

  // Clear any ongoing fade
  const clearFade = () => {
    if (fadeIntervalRef.current !== null) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  // Fade-in audio smoothly over 3 seconds (3000ms)
  const fadeIn = (targetVol: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    clearFade();

    audio.volume = 0;
    const duration = 3000; // 3 seconds
    const intervalTime = 50;
    const steps = duration / intervalTime;
    const volIncrement = targetVol / steps;
    let currentVol = 0;

    fadeIntervalRef.current = window.setInterval(() => {
      currentVol = Math.min(targetVol, currentVol + volIncrement);
      if (audio) {
        audio.volume = isMuted ? 0 : currentVol;
      }
      if (currentVol >= targetVol) {
        clearFade();
      }
    }, intervalTime);
  };

  // Fade-out audio smoothly over 500ms when pausing
  const fadeOutAndPause = (callback: () => void) => {
    const audio = audioRef.current;
    if (!audio) {
      callback();
      return;
    }
    clearFade();

    const startVol = audio.volume;
    const duration = 500; // 0.5s fade out
    const intervalTime = 50;
    const steps = duration / intervalTime;
    const volDecrement = startVol / steps;
    let currentVol = startVol;

    fadeIntervalRef.current = window.setInterval(() => {
      currentVol = Math.max(0, currentVol - volDecrement);
      if (audio) {
        audio.volume = isMuted ? 0 : currentVol;
      }
      if (currentVol <= 0) {
        clearFade();
        audio.pause();
        audio.volume = volume; // Restore baseline for next play
        callback();
      }
    }, intervalTime);
  };

  // Play audio safely
  const startPlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        fadeIn(volume);
      })
      .catch(() => {
        // Fallback to secondary source or procedural ambient synthesizer if needed
        audio.src = FALLBACK_AUDIO_SRC;
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            fadeIn(volume);
          })
          .catch(() => {
            soundManager.startAmbient();
            setIsPlaying(true);
          });
      });
  };

  // Stop playback with fade-out
  const stopPlayback = () => {
    fadeOutAndPause(() => {
      soundManager.stopAmbient();
      setIsPlaying(false);
    });
  };

  // Initialize Audio instance once and persist throughout experience
  useEffect(() => {
    const audio = new Audio(PRIMARY_AUDIO_SRC);
    audio.loop = true; // Loop: Enabled
    audio.volume = 0.3; // Initial volume: 30%
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleError = () => {
      // If primary path fails, switch to fallback audio path
      if (audio.src.includes(PRIMARY_AUDIO_SRC)) {
        audio.src = FALLBACK_AUDIO_SRC;
        audio.load();
      }
    };

    audio.addEventListener('error', handleError);

    // Auto-start on first user interaction with the screen (per prompt requirements)
    const handleFirstInteraction = () => {
      if (hasUserInteractedRef.current) return;
      hasUserInteractedRef.current = true;

      // Start playback automatically on first gesture
      startPlayback();

      // Clean up event listeners after first trigger
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      clearFade();
      audio.pause();
      audio.removeEventListener('error', handleError);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      soundManager.stopAmbient();
    };
  }, []);

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playSparkle();

    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    clearFade();
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : val;
    }
    soundManager.setVolume(val);
    if (val === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    clearFade();
    if (audioRef.current) {
      audioRef.current.volume = nextMuted ? 0 : volume;
    }
    soundManager.toggleMute();
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      <div
        className={`backdrop-blur-xl bg-[#21132F]/85 border border-[#D8C7FF]/35 rounded-full shadow-[0_8px_32px_rgba(155,123,211,0.35)] transition-all duration-300 flex items-center p-2 gap-3 ${
          isExpanded ? 'pr-4 pl-2' : ''
        }`}
      >
        {/* Rotating Music Disc & Floating Play/Pause Button */}
        <button
          onClick={handlePlayToggle}
          className="relative group w-12 h-12 rounded-full bg-gradient-to-tr from-[#9B7BD3] via-[#7C3AED] to-[#D8C7FF] p-0.5 shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center overflow-hidden"
          title={isPlaying ? 'Pause romantic piano' : 'Play romantic piano'}
          aria-label={isPlaying ? 'Pause romantic piano' : 'Play romantic piano'}
        >
          {/* Animated Rotating Vinyl Disc */}
          <div
            className={`w-full h-full rounded-full bg-[#170B24] border border-[#D8C7FF]/40 flex items-center justify-center relative ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '6s' }}
          >
            {/* Concentric Vinyl Grooves */}
            <div className="absolute inset-1.5 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute inset-3 rounded-full border border-white/15 pointer-events-none" />

            {/* Disc Center Label */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#D8C7FF] to-[#F8DDF0] flex items-center justify-center shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full bg-[#21132F]" />
            </div>
          </div>

          {/* Center Play / Pause Icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md bg-black/20 group-hover:bg-black/40 transition-colors">
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </div>

          {/* Subtle Glowing Pulse Indicator */}
          {isPlaying && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#F8DDF0] rounded-full animate-ping pointer-events-none" />
          )}
        </button>

        {/* Click to expand/collapse controls */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer flex flex-col justify-center min-w-0 pr-1"
        >
          <div className="flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-[#D8C7FF]" />
            <span className="text-xs font-semibold text-[#D8C7FF] truncate max-w-[130px]">
              Romantic Piano 💜
            </span>
            <Sparkles className="w-3 h-3 text-[#F8DDF0] opacity-80" />
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            {/* Soft Equalizer Bars */}
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
            <span className="text-[10px] text-white/70">
              {isPlaying ? `${Math.round(volume * 100)}%` : 'Tap to Play'}
            </span>
          </div>
        </div>

        {/* Expanded Volume & Mute Controls */}
        {isExpanded && (
          <div className="flex items-center gap-2 pl-2 border-l border-white/15 animate-fadeIn">
            <button
              onClick={handleMuteToggle}
              className="text-[#D8C7FF] hover:text-white transition-colors p-1"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
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
              aria-label="Volume slider"
            />
          </div>
        )}
      </div>
    </div>
  );
};
