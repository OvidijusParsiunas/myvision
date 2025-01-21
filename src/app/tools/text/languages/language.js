import { setValueFromLocalStorage, getValueFromLocalStorage } from '../../localStorage/localStorage';
import chineseMandarin from './dictionaries/chineseMandarin';
import english from './dictionaries/english';

const STORAGE_KEY = 'language';
const languageToDictionary = { EN: english, CN: chineseMandarin };
let activeLanguage = getValueFromLocalStorage(STORAGE_KEY) || Object.keys(languageToDictionary)[0];
let activeDictionary = languageToDictionary[activeLanguage];

function setActiveLanguage(newLanguage) {
  activeLanguage = newLanguage;
  setValueFromLocalStorage(STORAGE_KEY, newLanguage);
  activeDictionary = languageToDictionary[newLanguage];
}

function getActiveLanguage() {
  return activeLanguage;
}

function getTextFromDictionary(dictionaryKey) {
  return activeDictionary[dictionaryKey];
}

export {
  setActiveLanguage, getActiveLanguage, getTextFromDictionary,
};
