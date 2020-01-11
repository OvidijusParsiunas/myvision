let descriptionElement = null;
let closeButtonElement = null;

function changePopUpDescription() {
  descriptionElement.innerHTML = 'The model has not identified any objects within your images.';
}

function assignNoObjectsFoundViewLocalVariables() {
  descriptionElement = document.getElementById('machine-learning-popup-description');
  closeButtonElement = document.getElementById('machine-learning-popup-no-objects-buttons');
}

function displayNoObjectsFoundView() {
  closeButtonElement.style.display = '';
  changePopUpDescription();
}

export { assignNoObjectsFoundViewLocalVariables, displayNoObjectsFoundView };
