// Colors for light and dark themes (Цвета для светлой и темной темы)
const colors = {
  light: {
    fillOverlay: "rgb(225, 228, 232, 0.1)",  // Semi-transparent overlay   // Фон обводки
    strokeBorder: "rgb(225, 228, 232)",    // Border/outline color       // Цвет обводки
    cardFill: "none",                        // Inner fill of the card     // Заливка карточки
    cardStroke: "rgb(225, 228, 232)",      // Card border color          // Обводка внутри карточки
    title: "rgb(0, 106, 255)",             // Header text color          // Цвет заголовка
    textPrimary: "rgb(88, 96, 105)",       // Main text color            // Основной текст
    icon: "rgb(88, 96, 105)",              // Default icon color         // Цвет иконок)
  },
  dark: {
    fillOverlay: "none",
    strokeBorder: "rgb(225, 228, 232, 0.5)",
    cardFill: "none",
    cardStroke: "rgb(225, 228, 232, 0.5)",
    title: "#006AFF",
    textPrimary: "#c9d1d9",
    icon: "#8b949e",
  },
};

export default colors;
