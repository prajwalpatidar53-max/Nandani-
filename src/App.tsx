import React, { useState, useEffect, useCallback } from 'react';
import { ChapterId, TransitionType } from './types';
import { getNextTransition, calculateOpenedPercentage } from './utils/universeLogic';
import { UNIVERSE_PHOTOS } from './data/universeData';
import { BackgroundSky } from './components/BackgroundSky';
import { AudioPlayer } from './components/AudioPlayer';
import { Navbar } from './components/Navbar';
import { TransitionOverlay } from './components/TransitionOverlay';
import { Lightbox } from './components/Lightbox';

// Chapters
import { Chapter1SecretWorld } from './components/chapters/Chapter1SecretWorld';
import { Chapter2BirthdayCelebration } from './components/chapters/Chapter2BirthdayCelebration';
import { Chapter3PhotoUniverse } from './components/chapters/Chapter3PhotoUniverse';
import { Chapter4Letter } from './components/chapters/Chapter4Letter';
import { Chapter5HundredReasons } from './components/chapters/Chapter5HundredReasons';
import { Chapter6Promises } from './components/chapters/Chapter6Promises';
import { Chapter7SurpriseBoxes } from './components/chapters/Chapter7SurpriseBoxes';
import { Chapter8MemoryGame } from './components/chapters/Chapter8MemoryGame';
import { Chapter9FinalUniverse } from './components/chapters/Chapter9FinalUniverse';

export default function App() {
  const [currentChapter, setCurrentChapter] = useState<ChapterId>(1);
  const [lightboxPhotoId, setLightboxPhotoId] = useState<string | null>(null);

  // Transition engine state
  const [transitionState, setTransitionState] = useState<{
    isActive: boolean;
    type: TransitionType;
    targetChapter: ChapterId;
  }>({
    isActive: false,
    type: 'portal',
    targetChapter: 1,
  });

  const [lastTransition, setLastTransition] = useState<TransitionType | undefined>(undefined);

  // Trigger chapter transition with random or contextual effect
  const navigateToChapter = useCallback(
    (target: ChapterId) => {
      if (target === currentChapter && !transitionState.isActive) return;
      const nextType = getNextTransition(lastTransition);
      setLastTransition(nextType);

      setTransitionState({
        isActive: true,
        type: nextType,
        targetChapter: target,
      });

      // Swap the active chapter component midway through the transition
      setTimeout(() => {
        setCurrentChapter(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 420);
    },
    [currentChapter, lastTransition, transitionState.isActive]
  );

  // Finish transition
  const handleTransitionComplete = () => {
    setTransitionState((prev) => ({ ...prev, isActive: false }));
  };

  // Listen for lightbox custom events (e.g. from next/prev photo)
  useEffect(() => {
    const handleLightboxSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      if (customEvent.detail && customEvent.detail.id) {
        setLightboxPhotoId(customEvent.detail.id);
      }
    };
    window.addEventListener('open-lightbox-photo', handleLightboxSelect);
    return () => window.removeEventListener('open-lightbox-photo', handleLightboxSelect);
  }, []);

  const progressPercent = calculateOpenedPercentage(currentChapter, 9);

  return (
    <div className="min-h-screen text-white relative selection:bg-[#9B7BD3] selection:text-white overflow-x-hidden font-sans">
      {/* Dynamic Starry Canvas Sky & Nebula Background */}
      <BackgroundSky />

      {/* Floating Persistent Audio Player */}
      <AudioPlayer />

      {/* Universal Top Glass Navbar & Universe Map */}
      <Navbar
        currentChapter={currentChapter}
        onSelectChapter={navigateToChapter}
        progressPercent={progressPercent}
      />

      {/* 20 Distinct Transition Overlay System */}
      <TransitionOverlay
        isActive={transitionState.isActive}
        transitionType={transitionState.type}
        onComplete={handleTransitionComplete}
      />

      {/* High-Resolution Photo Lightbox Modal */}
      {lightboxPhotoId && (
        <Lightbox
          photos={UNIVERSE_PHOTOS}
          currentPhotoId={lightboxPhotoId}
          onClose={() => setLightboxPhotoId(null)}
        />
      )}

      {/* Main Chapter Content Container */}
      <main className="relative z-10 pt-16 md:pt-20 pb-24 transition-opacity duration-300">
        {currentChapter === 1 && (
          <Chapter1SecretWorld onEnter={() => navigateToChapter(2)} />
        )}

        {currentChapter === 2 && (
          <Chapter2BirthdayCelebration onDiscoverSurprises={() => navigateToChapter(3)} />
        )}

        {currentChapter === 3 && (
          <Chapter3PhotoUniverse
            onPhotoClick={(id) => setLightboxPhotoId(id)}
            onNextChapter={() => navigateToChapter(4)}
          />
        )}

        {currentChapter === 4 && (
          <Chapter4Letter onNextChapter={() => navigateToChapter(5)} />
        )}

        {currentChapter === 5 && (
          <Chapter5HundredReasons onNextChapter={() => navigateToChapter(6)} />
        )}

        {currentChapter === 6 && (
          <Chapter6Promises onNextChapter={() => navigateToChapter(7)} />
        )}

        {currentChapter === 7 && (
          <Chapter7SurpriseBoxes
            onPhotoClick={(id) => setLightboxPhotoId(id)}
            onNextChapter={() => navigateToChapter(8)}
          />
        )}

        {currentChapter === 8 && (
          <Chapter8MemoryGame onNextChapter={() => navigateToChapter(9)} />
        )}

        {currentChapter === 9 && (
          <Chapter9FinalUniverse
            onPhotoClick={(id) => setLightboxPhotoId(id)}
            onRestart={() => navigateToChapter(1)}
            onOpenMap={() => {
              // Open Universe map via Navbar or trigger first chapter
              navigateToChapter(1);
            }}
          />
        )}
      </main>

      {/* Subtle footer */}
      <footer className="relative z-10 text-center py-6 text-xs text-[#D8C7FF]/50 border-t border-white/5 select-none">
        <p>The Universe of Nandani 💜 • Handcrafted with all my love by Prajjwal</p>
        <p className="text-[10px] text-white/30 mt-1">3 November • Happy Birthday Nandani</p>
      </footer>
    </div>
  );
}
