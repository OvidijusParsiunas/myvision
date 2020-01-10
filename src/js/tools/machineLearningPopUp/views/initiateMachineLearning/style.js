let isUploadImagesButtonDisplayed = false;
let isNoImagesFoundErrorDisplayed = false;

let loaderWheelElement = null;
let descriptionElement = null;
let buttonsGroupElement = null;
let submitButtonElement = null;
let cancelButtonElement = null;
let errorMessagesElement = null;
let progressMessagesElement = null;
let toolkitUploadImagesButton = null;

let initiateMachineLearningParentElement = null;

function removeErrorMessage() {
  errorMessagesElement.innerHTML = '';
  buttonsGroupElement.style.marginTop = '14px';
}

function removeProgressMessage() {
  progressMessagesElement.innerHTML = '';
  buttonsGroupElement.style.marginTop = '14px';
}

function displayErrorMessage(errorMessage) {
  removeProgressMessage();
  errorMessagesElement.innerHTML = errorMessage;
  buttonsGroupElement.style.marginTop = '7px';
}

function updateProgressMessage(progressMessage) {
  removeErrorMessage();
  progressMessagesElement.style.display = '';
  progressMessagesElement.innerHTML = progressMessage;
  buttonsGroupElement.style.marginTop = '7px';
}

function displayLoaderWheel() {
  loaderWheelElement.style.display = '';
  cancelButtonElement.style.marginRight = '3px';
  descriptionElement.style.marginBottom = '0px';
}

function displayContinueButton() {
  submitButtonElement.innerHTML = 'Next';
  submitButtonElement.style.display = '';
  submitButtonElement.style.width = '55px';
  submitButtonElement.style.marginLeft = '3px';
  descriptionElement.style.marginBottom = '4px';
}

function removeCancelButton() {
  cancelButtonElement.style.display = 'none';
}

function removeStartButton() {
  submitButtonElement.style.display = 'none';
}

function disableStartButton() {
  setTimeout(() => {
    submitButtonElement.classList.replace('popup-label-button', 'popup-label-button-disabled');
  });
}

function enableStartButton() {
  submitButtonElement.classList.replace('popup-label-button-disabled', 'popup-label-button');
}

function highlightCancelButton() {
  cancelButtonElement.style.backgroundColor = '#e2acac';
}

function displayUploadImagesButton() {
  toolkitUploadImagesButton.style.zIndex = 3;
  toolkitUploadImagesButton.style.border = '2px solid rgb(218, 197, 73)';
  isUploadImagesButtonDisplayed = true;
}

function hideUploadImagesButton() {
  toolkitUploadImagesButton.style.zIndex = 1;
  toolkitUploadImagesButton.style.border = '';
  isUploadImagesButtonDisplayed = false;
}

function closeMachineLearningPopUp() {
  if (isUploadImagesButtonDisplayed) {
    setTimeout(() => {
      hideUploadImagesButton();
    }, 2000);
  }
}

function displayNoImagesFoundError() {
  displayUploadImagesButton();
  disableStartButton();
  displayErrorMessage('Please upload an image before using Machine Learning');
  isNoImagesFoundErrorDisplayed = true;
}

function removeUploadedImageAfterNoneFoundError() {
  if (isNoImagesFoundErrorDisplayed) {
    hideUploadImagesButton();
    removeErrorMessage();
    enableStartButton();
    isNoImagesFoundErrorDisplayed = false;
  }
}

function assignInitiateMachineLearningViewLocalVariables() {
  toolkitUploadImagesButton = document.getElementById('uploadImagesButton');
  loaderWheelElement = document.getElementById('machinelearning-popup-loader-wheel');
  descriptionElement = document.getElementById('machine-learning-popup-description');
  submitButtonElement = document.getElementById('machine-learning-popup-submit-button');
  cancelButtonElement = document.getElementById('machine-learning-popup-cancel-button');
  buttonsGroupElement = document.getElementById('machine-learning-popup-initiate-machine-learning-buttons');
  errorMessagesElement = document.getElementById('machine-learning-popup-error-messages');
  progressMessagesElement = document.getElementById('machine-learning-popup-progress-messages');
  initiateMachineLearningParentElement = document.getElementById('machine-learning-popup-initiate-machine-learning');
}

function hideInitiateMachineLearningViewAssets() {
  initiateMachineLearningParentElement.style.display = 'none';
  progressMessagesElement.style.display = 'none';
}

function prepareInstantiateMachineLearningView() {
  descriptionElement.style.marginBottom = '10px';
  cancelButtonElement.style.marginRight = '';
}

export {
  removeStartButton, disableStartButton, displayNoImagesFoundError,
  prepareInstantiateMachineLearningView, displayUploadImagesButton,
  removeUploadedImageAfterNoneFoundError, closeMachineLearningPopUp,
  displayErrorMessage, updateProgressMessage, highlightCancelButton,
  assignInitiateMachineLearningViewLocalVariables, enableStartButton,
  hideInitiateMachineLearningViewAssets, displayContinueButton, removeCancelButton,
  displayLoaderWheel,
};
