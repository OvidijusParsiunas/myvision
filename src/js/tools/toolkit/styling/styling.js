const INDEX_OF_BUTTON_STATE_CLASS = 1;

function isElement(element) {
  return element instanceof Element || element instanceof HTMLDocument;
}

function setButtonToActive(button) {
  if (isElement(button) && button.classList[INDEX_OF_BUTTON_STATE_CLASS] === 'toolkit-button-active') return;
  button.classList.replace(button.classList[1], 'toolkit-button-active');
  button.childNodes[INDEX_OF_BUTTON_STATE_CLASS].style.filter = 'invert(54%) sepia(52%) saturate(682%) hue-rotate(163deg) brightness(95%) contrast(87%)';
  // 'invert(77%) sepia(0%) saturate(716%) hue-rotate(155deg) brightness(92%) contrast(83%)';
  // filter: invert(65%) sepia(86%) saturate(962%) hue-rotate(165deg) brightness(92%) contrast(95%);
  // filter: invert(84%) sepia(34%) saturate(5416%) hue-rotate(165deg) brightness(97%) contrast(96%);
  // filter: invert(65%) sepia(14%) saturate(4825%) hue-rotate(172deg) brightness(109%) contrast(92%);
  // filter: invert(57%) sepia(80%) saturate(406%) hue-rotate(165deg) brightness(89%) contrast(91%);
  // filter: invert(72%) sepia(43%) saturate(5332%) hue-rotate(179deg) brightness(103%) contrast(101%);
  // filter: invert(78%) sepia(33%) saturate(7497%) hue-rotate(176deg) brightness(99%) contrast(95%);
  // filter: invert(54%) sepia(52%) saturate(682%) hue-rotate(163deg) brightness(95%) contrast(87%);
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
  // filter: invert(49%) sepia(0%) saturate(1%) hue-rotate(200deg) brightness(88%) contrast(87%);
  // filter: invert(42%) sepia(0%) saturate(1409%) hue-rotate(134deg) brightness(100%) contrast(77%);
  button.style.backgroundColor = '';
}

function setButtonToDisabled(button) {
  if (isElement(button) && button.classList[INDEX_OF_BUTTON_STATE_CLASS] === 'toolkit-button-disabled') return;
  button.classList.replace(button.classList[1], 'toolkit-button-disabled');
  button.childNodes[INDEX_OF_BUTTON_STATE_CLASS].style.filter = 'invert(77%) sepia(0%) saturate(716%) hue-rotate(155deg) brightness(92%) contrast(83%)';
  // invert(79%) sepia(6%) saturate(211%) hue-rotate(169deg) brightness(82%) contrast(88%)
  // invert(85%) sepia(10%) saturate(143%) hue-rotate(165deg) brightness(85%) contrast(81%)
  button.style.backgroundColor = '';
}

export {
  setButtonToDefault, setButtonToDisabled, setButtonToActive, setButtonToGreyDefault,
};
