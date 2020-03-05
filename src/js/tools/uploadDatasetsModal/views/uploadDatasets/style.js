let isNoImagesFoundInfoDisplayed = false;

let titleElement = null;
let backButtonElement = null;
let imagesTableElement = null;
let latestImageTableIndex = 0;
let uploadButtonElement = null;
let uploadDatasetFilesTriggerElement = null;
let uploadDatasetsOuterContainerElement = null;

function createImageElementMarkup(imageName, id) {
  return `
    <div class="machine-learning-modal-generated-labels-row">
      <div id="MLLabelText${id}" class="machine-learning-modal-generated-labels-input" spellcheck="false" onkeydown="MLLabelTextKeyDown(event)" onpaste="MLLabelTextPaste(event)">${imageName}</div>
    </div>
  `;
}

function insertRowToImagesTable(imageName) {
  const newNameRow = imagesTableElement.insertRow(-1);
  const cell = newNameRow.insertCell(0);
  cell.innerHTML = createImageElementMarkup(imageName, latestImageTableIndex);
  // if (index > 4) {
  //   changeElementsToMoveListUpwards();
  // } else {
  //   resetElementsToMoveListToDefaultPosition();
  // }
}

function setTitleElement(title) {
  titleElement.innerHTML = title;
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
  setTitleElement('COCO JSON');
  setTriggerAcceptedFileFormat('.csv, image/*');
  displayBackButton();
  displayUploadButtonElement();
  displayUploadDatasetsOuterContainerElement();
}

function hideUploadDatasetsViewAssets() {
  hideBackButton();
  hideUploadButtonElement();
  hideUploadDatasetsOuterContainerElement();
}

function assignUploadDatasetsViewLocalVariables() {
  titleElement = document.getElementById('upload-datsets-modal-upload-datasets-title');
  uploadDatasetsOuterContainerElement = document.getElementById('upload-datsets-modal-upload-datasets-outer-container');
  uploadButtonElement = document.getElementById('upload-datasets-modal-upload-datasets-upload-button');
  uploadDatasetFilesTriggerElement = document.getElementById('upload-datasets-modal-upload-datasets-upload-trigger');
  backButtonElement = document.getElementById('upload-datasets-modal-back-button');
  imagesTableElement = document.getElementById('upload-datsets-modal-upload-datasets-images-table');
}

export {
  hideUploadDatasetsViewAssets, insertRowToImagesTable,
  assignUploadDatasetsViewLocalVariables, prepareUploadDatasetsView,
};
