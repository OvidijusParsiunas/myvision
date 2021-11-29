import { getLabelOptions } from '../labelList/labelOptions.js';
import { dimWindow, lightUpWindow } from '../dimWindow/dimWindowService.js';
import { QUICK_LIGHTUP_MILLISECONDS, QUICK_DIM_SECONDS, THIN_DIM } from '../dimWindow/consts.js';
import { setLabellerModalDisplayedState } from '../state.js';
import { getScrollbarWidth, windowHasScrollbar } from '../globalStyling/style.js';
import IS_FIREFOX from '../utils/browserType.js';
import { getLastMouseMoveEvent } from '../../keyEvents/mouse/mouseMove.js';
import { getScreenSizeDelta } from '../globalStyling/screenSizeDelta.js';

let parentElement = null;
let optionsElement = null;
let submitButtonElement = null;
let inputElement = null;
let defaultListHeightPx = 0;
let addNewLabelDeltaHeight = 0;
let currentListHeightPx = null;
let heightIncreasedForNewLabel = false;
let heightIncreasedForHorizontalScrollbar = false;
let horizontalScrollSet = false;
let fakeRightBorderAdded = false;
let fakeBottomBorderAdded = false;
let lightupTimePeriod = QUICK_LIGHTUP_MILLISECONDS;
let dimTimePeriod = QUICK_DIM_SECONDS;
let dimIntensity = THIN_DIM;
let optionsListBorderWidth = 1;

function initialiseParentElement() {
  return document.createElement('div');
}

function addLabelToList(labelText, color) {
  const labelElement = initialiseParentElement();
  labelElement.innerHTML = `<div class="labelDropdownOption" ondblclick="labelShape()" onmousedown="selectLabelOption(innerHTML, this, '${color}')">${labelText}</div>`;
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
  if (fakeRightBorderAdded) return;
  const chromiumFakeRightBorderFixElement = document.getElementById('chromium-fake-popup-table-right-border-fix');
  chromiumFakeRightBorderFixElement.style.height = `${currentListHeightPx}px`;
  chromiumFakeRightBorderFixElement.style.display = '';
  chromiumFakeRightBorderFixElement.style.right = getScreenSizeDelta() > 1.000001 ? `${9 / getScreenSizeDelta()}px` : '9.8px';
  fakeRightBorderAdded = true;
}

function addFakeBottomBorder() {
  if (fakeBottomBorderAdded) return;
  const chromiumFakeBottomBorderFixElement = document.getElementById('chromium-fake-popup-table-bottom-border-fix');
  const modalTitleElementHeight = document.getElementById('labeller-modal-title').getBoundingClientRect().height;
  const inputElementHeight = inputElement.getBoundingClientRect().height;
  const heightOfElementsAboveOptionsList = modalTitleElementHeight + inputElementHeight;
  const optionsListHeight = optionsElement.getBoundingClientRect().height;
  const optionsListPaddingTopHeight = 2 / getScreenSizeDelta();
  chromiumFakeBottomBorderFixElement.style.top = `${Math.floor(heightOfElementsAboveOptionsList + optionsListHeight
    + (getScrollbarWidth() * 2) - optionsListPaddingTopHeight + optionsListBorderWidth)}px`;
  chromiumFakeBottomBorderFixElement.style.display = '';
  optionsElement.style.paddingBottom = '0px';
  fakeBottomBorderAdded = true;
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
  if (!horizontalScrollSet) {
    let newHeight = currentListHeightPx;
    if (!heightIncreasedForHorizontalScrollbar && isHorizontalScrollPresent()) {
      newHeight += getScrollbarWidth();
      currentListHeightPx = newHeight;
      heightIncreasedForHorizontalScrollbar = true;
      horizontalScrollSet = true;
    }
    optionsElement.style.height = `${newHeight}px`;
  }
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

function getLabellerModalInputText() {
  return inputElement.value;
}

function highlightInitialLabelOptionOnInit() {
  window.labellerModalKeyDown({ key: 'stub' });
}

function hideLabellerModal() {
  lightUpWindow(lightupTimePeriod);
  parentElement.style.display = 'none';
  inputElement.value = inputElement.value.trim();
  setLabellerModalDisplayedState(false);
}

function validateFullLabellerModalVisibile(isWindowResized) {
  if (windowHasScrollbar()) {
    parentElement.style.top = '';
    parentElement.style.bottom = '5px';
  } else if (!isWindowResized) {
    parentElement.style.bottom = '';
  }
}

// fix for a bug where the options list item color would not fill to the very end
// when delta is 1.1 and the width is 150px as an example
function setOptionsElementWidth() {
  optionsElement.style.width = getScreenSizeDelta() > 1.0000001 ? '150.4px' : '165px';
}

function setListHeightVariables() {
  if (IS_FIREFOX) {
    defaultListHeightPx = Math.ceil(107.5 / getScreenSizeDelta());
    addNewLabelDeltaHeight = Math.ceil(21.5 / getScreenSizeDelta());
  } else {
    defaultListHeightPx = Math.ceil(105 / getScreenSizeDelta());
    addNewLabelDeltaHeight = Math.ceil(21 / getScreenSizeDelta());
  }
  currentListHeightPx = defaultListHeightPx;
}

function setLocalVariables() {
  inputElement = document.getElementById('labeller-modal-input');
  parentElement = document.getElementById('labeller-modal-parent');
  optionsElement = document.getElementById('labeller-modal-options');
  submitButtonElement = document.getElementById('labeller-modal-submit-button');
  optionsListBorderWidth = Number(getComputedStyle(optionsElement, null).getPropertyValue('border-left-width').replace(/[^0-9.]+/g, ''));
  setListHeightVariables();
}

function initialiseLabellerModalOptionsList() {
  setLocalVariables();
  getLabelOptions().forEach((option) => {
    addLabelToList(option.text, option.color.label);
  });
  setOptionsElementWidth();
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

function resetLabellerModalOptions() {
  purgeOptionsFromLabelElement();
  getLabelOptions().forEach((label) => {
    addLabelToList(label.text, label.color.label);
  });
}

function showLabellerModal() {
  dimWindow(dimTimePeriod, dimIntensity);
  const lastMouseMoveEvent = getLastMouseMoveEvent();
  parentElement.style.top = `${lastMouseMoveEvent.clientY}px`;
  parentElement.style.left = `${lastMouseMoveEvent.clientX}px`;
  deleteAndAddLastRowToRefreshDiv();
  parentElement.style.display = 'block';
  setLabelOptionsHeight();
  addFakeBordersForChromium();
  resetLabelOptionsListScroll();
  validateFullLabellerModalVisibile();
  setLabellerModalDisplayedState(true);
  window.setTimeout(() => {
    inputElement.select();
    highlightInitialLabelOptionOnInit();
  }, 0);
}

function setLabellerPopupDimProperties(lightupTimePeriodArg, dimTimePeriodArg, dimIntensityArg) {
  lightupTimePeriod = lightupTimePeriodArg;
  dimTimePeriod = dimTimePeriodArg;
  dimIntensity = dimIntensityArg;
}

export {
  changeStyleWhenInputInvalid, initialiseLabellerModalOptionsList,
  showLabellerModal, hideLabellerModal, changeStyleWhenInputEmpty,
  setLabellerPopupDimProperties, validateFullLabellerModalVisibile,
  resetLabellerModalOptions, getLabellerModalInputText, changeStyleToAllowSubmit,
};
