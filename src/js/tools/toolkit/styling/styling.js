let removePolygonPointsButton = null;
let addPolygonPointsButton = null;
const INDEX_OF_BUTTON_STATE_CLASS = 1;

// might need a state machine for this
// good example is a set polygon editing buttons to active

function setButtonToActive(button) {
  button.style.filter = 'invert(17%) sepia(81%) saturate(5203%) hue-rotate(2deg) brightness(103%) contrast(105%)';
}

function setButtonToDefault(button) {
  if (button.classList[INDEX_OF_BUTTON_STATE_CLASS] === 'toolkit-button-default') return;
  button.classList.replace(button.classList[1], 'toolkit-button-default');
  button.childNodes[INDEX_OF_BUTTON_STATE_CLASS].style.filter = '';
}

function setButtonToDisabled(button) {
  if (button.classList[INDEX_OF_BUTTON_STATE_CLASS] === 'toolkit-button-disabled') return;
  button.classList.replace(button.classList[1], 'toolkit-button-disabled');
  button.childNodes[INDEX_OF_BUTTON_STATE_CLASS].style.filter = 'invert(77%) sepia(0%) saturate(716%) hue-rotate(155deg) brightness(92%) contrast(83%)';
  // invert(79%) sepia(6%) saturate(211%) hue-rotate(169deg) brightness(82%) contrast(88%)
  // invert(85%) sepia(10%) saturate(143%) hue-rotate(165deg) brightness(85%) contrast(81%)
}

function identifyToolkitButtons() {
  removePolygonPointsButton = document.getElementById('remove-points-button');
  addPolygonPointsButton = document.getElementById('add-points-button');
}

function setInitialToolkitButtonStyling() {
  setButtonToDisabled(removePolygonPointsButton);
  setButtonToDisabled(addPolygonPointsButton);
}

function initiateToolkitButtonStyling() {
  identifyToolkitButtons();
  setInitialToolkitButtonStyling();
}

export { initiateToolkitButtonStyling, setButtonToDefault, setButtonToDisabled };
