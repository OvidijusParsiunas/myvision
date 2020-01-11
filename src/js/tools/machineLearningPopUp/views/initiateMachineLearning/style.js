let isUploadImagesButtonDisplayed = false;
let isNoImagesFoundErrorDisplayed = false;

let nextButtonElement = null;
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
}

function removeProgressMessage() {
  progressMessagesElement.innerHTML = '';
}

function displayErrorMessage(errorMessage) {
  removeProgressMessage();
  errorMessagesElement.innerHTML = errorMessage;
  buttonsGroupElement.style.marginTop = '4px';
}

function displayErrorButtons() {
  document.getElementById('machine-learning-popup-initiate-retry-button').style.display = '';
  descriptionElement.style.marginBottom = '6px';
}

function removeErrorButtons() {
  document.getElementById('machine-learning-popup-initiate-retry-button').style.display = 'none';
  descriptionElement.style.marginBottom = '';
}

function updateProgressMessage(progressMessage) {
  removeErrorMessage();
  progressMessagesElement.style.display = '';
  progressMessagesElement.innerHTML = progressMessage;
}

function displayLoaderWheel() {
  removeErrorMessage();
  loaderWheelElement.style.display = '';
  cancelButtonElement.style.marginRight = '3px';
  descriptionElement.style.marginBottom = '0px';
}

function removeLoaderWheel() {
  loaderWheelElement.style.display = 'none';
  cancelButtonElement.style.marginRight = '';
  descriptionElement.style.marginBottom = '';
}

function displayContinueButton() {
  nextButtonElement.style.display = '';
  descriptionElement.style.marginBottom = '5px';
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
  submitButtonElement = document.getElementById('machine-learning-popup-initiate-start-button');
  nextButtonElement = document.getElementById('machine-learning-popup-initiate-next-button');
  cancelButtonElement = document.getElementById('machine-learning-popup-initiate-cancel-button');
  buttonsGroupElement = document.getElementById('machine-learning-popup-initiate-machine-learning-buttons');
  errorMessagesElement = document.getElementById('machine-learning-popup-error-messages');
  progressMessagesElement = document.getElementById('machine-learning-popup-progress-messages');
  initiateMachineLearningParentElement = document.getElementById('machine-learning-popup-initiate-machine-learning');
}

function hideInitiateMachineLearningViewAssets() {
  initiateMachineLearningParentElement.style.display = 'none';
  progressMessagesElement.style.display = 'none';
  descriptionElement.style.marginBottom = '';
}

function prepareInstantiateMachineLearningView() {
  descriptionElement.style.marginBottom = '';
  cancelButtonElement.style.marginRight = '';
}

export {
  removeStartButton, disableStartButton, displayNoImagesFoundError,
  prepareInstantiateMachineLearningView, displayUploadImagesButton,
  removeUploadedImageAfterNoneFoundError, closeMachineLearningPopUp,
  displayErrorMessage, updateProgressMessage, highlightCancelButton,
  assignInitiateMachineLearningViewLocalVariables, enableStartButton,
  hideInitiateMachineLearningViewAssets, displayContinueButton, removeCancelButton,
  displayLoaderWheel, removeLoaderWheel, displayErrorButtons, removeErrorButtons,
};
