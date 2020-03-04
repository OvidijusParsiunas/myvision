let isNoImagesFoundInfoDisplayed = false;

let titleElement = null;
let backButtonElement = null;
let uploadButtonElement = null;
let uploadDatasetFilesTriggerElement = null;
let uploadDatasetsOuterContainerElement = null;

// function displayUploadImagesButton() {
//   toolkitUploadImagesButton.style.zIndex = 3;
//   toolkitUploadImagesButton.style.border = '2px solid rgb(73, 178, 218)';
// }

// function hideUploadImagesButton() {
//   toolkitUploadImagesButton.style.zIndex = 1;
//   toolkitUploadImagesButton.style.border = '';
// }

// function increasePopUpHeight(height) {
//   modalParentElement.style.height = height;
// }

// function setDefaultPopUpHeight() {
//   modalParentElement.style.height = '';
// }

// function setDescriptionElementMarginBottom(height) {
//   descriptionElement.style.marginBottom = height;
// }

// function setDefaultDescriptionElementMarginBottom() {
//   descriptionElement.style.marginBottom = '';
// }

// function changeToLoadingStyle() {
//   displayLoadingText();
//   removeDescription();
//   disableImmediateCancelButtonHoverEffect();
//   displayLoaderWheel();
//   removeStartButton();
// }

// function changeToMLCompleteStyle() {
//   displayCheckMarkWthAnimation();
//   changeProgressMessageColor('#1e6d1e');
//   updateProgressMessage('Finished!');
// }

// function changeToNoImagesFoundStyle() {
//   displayUploadImagesButton();
//   disableStartButton();
//   displayInfoMessage('Please upload an image to get started.');
//   setDescriptionElementMarginBottom('3px');
//   increasePopUpHeight('259px');
//   isNoImagesFoundInfoDisplayed = true;
// }

// function removeNoImagesFoundOnMLModalStyle() {
//   if (isNoImagesFoundInfoDisplayed) {
//     hideUploadImagesButton();
//     removeInfoMessage();
//     enableStartButton();
//     setDefaultPopUpHeight();
//     setDefaultDescriptionElementMarginBottom();
//     isNoImagesFoundInfoDisplayed = false;
//   }
// }

// function hideInitiateMachineLearningViewAssets() {
//   removeNextButton();
//   removeProgressMessage();
//   removeCheckMark();
//   buttonsGroupElement.style.display = 'none';
//   descriptionElement.style.marginBottom = '';
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
  setTriggerAcceptedFileFormat('.csv');
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
