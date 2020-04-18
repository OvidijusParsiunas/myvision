import { getLabelOptions } from '../labelList/labelOptions';
import { dimWindow, lightUpWindow } from '../dimWindow/dimWindowService';
import { setShapeLabellerModalDisplayedState } from '../toolkit/buttonClickEvents/facadeWorkersUtils/stateMachine';
import { getScrollbarWidth } from '../globalStyle/style';
import IS_FIREFOX from '../utils/browserType';

let parentElement = null;
let optionsElement = null;
let submitButtonElement = null;
let inputElement = null;
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
  const newRow = optionsElement.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.onmouseenter = window.mouseEnterLabelDropdownOption.bind(this, cell, color);
  cell.onmouseleave = window.mouseLeaveLabelDropdownOption.bind(this, cell, false);
  cell.appendChild(labelElement);
}

function isVerticalScrollPresent() {
  return optionsElement.scrollHeight
  > optionsElement.clientHeight;
}

function isHorizontalScrollPresent() {
  return optionsElement.scrollWidth
  > optionsElement.clientWidth;
}

function addFakeRightBorder() {
  const chromiumFakeRightBorderFixElement = document.getElementById('chromium-fake-popup-table-right-border-fix');
  chromiumFakeRightBorderFixElement.style.height = `${currentListHeightPx}px`;
  chromiumFakeRightBorderFixElement.style.display = '';
}

function addFakeBottomBorder() {
  const tableDistanceFromTop = 62;
  const chromiumFakeBottomBorderFixElement = document.getElementById('chromium-fake-popup-table-bottom-border-fix');
  chromiumFakeBottomBorderFixElement.style.top = `${tableDistanceFromTop + currentListHeightPx + getScrollbarWidth() - 4}px`;
  chromiumFakeBottomBorderFixElement.style.display = '';
  optionsElement.style.borderBottom = 'none';
  optionsElement.style.paddingBottom = '0px';
}

// the following is a bug fix for chromium based browsers where the scroll bars
// do not cover the edge of the table body, meaning that upon hovering on them;
// the mouse over events would be triggered on the body below it.
// In this case, it would be the table element highlighting and cursor change
function addFakeBordersForChromium() {
  if (!IS_FIREFOX) {
    if (isVerticalScrollPresent()) {
      addFakeRightBorder();
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
  optionsElement.style.height = `${newHeight}px`;
}

// should be in label list
function deleteAndAddLastRowToRefreshDiv() {
  const labelOptions = getLabelOptions();
  optionsElement.deleteRow(labelOptions.length - 1);
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
      optionsElement.deleteRow(6);
    }
  }, 0);
}

function resetLabelOptionsListScroll() {
  optionsElement.scrollTop = 0;
  optionsElement.scrollLeft = 0;
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

function getShapeLabellerModalInputText() {
  return inputElement.value;
}

function highlightInitialLabelOptionOnInit() {
  window.shapeLabellerModalKeyDown({ key: 'stub' });
}

function hideShapeLabellerModal() {
  lightUpWindow();
  parentElement.style.display = 'none';
  inputElement.value = inputElement.value.trim();
  setShapeLabellerModalDisplayedState(false);
}

function validateFullModalVisibile(isWindowResized) {
  if (windowHasScrollbar()) {
    parentElement.style.top = '';
    parentElement.style.bottom = '5px';
  } else if (!isWindowResized) {
    parentElement.style.bottom = '';
  }
}

function setListHeightVariables() {
  if (IS_FIREFOX) {
    defaultListHeightPx = 105.5;
    addNewLabelDeltaHeight = 21.5;
  } else {
    defaultListHeightPx = 105;
    addNewLabelDeltaHeight = 21;
  }
  currentListHeightPx = defaultListHeightPx;
}

function setLocalVariables() {
  inputElement = document.getElementById('shape-labeller-modal-input');
  parentElement = document.getElementById('shape-labeller-modal-parent');
  optionsElement = document.getElementById('shape-labeller-modal-options');
  submitButtonElement = document.getElementById('shape-labeller-modal-submit-button');
  setListHeightVariables();
}

function initialiseShapeLabellerModalOptionsList() {
  setLocalVariables();
  getLabelOptions().forEach((option) => {
    addLabelToList(option.text, option.color.label);
  });
}

function addLabelToshapeLabellerModalOptions(labelText, color) {
  const labelElement = initialiseParentElement();
  labelElement.innerHTML = `<div class="labelDropdownOption" ondblclick="labelShape()" onmousedown="selectLabelOption(innerHTML, this)">${labelText}</div>`;
  const newRow = optionsElement.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.onmouseenter = window.mouseEnterLabelDropdownOption.bind(this, cell, color);
  cell.onmouseleave = window.mouseLeaveLabelDropdownOption.bind(this, cell, false);
  cell.appendChild(labelElement);
}

function purgeOptionsFromLabelElement() {
  optionsElement.innerHTML = '';
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

function resetShapeLabellerModalOptions() {
  purgeOptionsFromLabelElement();
  getLabelOptions().forEach((label) => {
    addLabelToshapeLabellerModalOptions(label.text, label.color.label);
  });
}

window.updateMouseProperties = (event) => {
  mouseProperties = event;
};

function showShapeLabellerModal() {
  dimWindow(0.5);
  parentElement.style.top = `${mouseProperties.clientY}px`;
  parentElement.style.left = `${mouseProperties.clientX}px`;
  getLabelOptions();
  deleteAndAddLastRowToRefreshDiv();
  parentElement.style.display = 'block';
  setLabelOptionsHeight();
  addFakeBordersForChromium();
  resetLabelOptionsListScroll();
  validateFullModalVisibile();
  setShapeLabellerModalDisplayedState(true);
  window.setTimeout(() => {
    inputElement.select();
    highlightInitialLabelOptionOnInit();
  }, 0);
}

export {
  showShapeLabellerModal, hideShapeLabellerModal, changeStyleWhenInputEmpty,
  resetShapeLabellerModalOptions, getShapeLabellerModalInputText, changeStyleToAllowSubmit,
  changeStyleWhenInputInvalid, initialiseShapeLabellerModalOptionsList, validateFullModalVisibile,
};
