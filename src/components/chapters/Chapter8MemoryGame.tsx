import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../../data/universeData';
import { evaluateQuizAnswer } from '../../utils/universeLogic';
import { Sparkles, Heart, HelpCircle, Check, Award, RotateCcw } from 'lucide-react';
import { soundManager } from '../../utils/soundSynthesizer';
import confetti from 'canvas-confetti';

interface Chapter8Props {
  onNextChapter: () => void;
}

export const Chapter8MemoryGame: React.FC<Chapter8Props> = ({ onNextChapter }) => {
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealedFeedback, setRevealedFeedback] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentQIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (revealedFeedback) return;
    const isCorrect = evaluateQuizAnswer(optionIndex, currentQ.correctAnswer);
    setSelectedAnswers((prev) => ({ ...prev, [currentQIndex]: optionIndex }));
    setRevealedFeedback(true);

    if (isCorrect) {
      soundManager.playCelebrationChord();
      setScore((prev) => prev + 1);
    } else {
      soundManager.playHeartPop();
    }
  };

  const handleNextQuestion = () => {
    soundManager.playSparkle();
    setRevealedFeedback(false);

    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      soundManager.playCelebrationChord();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D8C7FF', '#F8DDF0', '#9B7BD3', '#FFD700'],
        });
      } catch {}
    }
  };

  const handleRestartQuiz = () => {
    soundManager.playSparkle();
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setRevealedFeedback(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="relative min-h-[92vh] px-4 py-16 max-w-3xl mx-auto flex flex-col items-center justify-center">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D8C7FF]/30 text-xs text-[#D8C7FF] mb-4">
          <HelpCircle className="w-3.5 h-3.5 text-[#F8DDF0]" />
          <span>Chapter 8 — Our Sweet Trivia</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          The Memory Game 🔮
        </h2>
        <p className="font-sans text-sm md:text-base text-[#D8C7FF]/80 max-w-xl mx-auto">
          How well does Nandani know how deeply she is loved? Let’s put our memories to the test!
        </p>
      </div>

      {!quizFinished ? (
        <div className="w-full backdrop-blur-xl bg-[#21132F]/85 border border-[#D8C7FF]/40 rounded-3xl p-6 md:p-10 shadow-2xl relative">
          {/* Question progress */}
          <div className="flex items-center justify-between text-xs text-[#D8C7FF] mb-6 border-b border-white/10 pb-3 font-serif">
            <span>
              Question {currentQIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span className="flex items-center gap-1 font-sans">
              <Heart className="w-3.5 h-3.5 text-[#F8DDF0] fill-current" />
              Love Score: {score}
            </span>
          </div>

          {/* Question Text */}
          <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-6">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQIndex] === idx;
              const isCorrect = idx === currentQ.correctAnswer;

              let btnStyle = 'bg-white/5 border-white/10 hover:bg-white/10 text-white';
              if (revealedFeedback) {
                if (isCorrect) {
                  btnStyle = 'bg-green-500/20 border-green-400 text-white shadow-[0_0_15px_rgba(74,222,128,0.3)]';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-red-500/20 border-red-400 text-white/80';
                } else {
                  btnStyle = 'bg-white/5 border-transparent text-white/40';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={revealedFeedback}
                  className={`w-full p-4 rounded-2xl border text-left text-sm md:text-base font-sans transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-serif font-bold text-[#D8C7FF]">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </span>
                  {revealedFeedback && isCorrect && <Check className="w-5 h-5 text-green-400" />}
                </button>
              );
            })}
          </div>

          {/* Feedback section when revealed */}
          {revealedFeedback && (
            <div className="p-4 rounded-2xl bg-[#9B7BD3]/20 border border-[#D8C7FF]/30 text-center animate-fadeIn mb-6">
              <p className="font-handwriting text-2xl text-[#F8DDF0] mb-1">
                {selectedAnswers[currentQIndex] === currentQ.correctAnswer
                  ? 'Spot on, my love! 💜'
                  : 'You are always adorable! 💜'}
              </p>
              <p className="font-sans text-xs text-[#D8C7FF]/90">{currentQ.sweetFeedback}</p>
            </div>
          )}

          {/* Next Button */}
          {revealedFeedback && (
            <div className="text-right">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#9B7BD3] to-[#D8C7FF] text-[#21132F] font-serif font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>{currentQIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished View */
        <div className="w-full backdrop-blur-xl bg-[#21132F]/85 border border-[#D8C7FF]/40 rounded-3xl p-8 md:p-12 shadow-2xl text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#9B7BD3] to-[#F8DDF0] text-[#21132F] flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl animate-bounce">
            <Award className="w-10 h-10 text-[#21132F]" />
          </div>

          <h3 className="font-serif text-3xl font-bold text-white mb-2">
            100% Love Guaranteed! 💜
          </h3>
          <p className="font-handwriting text-2xl md:text-3xl text-[#F8DDF0] mb-6">
            You scored {score} of {QUIZ_QUESTIONS.length}! But regardless of trivia, you already hold
            Prajjwal's whole heart.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={handleRestartQuiz}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-[#D8C7FF] text-xs font-semibold flex items-center gap-2 border border-white/10"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>

            <button
              onClick={() => {
                soundManager.playSparkle();
                onNextChapter();
              }}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#9B7BD3] via-[#D8C7FF] to-[#F8DDF0] text-[#21132F] font-serif font-bold text-base shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Enter Chapter 9: The Final Universe</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
