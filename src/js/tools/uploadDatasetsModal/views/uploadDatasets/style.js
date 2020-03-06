let isNoImagesFoundInfoDisplayed = false;

let titleElement = null;
let backButtonElement = null;
let imagesTableElement = null;
let latestImageTableIndex = 0;
let buttonsGroupElement = null;
let uploadButtonElement = null;
let annotationsTableElement = null;
let uploadDatasetFilesTriggerElement = null;
let uploadDatasetsOuterContainerElement = null;

function createImageElementMarkup(imageName, id) {
  return `
    <div class="upload-datasets-modal-upload-datasets-table-row">
      <div id="MLLabelText${id}" class="upload-datasets-modal-upload-datasets-table-row-text">${imageName}</div>
    </div>
  `;
}

function insertRowToImagesTable(imageName) {
  const newNameRow = imagesTableElement.insertRow(-1);
  const cell = newNameRow.insertCell(0);
  cell.innerHTML = createImageElementMarkup(imageName, latestImageTableIndex);

  const newNameRow2 = annotationsTableElement.insertRow(-1);
  const cell2 = newNameRow2.insertCell(0);
  cell2.innerHTML = createImageElementMarkup(imageName, latestImageTableIndex);
  // if (index > 4) {
  //   changeElementsToMoveListUpwards();
  // } else {
  //   resetElementsToMoveListToDefaultPosition();
  // }
}

function setTitleElement(title) {
  titleElement.innerHTML = title;
}

function setTitleElementMarginTop(pixels) {
  titleElement.style.marginTop = pixels;
}

function resetTitleElementMarginTop() {
  titleElement.style.marginTop = '';
}

function setButtonGroupElementMarginTop(pixels) {
  buttonsGroupElement.style.marginTop = pixels;
}

function resetButtonGroupElementMarginTop() {
  buttonsGroupElement.style.marginTop = '';
}

function displayUploadButtonElement() {
  uploadButtonElement.style.display = '';
}

function hideUploadButtonElement() {
  uploadButtonElement.style.display = 'none';
}

function displayBackButton() {
  backButtonElement.style.display = '';
}

function hideBackButton() {
  backButtonElement.style.display = 'none';
}

function displayUploadDatasetsOuterContainerElement() {
  uploadDatasetsOuterContainerElement.style.display = '';
}

function hideUploadDatasetsOuterContainerElement() {
  uploadDatasetsOuterContainerElement.style.display = 'none';
}

function setTriggerAcceptedFileFormat(format) {
  uploadDatasetFilesTriggerElement.accept = format;
}

// will later take an object argument with relevant input attributes
function prepareUploadDatasetsView() {
  setTitleElementMarginTop('8px');
  setTitleElement('COCO JSON');
  setTriggerAcceptedFileFormat('.csv, image/*');
  setButtonGroupElementMarginTop('6px');
  displayBackButton();
  displayUploadButtonElement();
  displayUploadDatasetsOuterContainerElement();
  document.getElementById('upload-datasets-modal-parent').style.width = '420px';
  document.getElementById('upload-datasets-modal-parent').style.height = '260px';
}

function hideUploadDatasetsViewAssets() {
  hideBackButton();
  hideUploadButtonElement();
  resetTitleElementMarginTop();
  resetButtonGroupElementMarginTop();
  hideUploadDatasetsOuterContainerElement();
}

function assignUploadDatasetsViewLocalVariables() {
  buttonsGroupElement = document.getElementById('upload-datasets-modal-buttons');
  titleElement = document.getElementById('upload-datsets-modal-upload-datasets-title');
  uploadDatasetsOuterContainerElement = document.getElementById('upload-datsets-modal-upload-datasets-outer-container');
  uploadButtonElement = document.getElementById('upload-datasets-modal-upload-datasets-upload-button');
  uploadDatasetFilesTriggerElement = document.getElementById('upload-datasets-modal-upload-datasets-upload-trigger');
  backButtonElement = document.getElementById('upload-datasets-modal-back-button');
  imagesTableElement = document.getElementById('upload-datsets-modal-upload-datasets-images-table');
  annotationsTableElement = document.getElementById('upload-datsets-modal-upload-datasets-annotations-table');
}

export {
  hideUploadDatasetsViewAssets, insertRowToImagesTable,
  assignUploadDatasetsViewLocalVariables, prepareUploadDatasetsView,
};
