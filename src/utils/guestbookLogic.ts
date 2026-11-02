export interface GuestWish {
  id: string;
  name: string;
  message: string;
  emoji: string;
  timestamp: string;
  color?: string;
}

export const INITIAL_GUEST_WISHES: GuestWish[] = [
  {
    id: 'wish-1',
    name: 'Prajjwal',
    message: 'To the girl who holds my whole heart: Happy Birthday my love! You deserve every drop of happiness in this universe.',
    emoji: '💜',
    timestamp: 'Just now',
    color: '#D8C7FF',
  },
  {
    id: 'wish-2',
    name: 'With Love',
    message: 'May this 3 November be filled with endless smiles, warmth, and laughter. Happy Birthday Nandani!',
    emoji: '🎂',
    timestamp: 'Today',
    color: '#F8DDF0',
  },
  {
    id: 'wish-3',
    name: 'The Stars',
    message: 'Shining a little brighter today just in honor of Nandani being born ✨',
    emoji: '✨',
    timestamp: 'Today',
    color: '#E9D5FF',
  },
];

export function validateWish(name: string, message: string): { isValid: boolean; error?: string } {
  const trimmedName = name.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName) {
    return { isValid: false, error: 'Please enter your name.' };
  }
  if (trimmedName.length > 30) {
    return { isValid: false, error: 'Name must be 30 characters or less.' };
  }
  if (!trimmedMessage) {
    return { isValid: false, error: 'Please write a short birthday wish.' };
  }
  if (trimmedMessage.length > 200) {
    return { isValid: false, error: 'Wish must be 200 characters or less.' };
  }

  return { isValid: true };
}

export function createWish(name: string, message: string, emoji: string = '💜'): GuestWish {
  const colors = ['#D8C7FF', '#F8DDF0', '#C4B5FD', '#E9D5FF', '#FCE7F3'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return {
    id: `wish-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: name.trim(),
    message: message.trim(),
    emoji,
    timestamp: 'Just now',
    color: randomColor,
  };
}
