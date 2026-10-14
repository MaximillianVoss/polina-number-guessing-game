# Компоненты, контролы и API в проекте «Игра “Угадай число”»

## 1. Терминология

В этом документе используются следующие термины:

- **React-компонент** — функция или готовый тип, который можно записать в JSX, например `<View>` или `<Text>`;
- **нативный контрол** — интерактивный элемент платформы, например поле ввода или кнопка, который React Native предоставляет через компонент;
- **контейнер** — компонент для компоновки других элементов; в проекте это `View`;
- **prop** — входное свойство компонента, например `title`, `value`, `style` или `onPress`;
- **событие** — уведомление о действии пользователя, например изменение текста или нажатие;
- **обработчик** — функция, выполняемая в ответ на событие;
- **state** — данные компонента, изменение которых вызывает повторный рендер;
- **hook** — функция React, подключающая возможности React к функциональному компоненту; здесь используется только `useState`;
- **API** — функция или объект, вызываемый из JavaScript, но не записываемый как JSX-элемент;
- **доступное имя** — имя, по которому assistive technologies объясняют назначение элемента;
- **live region** — Android-механизм, через который TalkBack может объявить
  изменение текста без принудительного перевода фокуса; поведение VoiceOver
  на iOS необходимо проверять отдельно;
- **`testID`** — стабильный технический идентификатор для тестов, не замена пользовательской подписи.

Ключевое различие проекта:

- `View`, `Text`, `TextInput`, `Button` и `StatusBar` используются как JSX-компоненты;
- `Alert` — React Native API, вызывающее нативный диалог, а не JSX-контрол `<Alert>`;
- `useState` — React hook, а не визуальный контрол;
- `StyleSheet` — React Native API организации стилей, а не визуальный контрол;
- `Math.random` — JavaScript API случайных чисел, а не компонент и не state.

## 2. Карта всех фактически используемых компонентов и API

Точные импорты из текущего `App.js`:

```js
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { buildGuessMessage, compareGuess, createSecretNumber, parseGuess } from './src/number-guessing';
```

| Имя | Источник | Категория | Есть JSX-тег | Роль в приложении |
|---|---|---|---:|---|
| `View` | `react-native` | Компонент-контейнер | Да | Экран, игровая карточка, карточка правил |
| `Text` | `react-native` | Текстовый компонент | Да | Заголовки, описание, подсказка, count, подпись, ошибка, правила |
| `TextInput` | `react-native` | Нативный ввод | Да | Принимает строку догадки |
| `Button` | `react-native` | Нативная кнопка | Да | Запускает `handleGuess` |
| `StatusBar` | `expo-status-bar` | Компонент управления системной строкой состояния | Да | Устанавливает тёмные значки status bar |
| `Alert` | `react-native` | Императивный нативный API | Нет | Показывает результат правильной попытки и кнопку `OK` |
| `useState` | `react` | Hook/API состояния | Нет | Хранит пять значений раунда |
| `StyleSheet` | `react-native` | API стилей | Нет | Создаёт объект именованных стилей |
| `Math.random` | JavaScript | API случайных чисел | Нет | Даёт вход для создания первого и следующего секрета |
| `createSecretNumber` | Локальный модуль | Чистая функция | Нет | Преобразует случайное значение в целое 1–100 |
| `parseGuess` | Локальный модуль | Чистая функция | Нет | Проверяет строку и возвращает число либо ошибку |
| `compareGuess` | Локальный модуль | Чистая функция | Нет | Возвращает `low`, `high` или `correct` |
| `buildGuessMessage` | Локальный модуль | Чистая функция | Нет | Формирует подсказку `too low/high` |

В проекте нет `ScrollView`, `SafeAreaView`, `Pressable`, `TouchableOpacity`, навигационных компонентов, списков, изображений в JSX и постоянного хранилища. Не следует приписывать им поведение текущего экрана.

## 3. `View` — контейнер и компоновка

### Точный фрагмент текущего `App.js`

```jsx
<View style={styles.safeArea}>
  <StatusBar style="dark" />
  <View style={styles.screen}>
    <View style={styles.card}>
```

Другой фактически используемый контейнер:

```jsx
<View style={styles.rulesCard}>
  <Text style={styles.rulesTitle}>Round rules</Text>
  <Text style={styles.rule}>• Only whole numbers from 1 to 100 are valid.</Text>
  <Text style={styles.rule}>• Invalid input does not count as an attempt.</Text>
  <Text style={styles.rule}>• Press OK after a correct guess to start again.</Text>
</View>
```

### Назначение

`View` группирует дочерние компоненты и участвует в layout. Здесь четыре уровня ответственности:

- `styles.safeArea` занимает весь экран, задаёт фон и верхний отступ;
- `styles.screen` ограничивает ширину до 420, центрирует содержимое и задаёт общий padding;
- `styles.card` оформляет игровую карточку;
- `styles.rulesCard` оформляет статическую карточку правил.

### Props и события

Фактически передан только prop `style`. Обработчиков на самих `View` нет: контейнеры не нажимаются и не изменяют state.

### Связь со state

Прямой связи нет. `View` содержит дочерние `Text` и `TextInput`, которые читают `message`, `attemptCount`, `errorMessage` и `guessInput`.

### Доступность

У контейнеров не задано искусственное `accessibilityLabel`, поэтому семантика дочерних элементов остаётся отдельной. Для текущего простого экрана это уместно: игровой блок не превращается в одну большую неделимую доступную сущность.

### Типичная ошибка

Ошибка: назначить `onPress` обычному `View` и ожидать поведение кнопки или сделать весь экран одним доступным элементом.

### Модельный ответ

«`View` отвечает за структуру и стили, но в текущем приложении не является интерактивным контролом. Нажатие обрабатывает `Button`, а содержимое контейнера остаётся доступно по отдельности».

## 4. `Text` — статический и динамический текст

### Точные фрагменты текущего `App.js`

Статические тексты:

```jsx
<Text style={styles.title}>Number Guessing Game</Text>
<Text style={styles.description}>Find the secret whole number from 1 to 100.</Text>
```

Динамические подсказка и счётчик:

```jsx
<Text accessibilityLiveRegion="polite" style={styles.hint} testID="hint-message">
  {message}
</Text>
<Text accessibilityLiveRegion="polite" style={styles.attempts} testID="attempt-count">
  Attempts: {attemptCount}
</Text>
```

Подпись поля и ошибка:

```jsx
<Text style={styles.label}>Your guess</Text>
```

```jsx
<Text accessibilityLiveRegion="polite" style={styles.error} testID="error-message">
  {errorMessage}
</Text>
```

### Props и события

Фактически используются:

- `style` — внешний вид;
- `accessibilityLiveRegion="polite"` — просьба к TalkBack на Android объявить
  изменившийся динамический текст без прерывания текущей речи;
- `testID` — селектор UI-теста;
- children — статическая строка или выражение state.

Событий на `Text` нет. Все тексты только отображают информацию.

### Связь со state

- `{message}` читает `message`;
- `Attempts: {attemptCount}` читает `attemptCount`;
- `{errorMessage}` читает `errorMessage`;
- заголовки, подпись и правила статичны.

### Доступность

Видимый текст уже несёт смысл. Поэтому динамическим `Text` не задан
`accessibilityLabel`; UI-тест прямо подтверждает отсутствие этого prop у
`hint-message`, `attempt-count` и `error-message`.
`accessibilityLiveRegion="polite"` позволяет TalkBack на Android объявить
обновление, не прерывая текущую речь. Это Android-specific prop: на iOS нельзя
обещать то же поведение без отдельной ручной проверки VoiceOver. `testID`
помогает тесту, но не должен рассматриваться как доступное имя.

### Типичная ошибка

Ошибка: заменить видимый `{message}` фиксированным `accessibilityLabel`, который перестаёт соответствовать динамическому тексту, либо использовать обычную строку вне `<Text>` внутри `View`.

### Модельный ответ

«В React Native текст внутри `View` помещается в `Text`. Динамические значения
берутся из state, а на Android live region сообщает TalkBack об обновлении.
Поведение VoiceOver проверяется отдельно. Искусственный accessibility label
не нужен, потому что сам видимый текст уже точный и актуальный».

## 5. `TextInput` — управляемое поле догадки

### Точный фрагмент текущего `App.js`

```jsx
<TextInput
  accessibilityLabel="Guess input"
  keyboardType="numeric"
  onChangeText={setGuessInput}
  placeholder="Enter a number from 1 to 100"
  placeholderTextColor="#64748b"
  style={styles.input}
  value={guessInput}
/>
```

### Props

| Prop | Текущее значение | Назначение |
|---|---|---|
| `accessibilityLabel` | `"Guess input"` | Явно называет поле для assistive technologies и `getByLabelText` |
| `keyboardType` | `"numeric"` | Просит платформу показать числовую раскладку |
| `onChangeText` | `setGuessInput` | Получает новую строку и записывает её в state |
| `placeholder` | `"Enter a number from 1 to 100"` | Показывает пример ожидаемого ввода, пока поле пусто |
| `placeholderTextColor` | `"#64748b"` | Задаёт читаемый цвет placeholder независимо от платформенного значения по умолчанию |
| `style` | `styles.input` | Рамка, отступы, цвет, фон и размер текста |
| `value` | `guessInput` | Делает state источником отображаемого значения |

### Событие

При каждом изменении текста React Native вызывает `onChangeText` с **готовой строкой**, а не DOM-событием. Переданная setter-функция эквивалентна краткому обработчику:

```js
(text) => setGuessInput(text)
```

### Связь со state

Поток двунаправленный:

```text
ввод пользователя → onChangeText → setGuessInput → guessInput → value → экран
```

`startNewRound` выполняет `setGuessInput('')`, поэтому controlled input очищается после `OK`.

### Доступность

Видимая подпись `Your guess` расположена рядом, а `accessibilityLabel="Guess input"` даёт полю устойчивое английское имя. UI-тест находит его через `getByLabelText('Guess input')`. Placeholder не следует считать полноценной подписью: он исчезает при вводе.

### Типичная ошибка

Ошибка: оставить `value={guessInput}`, но забыть `onChangeText`; поле станет фактически нередактируемым. Обратная ошибка — убрать `value`, после чего `setGuessInput('')` может не управлять отображением ожидаемым образом.

### Модельный ответ

«Это controlled `TextInput`: пользовательское изменение записывается в `guessInput`, а prop `value` показывает то же state. Поле хранит строку; преобразование в число выполняется позже в `parseGuess`».

## 6. `Button` — событие проверки

### Точный фрагмент текущего `App.js`

```jsx
<Button title="MAKE GUESS" onPress={handleGuess} color="#2563eb" />
```

### Props

- `title="MAKE GUESS"` — видимая надпись и доступное имя кнопки;
- `onPress={handleGuess}` — ссылка на обработчик;
- `color="#2563eb"` — основной цвет, конкретное нативное отображение может различаться между Android и iOS.

### Событие

`onPress` вызывается после действия пользователя. Запись передаёт функцию, не выполняя её во время рендера.

### Связь со state

Сам `Button` не читает state напрямую, но `handleGuess` читает `guessInput`, `attemptCount`, `secretNumber` и обновляет `errorMessage`, `attemptCount`, `message` либо вызывает `Alert`.

### Доступность

React Native `Button` предоставляет роль кнопки. UI-тест ищет его семантически:

```js
const makeGuess = ui.getByRole('button', { name: 'MAKE GUESS' });
```

Это предпочтительнее технического `testID`, потому что проверяется пользовательская роль и имя.

### Типичная ошибка

Ошибка:

```jsx
<Button title="MAKE GUESS" onPress={handleGuess()} />
```

Так обработчик выполнится при рендере, а в `onPress` попадёт его возвращаемое значение.

### Модельный ответ

«`onPress={handleGuess}` передаёт callback. Кнопка запускает валидацию только после нажатия, а её видимый `title` одновременно служит понятным именем».

## 7. `StatusBar` — управление системной областью

### Точный фрагмент текущего `App.js`

```jsx
<StatusBar style="dark" />
```

### Prop и результат

Фактически используется один prop: `style="dark"`. Он просит Expo отобразить тёмные элементы системной строки состояния, что согласуется со светлым фоном `#f8fafc`.

### События и state

Событий нет, state приложения не читается и не изменяется. `StatusBar` не участвует в правилах игры.

### Доступность

Это системное оформление, а не фокусируемый игровой контрол. Ему не нужны `accessibilityLabel`, `testID` или обработчик.

### Типичная ошибка

Ошибка: считать `StatusBar` верхней панелью приложения с заголовком или пытаться поместить в него дочерний текст.

### Модельный ответ

«`StatusBar` управляет внешним видом системной строки состояния. Заголовок `Number Guessing Game` отображается отдельным `Text` и не связан с `StatusBar`».

## 8. `Alert` — императивный нативный API

### Точный фрагмент текущего `App.js`

```js
if (status === 'correct') {
  // Новый раунд начинается из явного события OK, поэтому игрок успевает прочитать результат.
  Alert.alert('Correct!', `You guessed the number in ${nextCount} guesses`, [
    { text: 'OK', onPress: startNewRound },
  ]);
  return;
}
```

### Категория

`Alert` — **API, а не визуальный JSX-контрол**. В коде нет и не должно быть `<Alert />`. Вызов `Alert.alert(...)` просит платформу показать нативный диалог.

### Аргументы

1. `'Correct!'` — заголовок;
2. `` `You guessed the number in ${nextCount} guesses` `` — динамическое сообщение;
3. массив кнопок с одной конфигурацией `{ text: 'OK', onPress: startNewRound }`.

### Событие и связь со state

Диалог создаётся при `status === 'correct'`. Его кнопка `OK` вызывает `startNewRound`, которая обновляет все пять state:

```js
function startNewRound() {
  setSecretNumber(createSecretNumber(Math.random()));
  setGuessInput('');
  setMessage('Guess a number between 1-100');
  setAttemptCount(0);
  setErrorMessage('');
}
```

### Доступность

Нативный диалог и его кнопка используют системную семантику. Тексты `Correct!`, результата и `OK` должны оставаться ясными без визуального контекста. Сброс отложен до `OK`, поэтому результат можно прочитать.

### Тестирование

`Alert.alert` подменяется spy-функцией. Тест проверяет точные аргументы, извлекает `onPress` из массива кнопок и вызывает его в `act`. Это позволяет проверить событие `OK`, не взаимодействуя с реальным системным окном.

### Типичная ошибка

Ошибка: `{ text: 'OK', onPress: startNewRound() }`.

### Модельный ответ

«`Alert` вызывается императивно после правильной догадки. В конфигурацию `OK` передаётся ссылка `startNewRound`, поэтому сброс происходит только после подтверждения».

## 9. `useState` — единственный hook проекта

### Точный фрагмент текущего `App.js`

```js
const [secretNumber, setSecretNumber] = useState(() => createSecretNumber(Math.random()));
// TextInput отдаёт строку: это позволяет показать ошибку до преобразования и сохранить управляемое поле.
const [guessInput, setGuessInput] = useState('');
const [message, setMessage] = useState('Guess a number between 1-100');
const [attemptCount, setAttemptCount] = useState(0);
const [errorMessage, setErrorMessage] = useState('');
```

### Категория и контракт

`useState` — **React hook/API, а не визуальный контрол**. Каждый вызов возвращает пару: текущее значение и setter. Setter планирует обновление и повторный рендер.

| Значение | Setter | Инициализация | Что отображает/контролирует |
|---|---|---|---|
| `secretNumber` | `setSecretNumber` | лениво созданное число | Скрытое правило сравнения |
| `guessInput` | `setGuessInput` | `''` | `TextInput.value` |
| `message` | `setMessage` | `Guess a number between 1-100` | `hint-message` |
| `attemptCount` | `setAttemptCount` | `0` | `attempt-count` и итог `Alert` |
| `errorMessage` | `setErrorMessage` | `''` | `error-message` |

### События и замыкание

Hook не создаёт пользовательское событие. Setter-функции вызываются из `onChangeText`, `handleGuess`, `startNewRound` и callback `OK`. Внутри текущего вызова `handleGuess` переменная `attemptCount` остаётся значением текущего рендера, поэтому используется `nextCount`.

### Доступность

State сам по себе недоступен пользователю. Доступность появляется, когда значения выводятся в `Text`, `TextInput` или `Alert` с корректной семантикой.

### Типичная ошибка

Ошибка: создавать секрет так:

```js
const secret = createSecretNumber(Math.random());
```

в теле компонента. Любой рендер создавал бы новое число.

### Модельный ответ

«`useState` хранит данные между рендерами. Первый секрет создаётся лениво, а остальные значения имеют простые начальные значения. Setter вызывает новый рендер, но не переписывает переменную текущего замыкания мгновенно».

## 10. `StyleSheet` — API именованных стилей

### Точные фрагменты текущего `App.js`

Начало вызова:

```js
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 36,
  },
```

Стиль поля:

```js
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
```

Стиль ошибки:

```js
  error: {
    minHeight: 20,
    color: '#b91c1c',
    fontWeight: '600',
  },
```

### Категория

`StyleSheet` — **API, а не визуальный контрол**. `StyleSheet.create` возвращает объект ссылок на стили. Элементы появляются только тогда, когда `styles.*` переданы в prop `style` JSX-компонента.

### Фактические группы стилей

- layout: `safeArea`, `screen`, `card`, `rulesCard`;
- крупные заголовки: `title`, `rulesTitle`;
- обычный текст: `description`, `rule`, `label`;
- динамические зоны: `hint`, `attempts`, `error`;
- ввод: `input`.

В React Native используются JavaScript-имена `backgroundColor`, `fontSize`, `paddingHorizontal`, а не CSS-строка и не `font-size`.

### События и state

Событий нет. В текущей версии стили статичны и не зависят от state. Ошибка всегда имеет зарезервированную высоту `minHeight: 20`, даже когда `errorMessage === ''`, что уменьшает скачок layout.

### Доступность

Стиль не создаёт семантику. Цвет, размер и отступы поддерживают читаемость,
но должны дополняться настоящими текстами, ролями, labels и проверенными для
целевой платформы механизмами уведомления. Нельзя «сделать кнопку» только
синим прямоугольником без роли и обработчика.

### Типичная ошибка

Ошибка: писать веб-CSS как строку (`'font-size: 17px'`) или считать красный цвет достаточным объяснением ошибки.

### Модельный ответ

«`StyleSheet` организует визуальные свойства, но не создаёт элементы и события.
Ошибка понятна не только по красному цвету: пользователь получает точный текст,
а TalkBack на Android — live region; VoiceOver проверяется отдельно».

## 11. `Math.random` и локальные функции предметной логики

### Точные фрагменты текущего `App.js`

Первый секрет:

```js
const [secretNumber, setSecretNumber] = useState(() => createSecretNumber(Math.random()));
```

Новый секрет:

```js
setSecretNumber(createSecretNumber(Math.random()));
```

Обработка догадки:

```js
const parsed = parseGuess(guessInput);
```

```js
const status = compareGuess(secretNumber, parsed.value);
```

```js
setMessage(buildGuessMessage(status, parsed.value));
```

### `Math.random`

Это стандартный JavaScript API. Он возвращает псевдослучайное значение в `[0, 1)`. В проекте случайность немедленно передаётся в чистую `createSecretNumber`; это позволяет тестировать преобразование независимо и подменять только источник случайности в UI-тесте.

### Локальные функции

- `createSecretNumber` не управляет state; setter вызывается в `App`;
- `parseGuess` не показывает ошибку; он возвращает данные, а `App` решает вызвать `setErrorMessage`;
- `compareGuess` не меняет подсказку; он возвращает статус;
- `buildGuessMessage` не рендерит `Text`; он возвращает строку.

### Доступность

Ни одно вычислительное API не имеет собственной accessibility-семантики. Доступным должен быть результат вычисления, отображённый через `Text`, `Alert` или управляемое поле.

### Типичная ошибка

Ошибка: вызвать `Math.random` внутри рендера для каждой проверки или спрятать setters внутри чистого модуля.

### Модельный ответ

«Случайность — внешняя зависимость. `App` решает, когда получить случайное значение, а чистые функции только преобразуют и сравнивают данные. Это сохраняет понятные границы и упрощает тесты».

## 12. StyleSheet и доступность как единая проверка интерфейса

Визуальный и доступный интерфейс проверяются вместе, но разными средствами.

### Фактическая карта доступности

| Элемент | Текущая семантика | Почему так |
|---|---|---|
| `TextInput` | `accessibilityLabel="Guess input"` | Устойчивое назначение поля, не зависящее от placeholder |
| `Button` | Роль кнопки и имя `MAKE GUESS` из `title` | Тест находит элемент по роли и имени |
| `hint-message` | Видимый текст + `accessibilityLiveRegion="polite"` | На Android TalkBack может объявить новую подсказку без заменяющего содержимое label |
| `attempt-count` | Видимый `Attempts: N` + live region | Изменение наблюдаемо; автоматическое объявление проверяется с TalkBack |
| `error-message` | Видимый точный текст + live region | Ошибка не сообщается одним цветом; iOS/VoiceOver проверяется отдельно |
| `Alert` | Нативные заголовок, сообщение и `OK` | Системная диалоговая семантика |
| Статические правила | Обычные `Text` | Смысл полностью содержится в видимой строке |
| `View` | Нет объединяющего label | Дочерние элементы остаются самостоятельными |

### Что дают стили

- светлый фон и тёмный основной текст;
- визуально различимые карточки;
- заметная синяя подсказка;
- красный текст ошибки с жирностью;
- поле с рамкой и внутренними отступами;
- `minHeight` у ошибки уменьшает изменение layout.

### Что стили не заменяют

- цвет ошибки не заменяет текст ошибки;
- крупный шрифт не заменяет роль заголовка или понятное содержание;
- синяя кнопка не заменяет `Button` и `onPress`;
- placeholder не заменяет label;
- `testID` не заменяет accessibility-свойства.

### Проверка тестами

Тест использует `getByLabelText('Guess input')`, `getByRole('button', { name: 'MAKE GUESS' })` и точные `testID`. Он также проверяет, что динамическим текстам не добавлен лишний `accessibilityLabel`, который мог бы скрыть или дублировать фактическое содержимое.

## 13. Матрица `control → state → event → result`

| Компонент/API | Читает state | Событие/вызов | Изменяет state | Наблюдаемый результат |
|---|---|---|---|---|
| Внешний `View` | Нет | Рендер | Нет | Фон, отступ, центрированный экран |
| `View` игровой карточки | Через дочерние элементы | Рендер | Нет | Группирует заголовок, прогресс, ввод, кнопку и ошибку |
| `Text` `hint-message` | `message` | Повторный рендер | Нет | `Guess a number between 1-100` или `Your guess N is too low/high` |
| `Text` `attempt-count` | `attemptCount` | Повторный рендер | Нет | `Attempts: N` |
| `Text` `error-message` | `errorMessage` | Повторный рендер | Нет | Пустая строка или `Enter a whole number from 1 to 100.` |
| `TextInput` | `guessInput` через `value` | `onChangeText` | `setGuessInput` | На экране появляется введённая строка |
| `Button` | Косвенно через `handleGuess` | `onPress` | В зависимости от ветки | Ошибка, новая подсказка или `Alert` |
| `parseGuess` | Получает `guessInput` аргументом | Вызов в `handleGuess` | Нет | Объект ошибки или проверенное число |
| `compareGuess` | Получает `secretNumber` и число аргументами | После успешного parse | Нет | `low`, `high`, `correct` |
| `useState` setters | Не читают state напрямую; текущее значение читает обработчик | Вызов setter с новым значением | Да | Планирует рендер с новым значением |
| `Alert.alert` | Текст использует `nextCount` | Ветка `correct` | Не сразу | Нативный диалог `Correct!` |
| Кнопка `OK` Alert | Не читает напрямую | `onPress` | Через `startNewRound` — все пять state | Новый секрет, пустое поле, начальная подсказка, count 0, нет ошибки |
| `StatusBar` | Нет | Рендер | Нет | Тёмные системные значки |
| `StyleSheet` | Нет | `StyleSheet.create` при загрузке модуля | Нет | Именованные ссылки на визуальные свойства |

Короткая трасса ошибочной строки:

```text
TextInput('0x10') → guessInput → Button → parseGuess → setErrorMessage → return
```

Короткая трасса правильной строки:

```text
TextInput('75') → guessInput → Button → parseGuess → compareGuess(secretNumber, 75) → 'correct'
→ setAttemptCount(nextCount) → Alert → OK → startNewRound
```

## 14. Аналоги в веб-разработке

| React Native | Ближайший web-аналог | Важное отличие |
|---|---|---|
| `View` | `<div>` | Layout задаётся объектами RN и Flexbox; DOM отсутствует |
| `Text` | `<span>`, `<p>`, `<h1>` | В RN текст должен находиться в `Text`; тег не выбирает HTML-семантику |
| `TextInput` | `<input type="text">` | `onChangeText` получает строку напрямую, а не `event.target.value` |
| `Button` | `<button>` | Внешний вид нативный и platform-dependent; содержимое задаётся `title` |
| `StatusBar` | Прямого DOM-аналога нет | Управляет системной областью устройства, не страницей |
| `Alert.alert` | `window.alert` или `<dialog>` | RN API принимает конфигурацию кнопок с callbacks; оформление нативное |
| `useState` | Тот же React hook | Модель состояния одинакова, меняются визуальные компоненты |
| `StyleSheet.create` | CSS-классы/CSS Modules/объекты style | Нет CSS-файла, каскада и строковых имён свойств с дефисами |
| `accessibilityLabel` | `aria-label` | Названия props и платформенное отображение семантики различаются |
| `accessibilityLiveRegion` | `aria-live` | Похожая идея, но prop React Native документирован для Android; VoiceOver проверяется отдельно |
| `testID` | `data-testid` | Технический селектор, не пользовательская семантика |

Пример события:

```jsx
// React Native
onChangeText={setGuessInput}
```

В типичном web React аналог мог бы выглядеть так:

```jsx
onChange={(event) => setGuessInput(event.target.value)}
```

Нельзя механически переносить `<div>`, CSS-строки или `event.target.value` в текущий React Native-код.

## 15. Мини-упражнения

### 15.1. Компонент или API

Распределить: `Text`, `Alert`, `useState`, `Button`, `StyleSheet`, `View`, `Math.random`, `StatusBar`.

**Ответ:** JSX-компоненты — `Text`, `Button`, `View`, `StatusBar`; API/hook — `Alert`, `useState`, `StyleSheet`, `Math.random`. `Alert` показывает визуальный нативный диалог, но вызывается как API.

### 15.2. Восстановить controlled input

Заполнить пропуски:

```jsx
<TextInput
  onChangeText={__________}
  value={__________}
/>
```

**Ответ:** `setGuessInput`, `guessInput`.

### 15.3. Найти преждевременный вызов

Какой вариант верен?

```jsx
onPress={handleGuess}
onPress={handleGuess()}
```

**Ответ:** первый. Второй вызывает функцию во время рендера.

### 15.4. Проследить динамический `Text`

Если `setMessage('Your guess 40 is too low')` вызван после допустимой попытки, какой узел изменится?

**Ответ:** `Text` с `testID="hint-message"` прочитает новое `message`. На
Android `accessibilityLiveRegion="polite"` просит TalkBack объявить обновление;
на iOS поведение VoiceOver проверяется отдельно.

### 15.5. Выбрать доступный селектор

Как найти кнопку в тесте: по цвету, координате, `testID` или роли и имени?

**Ответ:** `getByRole('button', { name: 'MAKE GUESS' })`, потому что это проверяет пользовательскую семантику.

### 15.6. Исправить веб-привычку

Дан ошибочный RN-фрагмент:

```jsx
<TextInput onChange={(event) => setGuessInput(event.target.value)} />
```

**Ответ:** для текущего проекта использовать `onChangeText={setGuessInput}`; callback получает строку напрямую.

### 15.7. Объяснить пустую область ошибки

Почему под кнопкой остаётся небольшое место, когда ошибки нет?

**Ответ:** `Text` всё равно рендерится с пустым `errorMessage`, а `styles.error` содержит `minHeight: 20`; это стабилизирует layout.

### 15.8. Создать доступный новый текст

Предложить отображение истории последней догадки без потери доступности.

**Модельное решение:** использовать видимый `Text` с понятной строкой, для
Android рассмотреть `accessibilityLiveRegion="polite"`, отдельно проверить
VoiceOver на iOS, добавить `testID` только для теста и не заменять содержимое
искусственным label.

## 16. Контрольные вопросы и ответы

1. **Какие элементы текущего файла являются визуальными JSX-компонентами?**  
   `View`, `Text`, `TextInput`, `Button`, `StatusBar`.

2. **Почему `Alert` нельзя записать как `<Alert />`?**  
   В React Native это императивный API. Диалог создаётся вызовом `Alert.alert(title, message, buttons)`.

3. **Является ли `useState` контролом?**  
   Нет. Это React hook, который хранит состояние и предоставляет setter. Он ничего не рисует самостоятельно.

4. **Является ли `StyleSheet` контролом?**  
   Нет. Это API для создания и организации ссылок на стили. Визуальный результат появляется через prop `style` у компонентов.

5. **Какой компонент непосредственно принимает догадку?**  
   `TextInput`. Его значение связано с `guessInput`.

6. **Какое событие изменяет `guessInput`?**  
   `onChangeText`, которому передан `setGuessInput`.

7. **Почему `keyboardType="numeric"` не гарантирует корректность?**  
   Это настройка клавиатуры, а не валидатор. Строка всё равно должна пройти `parseGuess`.

8. **Как кнопка связана с `secretNumber`?**  
   Косвенно: `Button` вызывает `handleGuess`, а обработчик передаёт `secretNumber` и проверенное число в `compareGuess`.

9. **Какие `Text` читают state?**  
   `hint-message` читает `message`, `attempt-count` — `attemptCount`, `error-message` — `errorMessage`.

10. **Почему динамическим текстам не нужен отдельный `accessibilityLabel`?**  
    Их видимое содержимое уже является точной пользовательской информацией. На
    Android live region помогает TalkBack объявить изменение, а искусственный
    label мог бы заменить или дублировать актуальный текст. Тест закрепляет
    отсутствие такого prop; поведение VoiceOver на iOS требует отдельной ручной
    проверки.

11. **Что делает `testID="error-message"`?**  
    Даёт тесту стабильный способ найти узел и проверить содержимое. Он не сообщает пользователю смысл ошибки.

12. **Почему у ошибки есть и красный стиль, и текст?**  
    Цвет помогает визуально, но не доступен всем пользователям. Точный текст передаёт смысл независимо от восприятия цвета.

13. **Как `OK` начинает новый раунд?**  
    Конфигурация кнопки `Alert` содержит `onPress: startNewRound`; callback создаёт новый секрет и сбрасывает остальные state.

14. **Почему в `Alert` используется `nextCount`?**  
    Setter count ещё не меняет переменную текущего обработчика. `nextCount` уже включает правильную текущую попытку.

15. **Как проверить кнопку лучше всего?**  
    По роли `button` и имени `MAKE GUESS`, потому что это соответствует тому, как элемент воспринимает пользователь.

16. **Как проверить поле?**  
    Найти по `accessibilityLabel="Guess input"`, изменить через `fireEvent.changeText` и проверить состояние через последующий результат или prop `value`.

17. **Что произойдёт со стилями при изменении `attemptCount`?**  
    Ссылки `styles.*` останутся теми же; повторно отрендерится текст с новым числом. В текущей версии нет условного стиля count.

18. **Что является единым источником истины для содержимого поля?**  
    `guessInput` в React state, потому что он передан в `value`.

19. **Какие API намеренно подменяются в UI-тесте?**  
    `Math.random` для известных секретов и `Alert.alert` для проверки диалога и callback без нативного окна.

20. **Какое главное правило связывает контролы и логику?**  
    Компоненты принимают ввод и отображают результат, обработчики координируют state, а чистые функции валидируют и вычисляют без зависимости от UI.
