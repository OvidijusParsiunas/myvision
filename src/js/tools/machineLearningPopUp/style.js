function changePopUpHeight(height) {
  const popUp = document.getElementById('machine-learning-popup-parent');
  popUp.style.height = height;
}

function removeErrorMessage() {
  const errorMessagesElement = document.getElementById('machine-learning-popup-error-messages');
  errorMessagesElement.innerHTML = '';
}

function removeProgressMessage() {
  const progressMessagesElement = document.getElementById('machine-learning-popup-progress-messages');
  progressMessagesElement.innerHTML = '';
}

function displayErrorMessage() {
  removeProgressMessage();
  const errorMessagesElement = document.getElementById('machine-learning-popup-error-messages');
  errorMessagesElement.innerHTML = 'Error: Please try again later.';
}

function updateProgressMessage(message) {
  removeErrorMessage();
  const progressMessagesElement = document.getElementById('machine-learning-popup-progress-messages');
  progressMessagesElement.innerHTML = message;
  changePopUpHeight('230px');
}

function removeStartButton() {
  const submitButton = document.getElementById('machine-learning-popup-submit-button');
  submitButton.style.display = 'none';
}

export { displayErrorMessage, updateProgressMessage, removeStartButton };
