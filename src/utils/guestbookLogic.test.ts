import test from 'node:test';
import assert from 'node:assert/strict';
import { validateWish, createWish } from './guestbookLogic';

test('validateWish validates required fields correctly', () => {
  assert.equal(validateWish('', 'Happy birthday!').isValid, false);
  assert.equal(validateWish('Prajjwal', '').isValid, false);
  assert.equal(validateWish('   ', '   ').isValid, false);

  const valid = validateWish('Prajjwal', 'Happy Birthday Nandani!');
  assert.equal(valid.isValid, true);
  assert.equal(valid.error, undefined);
});

test('validateWish rejects excessively long inputs', () => {
  const longName = 'A'.repeat(35);
  const longMessage = 'B'.repeat(210);
  assert.equal(validateWish(longName, 'Happy birthday').isValid, false);
  assert.equal(validateWish('Prajjwal', longMessage).isValid, false);
});

test('createWish creates a well-formed GuestWish object', () => {
  const wish = createWish('Prajjwal', 'You are my universe 💜', '✨');
  assert.equal(wish.name, 'Prajjwal');
  assert.equal(wish.message, 'You are my universe 💜');
  assert.equal(wish.emoji, '✨');
  assert.equal(typeof wish.id, 'string');
  assert.equal(typeof wish.color, 'string');
});
