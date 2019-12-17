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
}

export { displayErrorMessage, updateProgressMessage };
