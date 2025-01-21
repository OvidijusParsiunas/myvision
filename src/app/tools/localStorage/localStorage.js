const LOCAL_STORAGE_ROOT_KEY = 'MyVision';

function getLocalStorage() {
  return localStorage.getItem(LOCAL_STORAGE_ROOT_KEY);
}

function setValueFromLocalStorage(key, value) {
  const localStorageProperty = getLocalStorage() ? JSON.parse(getLocalStorage()) : {};
  localStorageProperty[key] = value;
  localStorage.setItem(LOCAL_STORAGE_ROOT_KEY, JSON.stringify(localStorageProperty));
}

function getValueFromLocalStorage(key) {
  return getLocalStorage() ? JSON.parse(getLocalStorage())[key] : null;
}

export { setValueFromLocalStorage, getValueFromLocalStorage };
