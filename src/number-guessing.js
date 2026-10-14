/** Преобразует значение Math.random из [0, 1) в целое секретное число [1, 100]. */
export function createSecretNumber(randomValue) {
  return Math.floor(randomValue * 100) + 1;
}

/** Принимает только целое число в учебном диапазоне; остальные строки не считаются попыткой. */
export function parseGuess(text) {
  const normalized = text.trim();
  if (!/^\d+$/.test(normalized)) {
    return { ok: false, error: 'Enter a whole number from 1 to 100.' };
  }
  const value = Number(normalized);
  if (value < 1 || value > 100) {
    return { ok: false, error: 'Enter a whole number from 1 to 100.' };
  }
  return { ok: true, value };
}

/** Сравнивает уже проверенную догадку с секретом и возвращает один из трёх статусов. */
export function compareGuess(secret, guess) {
  if (guess < secret) return 'low';
  if (guess > secret) return 'high';
  return 'correct';
}

/** Формирует подсказку для допустимой, но пока неверной догадки. */
export function buildGuessMessage(status, guess) {
  return `Your guess ${guess} is too ${status}`;
}
