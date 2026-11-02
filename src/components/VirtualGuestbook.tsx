import React, { useState, useEffect } from 'react';
import { GuestWish, INITIAL_GUEST_WISHES, validateWish, createWish } from '../utils/guestbookLogic';
import { Sparkles, Heart, Plus, X, MessageSquare, Send } from 'lucide-react';
import { soundManager } from '../utils/soundSynthesizer';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'nandani_guestbook_wishes';
const EMOJI_OPTIONS = ['💜', '🎂', '✨', '🌸', '💌', '🎈', '💫', '💖'];

export const VirtualGuestbook: React.FC = () => {
  const [wishes, setWishes] = useState<GuestWish[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeWish, setActiveWish] = useState<GuestWish | null>(null);

  // Form states
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('💜');
  const [formError, setFormError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWishes(parsed);
          return;
        }
      }
    } catch {}
    setWishes(INITIAL_GUEST_WISHES);
  }, []);

  // Save to localStorage when wishes change
  const saveWishes = (newWishes: GuestWish[]) => {
    setWishes(newWishes);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newWishes));
    } catch {}
  };

  const handleOpenModal = () => {
    soundManager.playSparkle();
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateWish(name, message);
    if (!validation.isValid) {
      setFormError(validation.error || 'Please fill in the required fields.');
      return;
    }

    const newWish = createWish(name, message, selectedEmoji);
    const updated = [newWish, ...wishes];
    saveWishes(updated);

    // Audio & Confetti burst
    soundManager.playCelebrationChord();
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D8C7FF', '#F8DDF0', '#9B7BD3', '#FFFFFF'],
      });
    } catch {}

    // Reset and close
    setName('');
    setMessage('');
    setSelectedEmoji('💜');
    setFormError(null);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4 select-none">
      {/* Guestbook Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D8C7FF]/30 text-xs text-[#D8C7FF] mb-3">
          <MessageSquare className="w-3.5 h-3.5 text-[#F8DDF0]" />
          <span>Virtual Birthday Guestbook</span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
          Floating Wishes for Nandani 💌
        </h3>
        <p className="font-sans text-xs sm:text-sm text-[#D8C7FF]/80 max-w-lg mx-auto">
          Leave an affectionate birthday wish for Nandani that drifts softly across her birthday galaxy.
        </p>

        {/* Action Button to Open Form */}
        <div className="mt-5">
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#9B7BD3] via-[#D8C7FF] to-[#F8DDF0] text-[#21132F] font-serif font-bold text-sm shadow-[0_8px_25px_rgba(216,199,255,0.35)] hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 text-[#21132F]" />
            <span>Leave a Birthday Wish ✨</span>
          </button>
        </div>
      </div>

      {/* Floating Wishes Cloud / Constellation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
        {wishes.map((wish, index) => {
          const delays = ['0s', '1.2s', '0.6s', '1.8s', '0.9s', '1.5s'];
          const delay = delays[index % delays.length];

          return (
            <div
              key={wish.id}
              onClick={() => {
                soundManager.playSparkle();
                setActiveWish(wish);
              }}
              className="cursor-pointer group relative backdrop-blur-xl bg-[#21132F]/80 border border-[#D8C7FF]/30 rounded-2xl p-4 shadow-lg hover:border-[#D8C7FF] hover:shadow-[0_10px_30px_rgba(216,199,255,0.25)] transition-all duration-300 hover:scale-105 animate-float flex flex-col justify-between"
              style={{ animationDelay: delay, animationDuration: '6s' }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{wish.emoji}</span>
                  <span className="text-[10px] text-[#D8C7FF]/60 font-sans">{wish.timestamp}</span>
                </div>
                <p className="font-handwriting text-lg text-white group-hover:text-[#F8DDF0] transition-colors line-clamp-3 leading-snug">
                  "{wish.message}"
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#D8C7FF]">
                <span className="font-serif font-semibold truncate max-w-[150px]">
                  — {wish.name}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#F8DDF0] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to Write a New Wish */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#12071E]/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-gradient-to-b from-[#2D1B4E] to-[#180D24] border-2 border-[#D8C7FF]/60 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💌</span>
              <h4 className="font-serif text-xl font-bold text-white">Wish Nandani A Happy Birthday</h4>
            </div>
            <p className="text-xs text-[#D8C7FF]/75 mb-5 font-sans">
              Your words will float into her birthday sky to make 3 November even more unforgettable.
            </p>

            <form onSubmit={handleSubmitWish} className="space-y-4">
              {/* Sender Name */}
              <div>
                <label className="block text-xs font-serif font-semibold text-[#D8C7FF] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  maxLength={30}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Prajjwal, Maya, A Well-Wisher..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#21132F]/80 border border-[#D8C7FF]/30 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-hidden focus:border-[#D8C7FF] transition-all"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-serif font-semibold text-[#D8C7FF]">
                    Your Birthday Wish
                  </label>
                  <span className="text-[10px] text-[#D8C7FF]/60">{message.length}/200</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a sweet message, blessing, or loving thought..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#21132F]/80 border border-[#D8C7FF]/30 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-hidden focus:border-[#D8C7FF] transition-all resize-none"
                  required
                />
              </div>

              {/* Emoji Sticker Picker */}
              <div>
                <label className="block text-xs font-serif font-semibold text-[#D8C7FF] mb-1.5">
                  Choose a Wish Sticker
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {EMOJI_OPTIONS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => {
                        soundManager.playSparkle();
                        setSelectedEmoji(em);
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform ${
                        selectedEmoji === em
                          ? 'bg-[#D8C7FF] scale-110 shadow-md'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {formError && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-400/30 px-3 py-1.5 rounded-xl">
                  {formError}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#9B7BD3] via-[#D8C7FF] to-[#F8DDF0] text-[#21132F] font-serif font-bold text-sm shadow-lg hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-[#21132F]" />
                <span>Release Wish Into The Galaxy ✨</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal to Read a Specific Full Wish */}
      {activeWish && (
        <div
          className="fixed inset-0 z-50 bg-[#12071E]/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveWish(null)}
        >
          <div
            className="bg-gradient-to-b from-[#2D1B4E] to-[#180D24] border-2 border-[#D8C7FF] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveWish(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-5xl mb-3 inline-block animate-bounce">{activeWish.emoji}</span>

            <p className="font-handwriting text-2xl sm:text-3xl text-[#F8DDF0] leading-relaxed my-4">
              "{activeWish.message}"
            </p>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#D8C7FF]/80">
              <span className="font-serif font-bold text-white">— {activeWish.name}</span>
              <span>{activeWish.timestamp}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
