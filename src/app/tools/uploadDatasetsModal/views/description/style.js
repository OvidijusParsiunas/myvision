import { getScreenSizeDelta } from '../../../globalStyling/screenSizeDelta.js';

let descriptionElement = null;
let startButtonElement = null;
let cancelButtonElement = null;
let buttonsGroupElement = null;

function displayCancelButtonElement() {
  cancelButtonElement.style.display = '';
}

function hideCancelButtonElement() {
  cancelButtonElement.style.display = 'none';
}

function displayStartButtonElement() {
  startButtonElement.style.display = '';
}

function hideStartButtonElement() {
  startButtonElement.style.display = 'none';
}

function moveButtonsGroupElementToLowerPosition() {
  buttonsGroupElement.style.marginTop = `${14 / getScreenSizeDelta()}px`;
}

function displayDescription() {
  descriptionElement.style.display = '';
}

function hideDescriptionElement() {
  descriptionElement.style.display = 'none';
}

function moveDescriptionToLowerPosition() {
  descriptionElement.style.marginTop = `${26 / getScreenSizeDelta()}px`;
}

function getDefaultDescriptionMarkup() {
  return `
    Upload existing images/datasets and continue working on them in MyVision.
    <br>
    <div class="upload-datasets-modal-description-break"></div>
    It is important to note that everything you upload will never leave the privacy of your computer.`;
}

function prepareDescriptionView() {
  descriptionElement.innerHTML = getDefaultDescriptionMarkup();
  displayDescription();
  moveDescriptionToLowerPosition();
  displayStartButtonElement();
  moveButtonsGroupElementToLowerPosition();
  displayCancelButtonElement();
}

function hideDescriptionViewAssets() {
  hideStartButtonElement();
  hideDescriptionElement();
  hideCancelButtonElement();
}

function assignDescriptionViewLocalVariables() {
  descriptionElement = document.getElementById('upload-datasets-modal-description');
  startButtonElement = document.getElementById('upload-datasets-modal-start-button');
  cancelButtonElement = document.getElementById('upload-datasets-modal-cancel-button');
  buttonsGroupElement = document.getElementById('upload-datasets-modal-buttons');
}

export {
  assignDescriptionViewLocalVariables, prepareDescriptionView, hideDescriptionViewAssets,
};
