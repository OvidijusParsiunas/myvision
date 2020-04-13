let descriptionElement = null;
let cancelButtonElement = null;
let buttonsGroupElement = null;
let nextButtonElement = null;
let selectFormatOuterContainerElement = null;

let isCheckboxSelected = false;
let currentlySelectedCheckboxElement = null;

function enableExportButton() {
  console.log('enable');
}

function disableExportButton() {
  console.log('disable');
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
  buttonsGroupElement.style.marginTop = length;
}

function prepareSelectFormatView() {
  displayNextButtonElement();
  setButtonGroupElementMarginTop('5px');
  displayCancelButtonElement();
  displaySelectFormatOuterContainerElementView();
}

function hideSelectFormatViewAssets() {
  hideNextButtonElement();
  hideDescriptionElement();
  hideCancelButtonElement();
  hideSelectFormatOuterContainerElement();
}

function assignSelectFormatViewLocalVariables() {
  descriptionElement = document.getElementById('upload-datasets-modal-description');
  cancelButtonElement = document.getElementById('upload-datasets-modal-cancel-button');
  buttonsGroupElement = document.getElementById('upload-datasets-modal-buttons');
  nextButtonElement = document.getElementById('upload-datsets-modal-select-format-next-button');
  selectFormatOuterContainerElement = document.getElementById('upload-datsets-modal-select-format-outer-container');
}

export {
  assignSelectFormatViewLocalVariables, selectFormat,
  hideSelectFormatViewAssets, prepareSelectFormatView,
};
