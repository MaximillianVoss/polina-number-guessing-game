import { buildGuessMessage, compareGuess, createSecretNumber, parseGuess } from '../src/number-guessing';

test('maps random boundaries to the inclusive secret range', () => {
  expect(createSecretNumber(0)).toBe(1);
  expect(createSecretNumber(0.999999)).toBe(100);
});

test('parses a trimmed whole-number guess in range', () => {
  expect(parseGuess(' 75 ')).toEqual({ ok: true, value: 75 });
  expect(parseGuess('075')).toEqual({ ok: true, value: 75 });
});

test.each(['', '7.5', '0', '101', 'hello', '0x10', '1e2', '+5', '-5', '1.0', '1,0'])(
  'rejects invalid guess %p',
  (text) => {
    expect(parseGuess(text)).toEqual({ ok: false, error: 'Enter a whole number from 1 to 100.' });
  },
);

test('reports low, high, and correct literal guesses', () => {
  expect(compareGuess(75, 50)).toBe('low');
  expect(buildGuessMessage('low', 50)).toBe('Your guess 50 is too low');
  expect(compareGuess(75, 90)).toBe('high');
  expect(buildGuessMessage('high', 90)).toBe('Your guess 90 is too high');
  expect(compareGuess(75, 75)).toBe('correct');
});
