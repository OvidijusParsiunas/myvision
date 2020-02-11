import { getLabelOptions } from '../labelList/labelOptions';
import { dimWindow, lightUpWindow } from '../dimWindow/dimWindowService';
import { setLabellingPopUpDisplayedState } from '../toolkit/buttonClickEvents/facadeWorkersUtils/stateManager';
import { getScrollbarWidth } from '../styling/styling';

let popupLabelParentElement = null;
let submitButtonElement = null;
let inputElement = null;
let labellerPopupLabelOptionsElement = null;
let mouseProperties = {};
let defaultListHeightPx = 0;
let addNewLabelDeltaHeight = 0;
let currentListHeightPx = 105;
let heightIncreasedForNewLabel = false;
let heightIncreasedForHorizontalScrollbar = false;

function initialiseParentElement() {
  return document.createElement('div');
}

function addLabelToList(labelText, color) {
  const labelElement = initialiseParentElement();
  labelElement.innerHTML = `<div class="labelDropdownOption" ondblclick="labelShape()" onmousedown="selectLabelOption(innerHTML, this)">${labelText}</div>`;
  const newRow = labellerPopupLabelOptionsElement.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.onmouseenter = window.mouseEnterLabelDropdownOption.bind(this, cell, color);
  cell.onmouseleave = window.mouseLeaveLabelDropdownOption.bind(this, cell, false);
  cell.appendChild(labelElement);
}

function isVerticalScrollPresent() {
  return labellerPopupLabelOptionsElement.scrollHeight
  > labellerPopupLabelOptionsElement.clientHeight;
}

function isHorizontalScrollPresent() {
  return labellerPopupLabelOptionsElement.scrollWidth
  > labellerPopupLabelOptionsElement.clientWidth;
}

function addFakeVerticalBorder() {
  const chromeBorderFixElement = document.getElementById('chrome-fake-right-border-fix');
  chromeBorderFixElement.style.height = `${currentListHeightPx}px`;
  chromeBorderFixElement.style.display = '';
}

function addFakeBottomBorder() {
  const tableDistanceFromTop = 62;
  const chromeBorderFixElement = document.getElementById('chrome-fake-bottom-border-fix');
  chromeBorderFixElement.style.top = `${tableDistanceFromTop + currentListHeightPx + getScrollbarWidth() - 1}px`;
  chromeBorderFixElement.style.display = '';
  labellerPopupLabelOptionsElement.style.borderBottom = 'none';
}

// should be a global variable
function isFirefox() {
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}

// the following is a bug fix for chromium based browsers where the scroll bars
// do not cover the edge of the table body, meaning that upon hovering on them;
// the mouse over events would be triggered on the body below it.
// In this case, it would be the table element highlighting and cursor change
function addFakeBordersForChromium() {
  if (!isFirefox()) {
    if (isVerticalScrollPresent()) {
      addFakeVerticalBorder();
    }
    if (isHorizontalScrollPresent()) {
      addFakeBottomBorder();
    }
  }
}

function setLabelOptionsHeight() {
  let newHeight = currentListHeightPx;
  if (!heightIncreasedForHorizontalScrollbar && isHorizontalScrollPresent()) {
    newHeight += getScrollbarWidth();
    currentListHeightPx = newHeight;
    heightIncreasedForHorizontalScrollbar = true;
  }
  labellerPopupLabelOptionsElement.style.height = `${newHeight}px`;
}

// should be in label list
function deleteAndAddLastRowToRefreshDiv() {
  const labelOptions = getLabelOptions();
  labellerPopupLabelOptionsElement.deleteRow(labelOptions.length - 1);
  if (!heightIncreasedForNewLabel && labelOptions.length >= 6) {
    currentListHeightPx = defaultListHeightPx + addNewLabelDeltaHeight;
    heightIncreasedForHorizontalScrollbar = false;
    heightIncreasedForNewLabel = true;
    setLabelOptionsHeight();
  }
  if (labelOptions.length === 7) {
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
  inputElement.value = inputElement.value.trim();
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

function setListHeightVariables() {
  if (isFirefox()) {
    defaultListHeightPx = 105.5;
    addNewLabelDeltaHeight = 21.5;
  } else {
    defaultListHeightPx = 105;
    addNewLabelDeltaHeight = 21;
  }
  currentListHeightPx = defaultListHeightPx;
}

function setLocalVariables() {
  inputElement = document.getElementById('popup-label-input');
  popupLabelParentElement = document.getElementById('popup-label-parent');
  submitButtonElement = document.getElementById('popup-label-submit-button');
  labellerPopupLabelOptionsElement = document.getElementById('popup-label-options');
  setListHeightVariables();
}

function initialiseLabelPopupOptionsList() {
  setLocalVariables();
  getLabelOptions().forEach((option) => {
    addLabelToList(option.text, option.color.label);
  });
}

function addLabelToPopupLabelOptions(labelText, color) {
  const labelElement = initialiseParentElement();
  labelElement.innerHTML = `<div class="labelDropdownOption" ondblclick="labelShape()" onmousedown="selectLabelOption(innerHTML, this)">${labelText}</div>`;
  const newRow = labellerPopupLabelOptionsElement.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.onmouseenter = window.mouseEnterLabelDropdownOption.bind(this, cell, color);
  cell.onmouseleave = window.mouseLeaveLabelDropdownOption.bind(this, cell, false);
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

function showLabelPopUp() {
  dimWindow(0.5);
  popupLabelParentElement.style.top = `${mouseProperties.clientY}px`;
  popupLabelParentElement.style.left = `${mouseProperties.clientX}px`;
  getLabelOptions();
  deleteAndAddLastRowToRefreshDiv();
  popupLabelParentElement.style.display = 'block';
  setLabelOptionsHeight();
  addFakeBordersForChromium();
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
