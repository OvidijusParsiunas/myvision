import chineseMandarin from './dictionaries/chineseMandarin';
import english from './dictionaries/english';

const languageToDictionary = { EN: english, CN: chineseMandarin };
let activeLanguage = Object.keys(languageToDictionary)[0];
let activeDictionary = languageToDictionary[activeLanguage];

function setActiveLanguage(newLanguage) {
  activeLanguage = newLanguage;
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
