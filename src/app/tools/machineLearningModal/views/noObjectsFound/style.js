import { getScreenSizeDelta } from '../../../globalStyling/customCssProperties';
import { getTextFromDictionary } from '../../../text/languages/language';

let descriptionElement: HTMLElement | null = null;
let buttonGroupElement: HTMLElement | null = null;

function changeModalDescription() {
  if (descriptionElement) {
    descriptionElement.innerHTML = getTextFromDictionary('ML_NO_ANNOTATED_IMAGES_RESULT');
  }
}

function displayDescription() {
  if (descriptionElement) {
    descriptionElement.style.display = '';
  }
}

function setDescriptionElementMargins() {
  if (descriptionElement) {
    descriptionElement.style.marginTop = `${19 / getScreenSizeDelta()}px`;
    descriptionElement.style.marginBottom = `${15 / getScreenSizeDelta()}px`;
  }
}

function setDefaultDescriptionElementMargins() {
  if (descriptionElement) {
    descriptionElement.style.marginTop = '';
    descriptionElement.style.marginBottom = '';
  }
}

function displayButtonGroupElement() {
  if (buttonGroupElement) {
    buttonGroupElement.style.display = '';
  }
}

function displayNoObjectsFoundView() {
  setDescriptionElementMargins();
  changeModalDescription();
  displayDescription();
  displayButtonGroupElement();
}

function hideNoObjectsFoundViewAssets() {
  setDefaultDescriptionElementMargins();
  if (buttonGroupElement) {
    buttonGroupElement.style.display = 'none';
  }
}

function assignNoObjectsFoundViewLocalVariables() {
  descriptionElement = document.getElementById('machine-learning-modal-description');
  buttonGroupElement = document.getElementById('machine-learning-modal-no-objects-buttons');
}

export default {
  assignNoObjectsFoundViewLocalVariables,
  displayNoObjectsFoundView,
  hideNoObjectsFoundViewAssets,
};

