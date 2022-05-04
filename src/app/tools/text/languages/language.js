import chineseMandarin from './dictionaries/chineseMandarin';
import english from './dictionaries/english';

const languageToDictionary = { EN: english, CN: chineseMandarin };
const defaultLanguage = Object.keys(languageToDictionary)[0];
let activeDictionary = languageToDictionary[defaultLanguage];

function setLanguage(newLanguage) {
  activeDictionary = languageToDictionary[newLanguage];
}

function getTextFromDictionary(dictionaryKey) {
  return activeDictionary[dictionaryKey];
}

export {
  setLanguage, getTextFromDictionary,
};
