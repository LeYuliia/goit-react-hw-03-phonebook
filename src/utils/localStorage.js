export const saveToLS = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLS = (key) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};
