const INDEX_OF_BUTTON_STATE_CLASS = 1;

function isElement(element) {
  return element instanceof Element || element instanceof HTMLDocument;
}

function setButtonToActive(button) {
  if (isElement(button) && button.classList[INDEX_OF_BUTTON_STATE_CLASS] === 'toolkit-button-active') return;
  button.classList.replace(button.classList[1], 'toolkit-button-active');
  button.childNodes[INDEX_OF_BUTTON_STATE_CLASS].style.filter = 'invert(54%) sepia(52%) saturate(682%) hue-rotate(163deg) brightness(95%) contrast(87%)';
  button.style.backgroundColor = '#f1f5fd';
}

function setButtonToDefault(button) {
  if (isElement(button) && button.classList[INDEX_OF_BUTTON_STATE_CLASS] === 'toolkit-button-default') return;
  button.classList.replace(button.classList[1], 'toolkit-button-default');
  button.childNodes[INDEX_OF_BUTTON_STATE_CLASS].style.filter = '';
  button.style.backgroundColor = '';
}

function setButtonToGreyDefault(button) {
  if (isElement(button) && button.classList[INDEX_OF_BUTTON_STATE_CLASS] === 'toolkit-button-default') return;
  button.classList.replace(button.classList[1], 'toolkit-button-default');
  button.childNodes[INDEX_OF_BUTTON_STATE_CLASS].style.filter = 'invert(42%) sepia(0%) saturate(1409%) hue-rotate(134deg) brightness(100%) contrast(77%)';
  button.style.backgroundColor = '';
}

function setButtonToDisabled(button) {
  if (isElement(button) && button.classList[INDEX_OF_BUTTON_STATE_CLASS] === 'toolkit-button-disabled') return;
  button.classList.replace(button.classList[1], 'toolkit-button-disabled');
  button.childNodes[INDEX_OF_BUTTON_STATE_CLASS].style.filter = 'invert(77%) sepia(0%) saturate(716%) hue-rotate(155deg) brightness(92%) contrast(83%)';
  button.style.backgroundColor = '';
}

export {
  setButtonToDefault, setButtonToDisabled, setButtonToActive, setButtonToGreyDefault,
};
