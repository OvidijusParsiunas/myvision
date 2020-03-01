let isNoImagesFoundInfoDisplayed = false;

let descriptionElement = null;
let startButtonElement = null;
let cancelButtonElement = null;

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

// function removeNoImagesFoundStyle() {
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

function displayCancelButtonElement() {
  cancelButtonElement.style.display = '';
}

function displayStartButtonElement() {
  startButtonElement.style.display = '';
}

function hideStartButtonElement() {
  startButtonElement.style.display = 'none';
}

function displayDescription() {
  descriptionElement.style.display = '';
}

function getDefaultDescriptionMarkup() {
  return `
    Upload existing images/datasets from your computer and continue working on them in MyLabel.
    <br>
    <div class="upload-datasets-description-break"></div>
    It is important to note that everything you upload here will never leave the privacy of your computer.`;
}

function prepareDescriptionView() {
//   setDefaultDescriptionElementMarginBottom();
  descriptionElement.innerHTML = getDefaultDescriptionMarkup();
  displayDescription();
  displayStartButtonElement();
  displayCancelButtonElement();
//   displayStartButton();
//   displayCancelButton();
//   removeLoadingContent();
}

function hideDescriptionViewAssets() {
  hideStartButtonElement();
}

function assignDescriptionViewLocalVariables() {
  descriptionElement = document.getElementById('upload-datasets-modal-description');
  startButtonElement = document.getElementById('upload-datasets-modal-start-button');
  cancelButtonElement = document.getElementById('upload-datasets-modal-cancel-button');
}

export {
  assignDescriptionViewLocalVariables, prepareDescriptionView, hideDescriptionViewAssets,
};
