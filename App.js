import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { buildGuessMessage, compareGuess, createSecretNumber, parseGuess } from './src/number-guessing';

export default function App() {
  // Ленивый инициализатор создаёт секрет один раз при начале раунда, а не при каждом рендере.
  const [secretNumber, setSecretNumber] = useState(() => createSecretNumber(Math.random()));
  // TextInput отдаёт строку: это позволяет показать ошибку до преобразования и сохранить управляемое поле.
  const [guessInput, setGuessInput] = useState('');
  const [message, setMessage] = useState('Guess a number between 1-100');
  const [attemptCount, setAttemptCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  function startNewRound() {
    setSecretNumber(createSecretNumber(Math.random()));
    setGuessInput('');
    setMessage('Guess a number between 1-100');
    setAttemptCount(0);
    setErrorMessage('');
  }

  function handleGuess() {
    const parsed = parseGuess(guessInput);
    if (!parsed.ok) {
      setErrorMessage(parsed.error);
      // Ранний выход гарантирует, что ошибочная строка не увеличит счётчик попыток.
      return;
    }

    const nextCount = attemptCount + 1;
    const status = compareGuess(secretNumber, parsed.value);
    setAttemptCount(nextCount);
    setErrorMessage('');

    if (status === 'correct') {
      // Новый раунд начинается из явного события OK, поэтому игрок успевает прочитать результат.
      Alert.alert('Correct!', `You guessed the number in ${nextCount} guesses`, [
        { text: 'OK', onPress: startNewRound },
      ]);
      return;
    }

    setMessage(buildGuessMessage(status, parsed.value));
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>Number Guessing Game</Text>
          <Text style={styles.description}>Find the secret whole number from 1 to 100.</Text>

          <Text accessibilityLiveRegion="polite" style={styles.hint} testID="hint-message">
            {message}
          </Text>
          <Text accessibilityLiveRegion="polite" style={styles.attempts} testID="attempt-count">
            Attempts: {attemptCount}
          </Text>

          <Text style={styles.label}>Your guess</Text>
          <TextInput
            accessibilityLabel="Guess input"
            keyboardType="numeric"
            onChangeText={setGuessInput}
            placeholder="Enter a number from 1 to 100"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={guessInput}
          />

          {/* Ссылка на функцию передаётся кнопке; вычисление начинается только после события press. */}
          <Button title="MAKE GUESS" onPress={handleGuess} color="#2563eb" />

          <Text accessibilityLiveRegion="polite" style={styles.error} testID="error-message">
            {errorMessage}
          </Text>
        </View>

        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>Round rules</Text>
          <Text style={styles.rule}>• Only whole numbers from 1 to 100 are valid.</Text>
          <Text style={styles.rule}>• Invalid input does not count as an attempt.</Text>
          <Text style={styles.rule}>• Press OK after a correct guess to start again.</Text>
        </View>

        {/* Секрет и прогресс живут только в state: постоянное хранилище здесь намеренно отсутствует. */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 36,
  },
  screen: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    padding: 16,
    justifyContent: 'center',
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbe4f0',
    padding: 20,
    gap: 12,
  },
  title: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '700',
  },
  description: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 21,
  },
  hint: {
    color: '#1e3a8a',
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    padding: 14,
    fontSize: 17,
    fontWeight: '600',
  },
  attempts: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  label: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#0f172a',
    backgroundColor: '#ffffff',
    fontSize: 17,
  },
  error: {
    minHeight: 20,
    color: '#b91c1c',
    fontWeight: '600',
  },
  rulesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbe4f0',
    padding: 20,
    gap: 8,
  },
  rulesTitle: {
    color: '#0f172a',
    fontSize: 19,
    fontWeight: '700',
  },
  rule: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 21,
  },
});
