function displayErrorMessage() {
//   console.log('displaying error message');
  const errorMessagesElement = document.getElementById('machine-learning-popup-error-messages');
  console.log(errorMessagesElement);
  errorMessagesElement.innerHTML = 'Error: Please try again later.';
}

function updateProgressMessage(message) {
  const progressMessagesElement = document.getElementById('machine-learning-popup-progress-messages');
  progressMessagesElement.innerHTML = message;
}

export { displayErrorMessage, updateProgressMessage };
