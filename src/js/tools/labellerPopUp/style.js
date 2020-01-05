import { getLabelOptions } from '../labelList/labelOptions';
import { dimWindow, lightUpWindow } from '../dimWindow/dimWindowService';
import { setLabellingPopUpDisplayedState } from '../toolkit/buttonClickEvents/facadeWorkersUtils/stateManager';

let popupLabelParentElement = null;
let submitButtonElement = null;
let inputElement = null;
let labellerPopupLabelOptionsElement = null;
let mouseProperties = {};
let horizontalScrollPresent = false;

function initialiseParentElement() {
  return document.createElement('div');
}

function addLabelToList(labelText, color) {
  const labelElement = initialiseParentElement();
  labelElement.innerHTML = `<div class="labelDropdownOption" ondblclick="labelShape()" onClick="selectLabelOption(innerHTML, this)" onMouseLeave="mouseLeaveLabelDropdownOption(this)">${labelText}</div>`;
  const newRow = labellerPopupLabelOptionsElement.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.onmouseenter = window.mouseEnterLabelDropdownOption.bind(this, cell, color);
  cell.onmouseleave = window.mouseLeaveLabelDropdownOption.bind(this, cell);
  cell.appendChild(labelElement);
}

function changeTableHeightIfHorizontalScrollPresent() {
  if (!horizontalScrollPresent
  && labellerPopupLabelOptionsElement.scrollWidth > labellerPopupLabelOptionsElement.clientWidth) {
    labellerPopupLabelOptionsElement.style.height = '129px';
    horizontalScrollPresent = true;
  }
}

// should be in label list
function deleteAndAddLastRowToRefreshDiv() {
  const labelOptions = getLabelOptions();
  labellerPopupLabelOptionsElement.deleteRow(labelOptions.length - 1);
  if (labelOptions.length === 6) {
    if (!horizontalScrollPresent) {
      labellerPopupLabelOptionsElement.style.height = '114px';
    }
  } else if (labelOptions.length === 7) {
    addLabelToList('temp horizontal');
  }
  window.setTimeout(() => {
    const label = labelOptions[labelOptions.length - 1];
    addLabelToList(label.text, label.color.label);
    if (labelOptions.length === 7) {
      labellerPopupLabelOptionsElement.deleteRow(6);
    }
  }, 0);
}

function resetLabelOptionsListScroll() {
  labellerPopupLabelOptionsElement.scrollTop = 0;
  labellerPopupLabelOptionsElement.scrollLeft = 0;
}

function windowHasScrollbar() {
  // For most browsers
  if (typeof window.innerWidth === 'number') {
    return window.innerWidth > document.documentElement.clientWidth;
  }
  const rootElem = document.documentElement || document.body;
  let overflowStyle = null;
  if (typeof rootElem.currentStyle !== 'undefined') {
    overflowStyle = rootElem.currentStyle.overflow;
  }
  overflowStyle = overflowStyle || window.getComputedStyle(rootElem, '').overflow;
  let overflowYStyle = null;
  if (typeof rootElem.currentStyle !== 'undefined') {
    overflowYStyle = rootElem.currentStyle.overflowY;
  }
  overflowYStyle = overflowYStyle || window.getComputedStyle(rootElem, '').overflowY;
  const contentOverflows = rootElem.scrollHeight > rootElem.clientHeight;
  const overflowShown = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle);
  const alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll';

  return (contentOverflows && overflowShown) || (alwaysShowScroll);
}

function getLabelPopUpText() {
  return inputElement.value;
}

function highlightInitialLabelOptionOnInit() {
  window.popupInputKeyDown({ key: 'stub' });
}

function hideLabelPopUp() {
  lightUpWindow();
  popupLabelParentElement.style.display = 'none';
  setLabellingPopUpDisplayedState(false);
}

function validateFullPopUpVisibile() {
  if (windowHasScrollbar()) {
    popupLabelParentElement.style.top = '';
    popupLabelParentElement.style.bottom = '5px';
  } else {
    popupLabelParentElement.style.bottom = '';
  }
}

function initialiseLabelPopupOptionsList() {
  labellerPopupLabelOptionsElement = document.getElementById('popup-label-options');
  getLabelOptions().forEach((option) => {
    addLabelToList(option.text, option.color.label);
  });
}

function addLabelToPopupLabelOptions(labelText, color) {
  const labelElement = initialiseParentElement();
  labelElement.innerHTML = `<div class="labelDropdownOption" ondblclick="labelShape()" onClick="selectLabelOption(innerHTML, this)" onMouseLeave="mouseLeaveLabelDropdownOption(this)">${labelText}</div>`;
  const newRow = labellerPopupLabelOptionsElement.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.onmouseenter = window.mouseEnterLabelDropdownOption.bind(this, cell, color);
  cell.onmouseleave = window.mouseLeaveLabelDropdownOption.bind(this, cell);
  cell.appendChild(labelElement);
}

function purgeOptionsFromLabelElement() {
  labellerPopupLabelOptionsElement.innerHTML = '';
}

function changeStyleWhenInputEmpty() {
  submitButtonElement.style.backgroundColor = '';
  setTimeout(() => {
    submitButtonElement.classList.replace('popup-label-button', 'popup-label-button-disabled');
  });
}

function changeStyleWhenInputInvalid() {
  submitButtonElement.style.backgroundColor = '';
}

function changeStyleToAllowSubmit() {
  submitButtonElement.style.backgroundColor = 'rgb(205, 232, 205)';
  setTimeout(() => {
    submitButtonElement.classList.replace('popup-label-button-disabled', 'popup-label-button');
  });
}

function resetPopUpLabelOptions() {
  purgeOptionsFromLabelElement();
  getLabelOptions().forEach((label) => {
    addLabelToPopupLabelOptions(label.text, label.color.label);
  });
}

window.updateMouseProperties = (event) => {
  mouseProperties = event;
};

function setLocalVariables() {
  inputElement = document.getElementById('popup-label-input');
  submitButtonElement = document.getElementById('popup-label-submit-button');
  popupLabelParentElement = document.getElementById('popup-label-parent');
}

function showLabelPopUp() {
  dimWindow(0.5);
  setLocalVariables();
  popupLabelParentElement.style.top = `${mouseProperties.clientY}px`;
  popupLabelParentElement.style.left = `${mouseProperties.clientX}px`;
  getLabelOptions();
  deleteAndAddLastRowToRefreshDiv();
  popupLabelParentElement.style.display = 'block';
  changeTableHeightIfHorizontalScrollPresent();
  resetLabelOptionsListScroll();
  validateFullPopUpVisibile();
  setLabellingPopUpDisplayedState(true);
  window.setTimeout(() => {
    inputElement.select();
    highlightInitialLabelOptionOnInit();
  }, 0);
}

export {
  showLabelPopUp, hideLabelPopUp, changeStyleWhenInputEmpty,
  changeStyleWhenInputInvalid, initialiseLabelPopupOptionsList,
  resetPopUpLabelOptions, getLabelPopUpText, changeStyleToAllowSubmit,
};
