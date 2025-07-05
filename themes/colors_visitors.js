// Colors for light and dark themes (Цвета для светлой и темной темы)
const colors = {
  light: {
    fillOverlay: "rgb(225, 228, 232, 0.1)",    // Semi-transparent overlay          // Фон обводки
    strokeBorder: "rgb(225, 228, 232)",      // Border/outline color              // Цвет обводки
    cardFill: "none",                          // Inner fill of the card            // Заливка карточки
    cardStroke: "rgb(225, 228, 232)",        // Card border color                 // Обводка внутри карточки
    iconGithub: "rgb(88, 96, 105)",          // GitHub Icon Color                 // Цвет иконки GitHub
    titleCards: "#006AFF",                     // Card Title Color                  // Цвет заголовка карточки
    contentIcons: "rgb(88, 96, 105)",        // Fill color of statistics icons    // Цвет заливки иконок статистики
    contentIconOutline: "rgb(88, 96, 105)",  // Stats Header Icon Outline         // Обводка иконок заголовков статистики
    headerStatsText: "#FFFFFF",                // Statistics Header Text Color      // Цвет заливки заголовков статистики
    borderHeaderStats: "rgb(88, 96, 105)",   // Statistic Header Outlines         // Обводка заголовков статистики
    statisticsText: "rgb(88, 96, 105)",      // Statistics text color             // Цвет текста статистики
  },
  dark: {
    fillOverlay: "none",
    strokeBorder: "rgb(225, 228, 232, 0.5)",
    cardFill: "none",
    cardStroke: "rgb(225, 228, 232, 0.5)",
    iconGithub: "#c9d1d9",
    titleCards: "#006AFF",
    contentIcons: "#8b949e",
    contentIconOutline: "#FFFFFF",
    headerStatsText: "#000000",
    borderHeaderStats: "#c9d1d9",
    statisticsText: "#c9d1d9",
  },
};

export default colors;
