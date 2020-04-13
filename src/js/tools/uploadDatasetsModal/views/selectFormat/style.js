let descriptionElement = null;
let startButtonElement = null;
let cancelButtonElement = null;
let buttonsGroupElement = null;
let selectFormatOuterContainerElement = null;

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

function displayStartButtonElement() {
  startButtonElement.style.display = '';
}

function hideStartButtonElement() {
  startButtonElement.style.display = 'none';
}

function hideDescriptionElement() {
  descriptionElement.style.display = 'none';
}

function setButtonGroupElementMarginTop(length) {
  buttonsGroupElement.style.marginTop = length;
}

function prepareSelectFormatView() {
  displayStartButtonElement();
  setButtonGroupElementMarginTop('5px');
  displayCancelButtonElement();
  displaySelectFormatOuterContainerElementView();
}

function hideSelectFormatViewAssets() {
  hideStartButtonElement();
  hideDescriptionElement();
  hideCancelButtonElement();
  hideSelectFormatOuterContainerElement();
}

function assignSelectFormatViewLocalVariables() {
  descriptionElement = document.getElementById('upload-datasets-modal-description');
  startButtonElement = document.getElementById('upload-datasets-modal-start-button');
  cancelButtonElement = document.getElementById('upload-datasets-modal-cancel-button');
  buttonsGroupElement = document.getElementById('upload-datasets-modal-buttons');
  selectFormatOuterContainerElement = document.getElementById('upload-datsets-modal-select-format-outer-container');
}

export {
  assignSelectFormatViewLocalVariables, prepareSelectFormatView, hideSelectFormatViewAssets,
};
