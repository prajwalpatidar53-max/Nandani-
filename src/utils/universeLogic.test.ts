import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_TRANSITIONS,
  getNextTransition,
  calculateOpenedPercentage,
  filterReasons,
  evaluateQuizAnswer,
  areAllGiftsOpened,
} from './universeLogic';
import { ReasonItem } from '../types';

test('ALL_TRANSITIONS contains at least 20 distinct effects', () => {
  assert.equal(ALL_TRANSITIONS.length >= 20, true);
  const uniqueSet = new Set(ALL_TRANSITIONS);
  assert.equal(uniqueSet.size, ALL_TRANSITIONS.length);
});

test('getNextTransition avoids immediate repetition', () => {
  const current = 'portal';
  for (let i = 0; i < 20; i++) {
    const next = getNextTransition(current);
    assert.notEqual(next, current);
    assert.equal(ALL_TRANSITIONS.includes(next), true);
  }
});

test('calculateOpenedPercentage returns correct clamped percentage', () => {
  assert.equal(calculateOpenedPercentage([], 100), 0);
  assert.equal(calculateOpenedPercentage([1, 2, 3, 4, 5], 100), 5);
  // duplicates shouldn't count twice
  assert.equal(calculateOpenedPercentage([1, 1, 2, 2], 100), 2);
  assert.equal(calculateOpenedPercentage(Array.from({ length: 100 }, (_, i) => i + 1), 100), 100);
  // number input
  assert.equal(calculateOpenedPercentage(1, 9), 11);
  assert.equal(calculateOpenedPercentage(9, 9), 100);
});

test('filterReasons filters by theme and search', () => {
  const mockReasons: ReasonItem[] = [
    { id: 1, theme: 'Her Smile', text: 'Your morning smile lights up the sky.' },
    { id: 2, theme: 'Her Eyes', text: 'The twinkle in your eyes is mesmerizing.' },
    { id: 3, theme: 'Her Smile', text: 'How you smile whenever you see me.' },
  ];

  const allFiltered = filterReasons(mockReasons, 'All', '');
  assert.equal(allFiltered.length, 3);

  const smileOnly = filterReasons(mockReasons, 'Her Smile', '');
  assert.equal(smileOnly.length, 2);

  const searched = filterReasons(mockReasons, 'All', 'twinkle');
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, 2);
});

test('evaluateQuizAnswer validates correct and incorrect answers', () => {
  const sweet = 'Correct! Prajjwal loves you most!';
  const correctResult = evaluateQuizAnswer(0, 0, sweet);
  assert.equal(correctResult.isCorrect, true);
  assert.equal(correctResult.response, sweet);

  const wrongResult = evaluateQuizAnswer(1, 0, sweet);
  assert.equal(wrongResult.isCorrect, false);
});

test('areAllGiftsOpened tracks gift box completion', () => {
  assert.equal(areAllGiftsOpened([1, 2, 3], 5), false);
  assert.equal(areAllGiftsOpened([1, 2, 3, 4, 5], 5), true);
  assert.equal(areAllGiftsOpened([1, 2, 3, 4, 4, 5], 5), true);
});
