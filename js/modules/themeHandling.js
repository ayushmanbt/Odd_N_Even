import {
  getFromLocalStorage,
  setToLocalStorage,
} from "./localstorageHandler.js";

const UI_MODES = {
  light: 0,
  dark: 1,
};

const THEME_KEY = "swipegame_theming";

let theme = +getFromLocalStorage(THEME_KEY, UI_MODES.dark);

let body = document.querySelector("body");

export const determineBodyClass = () => {
  if (theme === UI_MODES.dark) {
    body.classList.remove("light");
    body.classList.add("dark");
  } else {
    body.classList.add("light");
    body.classList.remove("dark");
  }
};

export const toggleTheme = () => {
  theme = theme === UI_MODES.dark ? UI_MODES.light : UI_MODES.dark;
  setToLocalStorage(THEME_KEY, theme);
  determineBodyClass();
};
