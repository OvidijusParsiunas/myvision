import chineseMadarin from './dictionaries/chineseMandarin';
import english from './dictionaries/english';

const availableLanguages = ['EN', 'CN'];
const languageToDictionary = { EN: english, CN: chineseMadarin };
let activeLanguage = availableLanguages[0];
let activeDictionary = languageToDictionary[activeLanguage];

function getLanguage() {
  return activeLanguage;
}

function setLanguage(newLanguage) {
  activeLanguage = newLanguage;
  activeDictionary = languageToDictionary[newLanguage];
}

function getAvailableLanguages() {
  return availableLanguages;
}

function getDictionary() {
  return activeDictionary;
}

function getTextFromDictionary(dictionaryKey) {
  return activeDictionary[dictionaryKey];
}

export {
  getAvailableLanguages, getLanguage, setLanguage, getDictionary, getTextFromDictionary,
};
