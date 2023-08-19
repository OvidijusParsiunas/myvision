import { getScreenSizeDelta } from '../../../globalStyling/customCssProperties';
import { getTextFromDictionary } from '../../../text/languages/language';

let descriptionElement = null;
let buttonGroupElement = null;

function changeModalDescription() {
  descriptionElement.innerHTML = getTextFromDictionary('ML_NO_ANNOTATED_IMAGES_RESULT');
}

function displayDescription() {
  descriptionElement.style.display = '';
}

function setDescriptionElementMargins(top, bottom) {
  descriptionElement.style.marginTop = top;
  descriptionElement.style.marginBottom = bottom;
}

function setDefaultDescriptionElementMargins() {
  descriptionElement.style.marginTop = '';
  descriptionElement.style.marginBottom = '';
}

function displayButtonGroupElement() {
  buttonGroupElement.style.display = '';
}

function displayNoObjectsFoundView() {
  setDescriptionElementMargins(`${19 / getScreenSizeDelta()}px`, `${15 / getScreenSizeDelta()}px`);
  changeModalDescription();
  displayDescription();
  displayButtonGroupElement();
}

function hideNoObjectsFoundViewAssets() {
  setDefaultDescriptionElementMargins();
  buttonGroupElement.style.display = 'none';
}

function assignNoObjectsFoundViewLocalVariables() {
  descriptionElement = document.getElementById('machine-learning-modal-description');
  buttonGroupElement = document.getElementById('machine-learning-modal-no-objects-buttons');
}

export {
  assignNoObjectsFoundViewLocalVariables, displayNoObjectsFoundView, hideNoObjectsFoundViewAssets,
};
