let removePolygonPointsIcon = null;
let addPolygonPointsIcon = null;

function setButtonToActive(button) {
  button.style.filter = 'invert(17%) sepia(81%) saturate(5203%) hue-rotate(2deg) brightness(103%) contrast(105%)';
}

function setButtonToAvailable(button) {
  button.style.filter = 'invert(17%) sepia(81%) saturate(5203%) hue-rotate(2deg) brightness(103%) contrast(105%)';
}

function setButtonToDisabled(button) {
  button.style.filter = 'invert(77%) sepia(0%) saturate(716%) hue-rotate(155deg) brightness(92%) contrast(83%)';
  // invert(79%) sepia(6%) saturate(211%) hue-rotate(169deg) brightness(82%) contrast(88%)
  // invert(85%) sepia(10%) saturate(143%) hue-rotate(165deg) brightness(85%) contrast(81%)
}

function identifyToolkitButtons() {
  removePolygonPointsIcon = document.getElementById('remove-points-icon');
  addPolygonPointsIcon = document.getElementById('add-points-icon');
}

function setDefaultToolkitButtonStyling() {
  setButtonToDisabled(removePolygonPointsIcon);
  setButtonToDisabled(addPolygonPointsIcon);
}

function initiateToolkitButtonStyling() {
  identifyToolkitButtons();
  setDefaultToolkitButtonStyling();
}

export { initiateToolkitButtonStyling as default };
