import { TransitionType, ReasonItem } from '../types';

export const ALL_TRANSITIONS: TransitionType[] = [
  'portal',
  'heart-expansion',
  'curtain',
  'envelope',
  'page-turn',
  'cloud-reveal',
  'star-explosion',
  'butterfly-flight',
  'petal-storm',
  'polaroid-zoom',
  'cinematic-fade',
  'purple-sweep',
  'dreamy-blur',
  'heart-mask',
  'shooting-star',
  'particle-dissolve',
  'card-flip-3d',
  'aurora-wave',
  'circular-ripple',
  'firework-burst',
];

/**
 * Intelligently picks a transition effect avoiding repetition of the current one.
 */
export function getNextTransition(currentTransition?: TransitionType): TransitionType {
  const candidates = ALL_TRANSITIONS.filter(t => t !== currentTransition);
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex] || 'portal';
}

/**
 * Calculates progress percentage for opened items or current progress.
 */
export function calculateOpenedPercentage(opened: number | number[], totalCount: number = 100): number {
  if (totalCount <= 0) return 0;
  const count = typeof opened === 'number' ? opened : new Set(opened).size;
  return Math.min(100, Math.max(0, Math.round((count / totalCount) * 100)));
}

/**
 * Filters reasons by selected theme and search term.
 */
export function filterReasons(
  reasons: ReasonItem[],
  activeTheme: string,
  searchQuery: string
): ReasonItem[] {
  const query = searchQuery.trim().toLowerCase();
  return reasons.filter(r => {
    const themeStr = r.theme || r.category || '';
    const matchesTheme = activeTheme === 'All' || themeStr === activeTheme;
    const matchesQuery =
      !query ||
      r.text.toLowerCase().includes(query) ||
      r.id.toString() === query ||
      themeStr.toLowerCase().includes(query);
    return matchesTheme && matchesQuery;
  });
}

/**
 * Evaluates quiz answer and returns affectionate feedback.
 */
export function evaluateQuizAnswer(
  selectedIndex: number,
  correctIndex: number,
  sweetMessage: string = "Correct, my love! You know us so well! 💜"
): { isCorrect: boolean; response: string } {
  if (selectedIndex === correctIndex) {
    return {
      isCorrect: true,
      response: sweetMessage,
    };
  }
  return {
    isCorrect: false,
    response: "Aww almost, but you know the right answer in your heart! Try again sweetheart 💜",
  };
}

/**
 * Checks if all gift boxes are opened.
 */
export function areAllGiftsOpened(openedGiftIds: number[] | Set<number>, totalGifts: number = 5): boolean {
  const size = openedGiftIds instanceof Set ? openedGiftIds.size : new Set(openedGiftIds).size;
  return size >= totalGifts;
}
