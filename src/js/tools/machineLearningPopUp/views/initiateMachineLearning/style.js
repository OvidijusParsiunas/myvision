let isUploadImagesButtonDisplayed = false;
let isNoImagesFoundErrorDisplayed = false;

let buttonsElement = null;
let submitButtonElement = null;
let cancelButtonElement = null;
let errorMessagesElement = null;
let progressMessagesElement = null;
let toolkitUploadImagesButton = null;

function removeErrorMessage() {
  errorMessagesElement.innerHTML = '';
  buttonsElement.style.marginTop = '12px';
}

function removeProgressMessage() {
  progressMessagesElement.innerHTML = '';
  buttonsElement.style.marginTop = '12px';
}

function displayErrorMessage(errorMessage) {
  removeProgressMessage();
  errorMessagesElement.innerHTML = errorMessage;
  buttonsElement.style.marginTop = '5px';
}

function updateProgressMessage(progressMessage) {
  removeErrorMessage();
  progressMessagesElement.innerHTML = progressMessage;
  buttonsElement.style.marginTop = '5px';
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
  buttonsElement = document.getElementById('machine-learning-popup-buttons');
  submitButtonElement = document.getElementById('machine-learning-popup-submit-button');
  cancelButtonElement = document.getElementById('machine-learning-popup-cancel-button');
  errorMessagesElement = document.getElementById('machine-learning-popup-error-messages');
  progressMessagesElement = document.getElementById('machine-learning-popup-progress-messages');
}

function prepareInstantiateMachineLearningView() {

}

export {
  removeStartButton, disableStartButton, displayNoImagesFoundError,
  prepareInstantiateMachineLearningView, displayUploadImagesButton,
  removeUploadedImageAfterNoneFoundError, closeMachineLearningPopUp,
  displayErrorMessage, updateProgressMessage, highlightCancelButton,
  assignInitiateMachineLearningViewLocalVariables, enableStartButton,
};
