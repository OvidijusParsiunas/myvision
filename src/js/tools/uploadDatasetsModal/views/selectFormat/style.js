import { getAvailableFormats } from '../../stateMachine';

let descriptionElement = null;
let cancelButtonElement = null;
let buttonsGroupElement = null;
let nextButtonElement = null;
let tableElement = null;
let uploadDatasetsModalElement = null;
let selectFormatOuterContainerElement = null;

let isCheckboxSelected = false;
let isNextButtonActive = false;
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

function setUploadDatasetsModalHeight(length) {
  uploadDatasetsModalElement.style.height = length;
}

function resetUploadDatasetsModalHeight() {
  uploadDatasetsModalElement.style.height = '';
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
  buttonsGroupElement.style.marginTop = length;
}

function resetButtonGroupElementMarginTop() {
  buttonsGroupElement.style.marginTop = '';
}

function createTableRow(format, index) {
  const paddingTop = index === 2 ? '5px"' : '3px';
  return `
    <td style="padding-top:${paddingTop}" class="data-format-table-row-data">
      <div class="checkbox-text format-option-text bounding-box-format-option-text">
        ${format}
      </div>
      <input style="margin-right: 1px" class="bounding-box-format-option-checkbox checkbox" type="checkbox" name="something" onclick="selectUploadDatasetsFormat('${format}', this)">
    </td>
  `;
}

function populateFormatsTable(formats) {
  formats.forEach((format, index) => {
    const row = tableElement.insertRow(-1);
    row.innerHTML = createTableRow(format, index);
  });
}

function prepareSelectFormatView() {
  displayNextButtonElement();
  setUploadDatasetsModalHeight('270px');
  setButtonGroupElementMarginTop('5px');
  displayCancelButtonElement();
  displaySelectFormatOuterContainerElementView();
}

function hideSelectFormatViewAssets() {
  hideNextButtonElement();
  resetUploadDatasetsModalHeight();
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
  uploadDatasetsModalElement = document.getElementById('upload-datasets-modal-parent');
  selectFormatOuterContainerElement = document.getElementById('upload-datsets-modal-select-format-outer-container');
  populateFormatsTable(getAvailableFormats());
}

export {
  assignSelectFormatViewLocalVariables, selectFormat, populateFormatsTable,
  hideSelectFormatViewAssets, prepareSelectFormatView,
};
