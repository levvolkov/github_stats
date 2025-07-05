// Colors for light and dark themes (Цвета для светлой и темной темы)
const colors = {
  light: {
    fillOverlay: "rgb(225, 228, 232, 0.1)",  // Semi-transparent overlay   // Фон обводки
    strokeBorder: "rgb(225, 228, 232)",    // Border/outline color       // Цвет обводки
    cardFill: "none",                        // Inner fill of the card     // Заливка карточки
    cardStroke: "rgb(225, 228, 232)",      // Card border color          // Обводка внутри карточки
    stat: "#000000",                         // Color of statistics        // Цвет статистики
    label: "#000000",                        // Color of labels            // Цвет меток
    date: "#006AFF",                         // Color of dates             // Цвет дат
    divider: "#006AFF",                      // Color of dividers          // Цвет разделителей
    ring: "#006AFF",                         // Ring color                 // Цвет кольца
    fire: "#006AFF",                         // Fire icon color            // Цвет иконки огня
    footer: "#000000",                       // Footer color               // Цвет футера
  },
  dark: {
    fillOverlay: "none",
    strokeBorder: "rgb(225, 228, 232, 0.5)",
    cardFill: "none",
    cardStroke: "rgb(225, 228, 232, 0.5)",
    stat: "#c9d1d9",
    label: "#c9d1d9",
    date: "#006AFF",
    divider: "#006AFF",
    ring: "#006AFF",
    fire: "#006AFF",
    footer: "#c9d1d9",
  },
  meta: {
    timeZone: "Europe/Moscow",               // Time zone in the card (Часовой пояс в карточке)
  },
};

export default colors;
