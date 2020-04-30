export const getFromLocalStorage = (key, defaultValue = "0") => {
  if (!(key in localStorage)) return defaultValue;
  else return localStorage.getItem(key);
};

export const setToLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};
