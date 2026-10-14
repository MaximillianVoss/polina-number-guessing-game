import React from 'react';
import { Alert } from 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';
import App from '../App';

const randomSpy = jest.spyOn(Math, 'random');
const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

beforeEach(() => {
  randomSpy.mockReset().mockReturnValueOnce(0.74).mockReturnValue(0.24);
  alertSpy.mockClear();
});

afterAll(() => {
  randomSpy.mockRestore();
  alertSpy.mockRestore();
});

test('counts low, high, and correct guesses and uses a new secret after Alert OK', () => {
  const ui = render(<App />);
  const input = ui.getByLabelText('Guess input');
  const makeGuess = ui.getByRole('button', { name: 'MAKE GUESS' });
  expect(randomSpy).toHaveBeenCalledTimes(1);

  fireEvent.changeText(input, '0x10');
  fireEvent.press(makeGuess);
  expect(ui.getByTestId('error-message')).toHaveTextContent('Enter a whole number from 1 to 100.');
  expect(ui.getByTestId('attempt-count')).toHaveTextContent('Attempts: 0');
  expect(ui.getByTestId('error-message')).not.toHaveProp('accessibilityLabel');

  fireEvent.changeText(input, '50');
  fireEvent.press(makeGuess);
  expect(ui.getByTestId('hint-message')).toHaveTextContent('Your guess 50 is too low');
  expect(ui.getByTestId('attempt-count')).toHaveTextContent('Attempts: 1');

  fireEvent.changeText(input, '90');
  fireEvent.press(makeGuess);
  expect(ui.getByTestId('hint-message')).toHaveTextContent('Your guess 90 is too high');
  expect(ui.getByTestId('attempt-count')).toHaveTextContent('Attempts: 2');

  fireEvent.changeText(input, '75');
  fireEvent.press(makeGuess);
  expect(alertSpy).toHaveBeenCalledWith('Correct!', 'You guessed the number in 3 guesses', [
    { text: 'OK', onPress: expect.any(Function) },
  ]);

  const onPress = alertSpy.mock.calls[0][2][0].onPress;
  act(() => {
    onPress();
  });
  expect(randomSpy).toHaveBeenCalledTimes(2);
  expect(input).toHaveProp('value', '');
  expect(ui.getByTestId('hint-message')).toHaveTextContent('Guess a number between 1-100');
  expect(ui.getByTestId('attempt-count')).toHaveTextContent('Attempts: 0');
  expect(ui.getByTestId('hint-message')).not.toHaveProp('accessibilityLabel');
  expect(ui.getByTestId('attempt-count')).not.toHaveProp('accessibilityLabel');

  fireEvent.changeText(input, '30');
  fireEvent.press(makeGuess);
  expect(ui.getByTestId('hint-message')).toHaveTextContent('Your guess 30 is too high');
  expect(ui.getByTestId('attempt-count')).toHaveTextContent('Attempts: 1');

  fireEvent.changeText(input, '25');
  fireEvent.press(makeGuess);
  expect(alertSpy).toHaveBeenCalledTimes(2);
  expect(alertSpy).toHaveBeenLastCalledWith('Correct!', 'You guessed the number in 2 guesses', [
    { text: 'OK', onPress: expect.any(Function) },
  ]);
});
