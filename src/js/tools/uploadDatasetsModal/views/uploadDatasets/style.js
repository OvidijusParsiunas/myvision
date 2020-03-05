let isNoImagesFoundInfoDisplayed = false;

let titleElement = null;
let backButtonElement = null;
let uploadButtonElement = null;
let uploadDatasetFilesTriggerElement = null;
let uploadDatasetsOuterContainerElement = null;

function createLabelElementMarkup(labelText, id) {
  return `
    <div class="machine-learning-modal-generated-labels-row" onClick="editMachineLearningLabel(this)" onMouseEnter="displayMachineLearningModalEditLabelButton(this)" onMouseLeave="hideMachineLearningModalEditLabelButton(this)">
      <img class="defaultLabelEditIcon machine-learning-modal-generated-labels-edit-icon" src="edit-disabled.svg" alt="edit">
      <img id="MLLabelHighlightedEditButton${id}" class="defaultLabelEditIcon machine-learning-modal-generated-labels-edit-icon" style="display: none" src="edit.svg" alt="edit">
      <img id="MLLabelActiveEditButton${id}" class="defaultLabelEditIcon machine-learning-modal-generated-labels-edit-icon reverse-icon" style="display: none" src="edit-blue.svg" alt="edit">
      <img id="MLLabelDisabledEditButton${id}" class="defaultLabelEditIcon machine-learning-modal-generated-labels-edit-icon reverse-icon" style="display: none" src="edit-red.svg" alt="edit">
      <div id="MLLabelText${id}" class="machine-learning-modal-generated-labels-input" spellcheck="false" onkeydown="MLLabelTextKeyDown(event)" onpaste="MLLabelTextPaste(event)">${labelText}</div>
    </div>
  `;
}

// function populateGeneratedLabelsTable() {
//   let index = 0;
//   Object.keys(objectNames).forEach((key) => {
//     const newNameRow = generatedLabelsTableElement.insertRow(-1);
//     const cell = newNameRow.insertCell(0);
//     cell.innerHTML = createLabelElementMarkup(objectNames[key].pendingName, index);
//     index += 1;
//   });
//   if (index > 4) {
//     changeElementsToMoveListUpwards();
//   } else {
//     resetElementsToMoveListToDefaultPosition();
//   }
// }

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
}

export {
  assignUploadDatasetsViewLocalVariables, prepareUploadDatasetsView, hideUploadDatasetsViewAssets,
};
