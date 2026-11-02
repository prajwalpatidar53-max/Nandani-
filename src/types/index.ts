export type ChapterId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface PhotoMemory {
  id: string;
  url: string;
  src: string;
  title: string;
  caption: string;
  date: string;
  tag: 'favorite' | 'candid' | 'romantic' | 'playful' | 'celebration';
  isPortrait?: boolean;
  isFavorite?: boolean;
  defaultRotation?: number; // e.g. 90 for rotated snaps
}

export type TransitionType =
  | 'portal'
  | 'heart-expansion'
  | 'curtain'
  | 'envelope'
  | 'page-turn'
  | 'cloud-reveal'
  | 'star-explosion'
  | 'butterfly-flight'
  | 'petal-storm'
  | 'polaroid-zoom'
  | 'cinematic-fade'
  | 'purple-sweep'
  | 'dreamy-blur'
  | 'heart-mask'
  | 'shooting-star'
  | 'particle-dissolve'
  | 'card-flip-3d'
  | 'aurora-wave'
  | 'circular-ripple'
  | 'firework-burst';

export interface ReasonItem {
  id: number;
  theme:
    | 'Her Smile'
    | 'Her Eyes'
    | 'Her Personality'
    | 'Her Kindness'
    | 'Her Habits'
    | 'Her Laughter'
    | 'Her Way of Talking'
    | 'Her Presence'
    | 'Her Little Gestures'
    | 'The Happiness She Brings';
  category?: string;
  title?: string;
  text: string;
  icon?: string;
  iconName?: string;
}

export interface PromiseItem {
  id: number;
  title: string;
  promise: string;
  description?: string;
  category: string;
  icon: string;
}

export interface GiftBoxItem {
  id: number;
  boxTitle: string;
  ribbonColor: string;
  giftType: 'message' | 'compliment' | 'photo' | 'letter' | 'mystery';
  type?: string;
  title: string;
  content: string;
  icon?: string;
  photoUrl?: string;
  photoTargetId?: string;
  animationStyle: 'bounce-open' | 'lid-fly' | 'sparkle-burst' | 'ribbon-untie' | 'portal-unfold';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  correctAnswer?: number;
  sweetMessage: string;
  sweetFeedback?: string;
  hint?: string;
}
