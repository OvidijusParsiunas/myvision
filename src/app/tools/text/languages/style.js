import { getTextFromDictionary } from './language';

const textProperties = [
  // ... (same as before)
];

function assignTextElements() {
  const elements = new Map();
  textProperties.forEach((textProperty) => {
    const element = document.getElementById(textProperty.id);
    if (!element) {
      throw new Error(`Element with id '${textProperty.id}' not found`);
    }
    elements.set(textProperty.id, element);
  });
  return elements;
}

function populateText(elements) {
  textProperties.forEach((textProperty) => {
    const text = getTextFromDictionary(textProperty.dictionaryKey);
    if (text === null) {
      textProperty.element.innerHTML = '';
    } else {
      textProperty.element.innerHTML = text;
    }
  });
}

export {
  assignTextElements,
  populateText,
};
