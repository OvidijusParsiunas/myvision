let descriptionElement = null;
let buttonGroupElement = null;

function changeModalDescription() {
  descriptionElement.innerHTML = 'The model has not identified any objects within the uploaded images.';
}

function displayDescription() {
  descriptionElement.style.display = '';
}

function setDescriptionElementMarginBottom(height) {
  descriptionElement.style.marginBottom = height;
}

function setDefaultDescriptionElementMarginBottom() {
  descriptionElement.style.marginBottom = '';
}

function displayButtonGroupElement() {
  buttonGroupElement.style.display = '';
}

function displayNoObjectsFoundView() {
  setDescriptionElementMarginBottom('15px');
  changeModalDescription();
  displayDescription();
  displayButtonGroupElement();
}

function hideNoObjectsFoundViewAssets() {
  setDefaultDescriptionElementMarginBottom();
  buttonGroupElement.style.display = 'none';
}


function assignNoObjectsFoundViewLocalVariables() {
  descriptionElement = document.getElementById('machine-learning-modal-description');
  buttonGroupElement = document.getElementById('machine-learning-modal-no-objects-buttons');
}

export {
  assignNoObjectsFoundViewLocalVariables, displayNoObjectsFoundView, hideNoObjectsFoundViewAssets,
};
