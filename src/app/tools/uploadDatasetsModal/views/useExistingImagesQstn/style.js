import { getScreenSizeDelta } from '../../../globalStyling/screenSizeDelta.js';

let yesButtonElement = null;
let noButtonElement = null;
let descriptionElement = null;
let buttonsGroupElement = null;
const DESCRIPTION_TEXT = 'Reuse already uploaded images?';

function displayYesButtonElement() {
  yesButtonElement.style.display = '';
}

function hideYesButtonElement() {
  yesButtonElement.style.display = 'none';
}

function displayNoButtonElement() {
  noButtonElement.style.display = '';
}

function hideNoButtonElement() {
  noButtonElement.style.display = 'none';
}

function setDescriptionElementMarginTop(length) {
  descriptionElement.style.marginTop = `${length / getScreenSizeDelta()}px`;
}

function resetDescriptionElementMarginTop() {
  descriptionElement.style.marginTop = '';
}

function setDescriptionElementText(text) {
  descriptionElement.innerHTML = text;
}

function centerDescriptionElementText() {
  descriptionElement.style.textAlign = 'center';
}

function resetDescriptionElementTextAlign() {
  descriptionElement.style.textAlign = '';
}

function displayDescriptionElement() {
  descriptionElement.style.display = '';
}

function hideDescriptionElement() {
  descriptionElement.style.display = 'none';
}

function setButtonGroupElementMarginTop(length) {
  buttonsGroupElement.style.marginTop = `${length / getScreenSizeDelta()}px`;
}

function resetButtonGroupElementMarginTop() {
  buttonsGroupElement.style.marginTop = '';
}

function prepareUseExistingImagesQstnView() {
  setDescriptionElementText(DESCRIPTION_TEXT);
  centerDescriptionElementText();
  setDescriptionElementMarginTop(61);
  displayYesButtonElement();
  displayNoButtonElement();
  displayDescriptionElement();
  setButtonGroupElementMarginTop(5);
}

function hideUseExistingImagesViewAssets() {
  resetDescriptionElementTextAlign();
  resetDescriptionElementMarginTop();
  hideDescriptionElement();
  hideYesButtonElement();
  hideNoButtonElement();
  resetButtonGroupElementMarginTop();
}

function assignUseExistingImagesQstnViewLocalVariables() {
  yesButtonElement = document.getElementById('upload-datsets-modal-yes-button');
  noButtonElement = document.getElementById('upload-datasets-modal-no-button');
  descriptionElement = document.getElementById('upload-datasets-modal-description');
  buttonsGroupElement = document.getElementById('upload-datasets-modal-buttons');
}

export {
  assignUseExistingImagesQstnViewLocalVariables,
  hideUseExistingImagesViewAssets, prepareUseExistingImagesQstnView,
};
