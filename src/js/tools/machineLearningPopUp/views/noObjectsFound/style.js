let descriptionElement = null;
let buttonGroupElement = null;

function changePopUpDescription() {
  descriptionElement.innerHTML = 'The model has not identified any objects within your images.';
}

function displayNoObjectsFoundView() {
  descriptionElement.style.marginBottom = '2px';
  buttonGroupElement.style.display = '';
  changePopUpDescription();
}

function hideNoObjectsFoundViewAssets() {
  buttonGroupElement.style.display = 'none';
}


function assignNoObjectsFoundViewLocalVariables() {
  descriptionElement = document.getElementById('machine-learning-popup-description');
  buttonGroupElement = document.getElementById('machine-learning-popup-no-objects-buttons');
}

export {
  assignNoObjectsFoundViewLocalVariables, displayNoObjectsFoundView, hideNoObjectsFoundViewAssets,
};
