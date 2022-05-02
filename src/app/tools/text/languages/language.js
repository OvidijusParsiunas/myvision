import chineseMadarin from './dictionaries/chineseMandarin';
import english from './dictionaries/english';

const availableLanguages = ['EN', 'CH'];
const languageToDictionary = { EN: english, CH: chineseMadarin };
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

export {
  getAvailableLanguages, getLanguage, setLanguage, getDictionary,
};
