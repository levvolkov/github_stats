// Colors for light and dark themes (Цвета для светлой и темной темы)
const colors = {
  light: {
    fillOverlay: "rgb(225, 228, 232, 0.1)",       // Semi-transparent overlay             // Фон обводки
    strokeBorder: "rgb(225, 228, 232)",         // Border/outline color                 // Цвет обводки
    cardFill: "none",                             // Inner fill of the card               // Заливка карточки
    cardStroke: "rgb(225, 228, 232)",           // Card border color                    // Обводка внутри карточки
    title: "#006AFF",                             // Header color                         // Цвет заголовка
    lang: "#000000",                              // Language text color                  // Цвет текста языков
    percent: "rgb(88, 96, 105)",                // Color of percentages                 // Цвет процентов
    progressBar: "#e1e4e8",                       // Progress bar color                   // Цвет прогресс-бара
    progressItemOutline: "rgb(225, 228, 232)",  // Progress bar element outline color   // Цвет обводки элементов прогресс-бара
  },
  dark: {
    fillOverlay: "none",
    strokeBorder: "rgb(225, 228, 232, 0.5)",
    cardFill: "none",
    cardStroke: "rgb(225, 228, 232, 0.5)",
    title: "#006AFF",
    lang: "#c9d1d9",
    percent: "#8b949e",
    progressBar: "rgba(110, 118, 129, 0.4)",
    progressItemOutline: "#393f47",
  },
};

export default colors;
