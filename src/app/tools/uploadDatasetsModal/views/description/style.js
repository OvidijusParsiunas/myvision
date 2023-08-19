import { getScreenSizeDelta } from '../../../globalStyling/customCssProperties';
import { getTextFromDictionary } from '../../../text/languages/language';

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
    ${getTextFromDictionary('UPLOAD_DATASETS_MODAL_DESCRIPTION_PAR_1')}
    <br>
    <div class="upload-datasets-modal-description-break"></div>
    ${getTextFromDictionary('UPLOAD_DATASETS_MODAL_DESCRIPTION_PAR_2')}`;
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
