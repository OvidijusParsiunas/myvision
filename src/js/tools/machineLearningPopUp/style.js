let isUploadImagesButtonDisplayed = false;
let isNoImagesFoundErrorDisplayed = false;

function removeErrorMessage() {
  const errorMessagesElement = document.getElementById('machine-learning-popup-error-messages');
  errorMessagesElement.innerHTML = '';
}

function removeProgressMessage() {
  const progressMessagesElement = document.getElementById('machine-learning-popup-progress-messages');
  progressMessagesElement.innerHTML = '';
}

function displayErrorMessage(errorMessage) {
  removeProgressMessage();
  const errorMessagesElement = document.getElementById('machine-learning-popup-error-messages');
  errorMessagesElement.innerHTML = errorMessage;
}

function updateProgressMessage(progressMessage) {
  removeErrorMessage();
  const progressMessagesElement = document.getElementById('machine-learning-popup-progress-messages');
  progressMessagesElement.innerHTML = progressMessage;
}

function removeStartButton() {
  const submitButton = document.getElementById('machine-learning-popup-submit-button');
  submitButton.style.display = 'none';
}

function disableStartButton() {
  const submitButton = document.getElementById('machine-learning-popup-submit-button');
  setTimeout(() => {
    submitButton.classList.replace('popup-label-button', 'popup-label-button-disabled');
  });
}

function enableStartButton() {
  const submitButton = document.getElementById('machine-learning-popup-submit-button');
  submitButton.classList.replace('popup-label-button-disabled', 'popup-label-button');
}

function highlightCancelButton() {
  const cancelButton = document.getElementById('machine-learning-popup-cancel-button');
  cancelButton.style.backgroundColor = '#e2acac';
}

function displayUploadImagesButton() {
  const displayImagesButton = document.getElementById('uploadImagesButton');
  displayImagesButton.style.zIndex = 3;
  displayImagesButton.style.border = '2px solid rgb(218, 197, 73)';
  isUploadImagesButtonDisplayed = true;
}

function hideUploadImagesButton() {
  const displayImagesButton = document.getElementById('uploadImagesButton');
  displayImagesButton.style.zIndex = 1;
  displayImagesButton.style.border = '';
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

export {
  displayErrorMessage, updateProgressMessage, highlightCancelButton,
  removeStartButton, disableStartButton, enableStartButton, displayUploadImagesButton,
  removeUploadedImageAfterNoneFoundError, closeMachineLearningPopUp, displayNoImagesFoundError,
};
