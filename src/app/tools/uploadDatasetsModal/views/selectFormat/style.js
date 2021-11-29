import { getAvailableFormats } from '../../state.js';
import { getScreenSizeDelta } from '../../../globalStyling/screenSizeDelta.js';

let descriptionElement = null;
let cancelButtonElement = null;
let buttonsGroupElement = null;
let nextButtonElement = null;
let tableElement = null;
let selectFormatOuterContainerElement = null;

let isCheckboxSelected = false;
let isNextButtonActive = false;
let formatsTablePopulated = false;
let currentlySelectedCheckboxElement = null;

const PROCEED_BUTTON_CLASS = 'popup-proceed-button';
const ACTIVE_BUTTON_CLASS = 'popup-label-button';
const DISABLED_BUTTON_CLASS = 'popup-label-button-disabled';

function enableExportButton() {
  if (!isNextButtonActive) {
    nextButtonElement.classList.add(PROCEED_BUTTON_CLASS);
    nextButtonElement.classList.replace(DISABLED_BUTTON_CLASS, ACTIVE_BUTTON_CLASS);
    isNextButtonActive = true;
  }
}

function disableExportButton() {
  nextButtonElement.classList.remove(PROCEED_BUTTON_CLASS);
  nextButtonElement.classList.replace(ACTIVE_BUTTON_CLASS, DISABLED_BUTTON_CLASS);
  isNextButtonActive = false;
}

function uncheckCurrentlySelectedCheckbox() {
  currentlySelectedCheckboxElement.checked = false;
}

function selectFormat(target) {
  if (!isCheckboxSelected) {
    currentlySelectedCheckboxElement = target;
    enableExportButton();
    isCheckboxSelected = true;
  } else if (target === currentlySelectedCheckboxElement) {
    isCheckboxSelected = false;
    disableExportButton();
  } else {
    uncheckCurrentlySelectedCheckbox();
    currentlySelectedCheckboxElement = target;
  }
}

function displaySelectFormatOuterContainerElementView() {
  selectFormatOuterContainerElement.style.display = '';
}

function hideSelectFormatOuterContainerElement() {
  selectFormatOuterContainerElement.style.display = 'none';
}

function displayCancelButtonElement() {
  cancelButtonElement.style.display = '';
}

function hideCancelButtonElement() {
  cancelButtonElement.style.display = 'none';
}

function displayNextButtonElement() {
  nextButtonElement.style.display = '';
}

function hideNextButtonElement() {
  nextButtonElement.style.display = 'none';
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

function createTableRow(format, index) {
  const paddingTop = index === 2 ? 5 / getScreenSizeDelta() : 3 / getScreenSizeDelta();
  return `
    <td style="padding-top: ${paddingTop}px" class="data-format-table-row-data">
      <div class="checkbox-text format-option-text upload-data-format-row-text">
        ${format}
      </div>
      <input class="checkbox upload-datasets-format-checkbox" type="checkbox" name="something" onclick="selectUploadDatasetsFormat('${format}', this)">
    </td>
  `;
}

function populateFormatsTable(formats) {
  formats.forEach((format, index) => {
    const row = tableElement.insertRow(-1);
    row.innerHTML = createTableRow(format, index);
  });
  formatsTablePopulated = true;
}

function prepareSelectFormatView() {
  displayNextButtonElement();
  setButtonGroupElementMarginTop(5);
  displayCancelButtonElement();
  if (!formatsTablePopulated) { populateFormatsTable(getAvailableFormats()); }
  displaySelectFormatOuterContainerElementView();
}

function hideSelectFormatViewAssets() {
  hideNextButtonElement();
  hideDescriptionElement();
  resetButtonGroupElementMarginTop();
  hideCancelButtonElement();
  hideSelectFormatOuterContainerElement();
}

function assignSelectFormatViewLocalVariables() {
  tableElement = document.getElementById('upload-datsets-modal-select-format-table');
  nextButtonElement = document.getElementById('upload-datsets-modal-next-button');
  descriptionElement = document.getElementById('upload-datasets-modal-description');
  cancelButtonElement = document.getElementById('upload-datasets-modal-cancel-button');
  buttonsGroupElement = document.getElementById('upload-datasets-modal-buttons');
  selectFormatOuterContainerElement = document.getElementById('upload-datsets-modal-select-format-outer-container');
}

export {
  assignSelectFormatViewLocalVariables, selectFormat, populateFormatsTable,
  hideSelectFormatViewAssets, prepareSelectFormatView,
};
