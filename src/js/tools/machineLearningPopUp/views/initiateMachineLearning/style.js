let isUploadImagesButtonDisplayed = false;
let isNoImagesFoundErrorDisplayed = false;

let nextButtonElement = null;
let loaderWheelElement = null;
let descriptionElement = null;
let buttonsGroupElement = null;
let submitButtonElement = null;
let cancelButtonElement = null;
let errorMessagesElement = null;
let allImagesButtonElement = null;
let newImagesButtonElement = null;
let progressMessagesElement = null;
let toolkitUploadImagesButton = null;

function removeErrorMessage() {
  errorMessagesElement.innerHTML = '';
}

function removeProgressMessage() {
  progressMessagesElement.style.display = 'none';
  progressMessagesElement.style.color = '';
  progressMessagesElement.innerHTML = '';
}

function displayErrorMessage(errorMessage) {
  removeProgressMessage();
  errorMessagesElement.innerHTML = errorMessage;
  buttonsGroupElement.style.marginTop = '4px';
}

function displayRetryButton() {
  document.getElementById('machine-learning-popup-initiate-retry-button').style.display = '';
  descriptionElement.style.marginBottom = '6px';
}

function removeRetryButton() {
  document.getElementById('machine-learning-popup-initiate-retry-button').style.display = 'none';
  descriptionElement.style.marginBottom = '';
}

function updateProgressMessage(progressMessage) {
  removeErrorMessage();
  progressMessagesElement.style.display = '';
  progressMessagesElement.style.color = '#1e6d1e';
  progressMessagesElement.innerHTML = progressMessage;
}

function displayLoaderWheel() {
  removeErrorMessage();
  loaderWheelElement.style.display = '';
  cancelButtonElement.style.marginRight = '3px';
  descriptionElement.style.marginBottom = '2px';
}

function removeLoaderWheel() {
  loaderWheelElement.style.display = 'none';
  cancelButtonElement.style.marginRight = '';
  descriptionElement.style.marginBottom = '';
}

function displayMLCoverageSelectionButtons() {
  allImagesButtonElement.style.display = '';
  newImagesButtonElement.style.display = '';
}

function removeMLCoverageSelectionButtons() {
  allImagesButtonElement.style.display = 'none';
  newImagesButtonElement.style.display = 'none';
}

function displayNextButton() {
  nextButtonElement.style.display = '';
  descriptionElement.style.marginBottom = '7px';
}

function removeNextButton() {
  nextButtonElement.style.display = 'none';
  descriptionElement.style.marginBottom = '7px';
}

function displayCancelButton() {
  cancelButtonElement.style.display = '';
}

function removeCancelButton() {
  cancelButtonElement.style.display = 'none';
}

function displayStartButton() {
  submitButtonElement.style.display = '';
}

function removeStartButton() {
  submitButtonElement.style.display = 'none';
}

function replaceCancelButtonGreyClassToOriginal() {
  cancelButtonElement.classList.replace('popup-dimmed-cancel-button', 'popup-cancel-button');
  cancelButtonElement.removeEventListener('mouseover', replaceCancelButtonGreyClassToOriginal);
}

function disableImmediateCancelButtonHoverEffect() {
  cancelButtonElement.classList.replace('popup-cancel-button', 'popup-dimmed-cancel-button');
  setTimeout(() => {
    cancelButtonElement.addEventListener('mouseover', replaceCancelButtonGreyClassToOriginal);
  }, 100);
}

function changeToLoadingStyle() {
  disableImmediateCancelButtonHoverEffect();
  displayLoaderWheel();
  removeStartButton();
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
  toolkitUploadImagesButton.style.border = '2px solid rgb(73, 178, 218)';
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

function hideInitiateMachineLearningViewAssets() {
  removeNextButton();
  removeProgressMessage();
  buttonsGroupElement.style.display = 'none';
  descriptionElement.style.marginBottom = '';
}

function getDefaultDescriptionMarkup() {
  return `
    You can use a pre-trained Machine Learning model to automatically annotate objects with bounding boxes!
    <!-- You can use a pre-trained Machine Learning model to automate the process of object annotation with bounding boxes! -->
    <br>
    Click 'Start' to download the 'COCO-SSD' model and use it to generate bounding boxes for your images.
    <br>
    In addition, because this model operates locally on the browser, your data will never leave the privacy of your computer.`;
}

function prepareInstantiateMachineLearningView() {
  descriptionElement.style.marginBottom = '';
  descriptionElement.innerHTML = getDefaultDescriptionMarkup();
  buttonsGroupElement.style.display = '';
  cancelButtonElement.style.marginRight = '';
  displayStartButton();
  displayCancelButton();
  removeLoaderWheel();
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
  allImagesButtonElement = document.getElementById('machine-learning-popup-initiate-all-images-button');
  newImagesButtonElement = document.getElementById('machine-learning-popup-initiate-new-images-button');
}

export {
  hideInitiateMachineLearningViewAssets, displayNextButton,
  displayLoaderWheel, removeLoaderWheel, displayRetryButton,
  changeToLoadingStyle, removeCancelButton, removeRetryButton,
  removeStartButton, disableStartButton, displayNoImagesFoundError,
  prepareInstantiateMachineLearningView, displayUploadImagesButton,
  removeUploadedImageAfterNoneFoundError, closeMachineLearningPopUp,
  displayErrorMessage, updateProgressMessage, highlightCancelButton,
  assignInitiateMachineLearningViewLocalVariables, enableStartButton,
  displayMLCoverageSelectionButtons, removeMLCoverageSelectionButtons,
  removeErrorMessage,
};
