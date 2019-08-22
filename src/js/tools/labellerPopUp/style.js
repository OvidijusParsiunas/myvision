import { getLabelOptions } from '../labelList/labelOptions';

let labellerPopupLabelOptionsElement = null;
let baseDiv = null;

function initialiseParentElement() {
  return document.createElement('div');
}

function addLabelToList(labelText, color) {
  const labelElement = initialiseParentElement();
  labelElement.innerHTML = `<div class="labelDropdownOption" ondblclick="labelShape()" onClick="selectLabelOption(innerHTML, this)" onMouseEnter="hoverLabelOption(this, '${color}')" onMouseLeave="labelOptionMouseOut(this)">${labelText}</div>`;
  const newRow = labellerPopupLabelOptionsElement.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.appendChild(labelElement);
}

function deleteAndAddLastRowToRefreshDiv() {
  const labelOptions = getLabelOptions();
  labellerPopupLabelOptionsElement.deleteRow(labelOptions.length - 1);
  if (labelOptions.length === 6) {
    labellerPopupLabelOptionsElement.style.height = '116px';
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

function hasScrollbar() {
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

function getLabelPopUp() {
  return document.getElementById('label-popup-input');
}

function getLabelPopUpText() {
  return document.getElementById('label-popup-input').value;
}

function dimWindow() {
  baseDiv = document.getElementById('base-div');
  baseDiv.style.position = 'absolute';
  baseDiv.style.backgroundColor = 'rgba(0,0,0,0.2)';
}

function showLabelPopUp(xCoordinate, yCoordinate) {
  dimWindow();
  const labelNamePopUp = document.getElementById('labelNamePopUp');
  const canvasWrapperCoordinates = document.getElementById('canvas-wrapper').getBoundingClientRect();
  const canvasY = canvasWrapperCoordinates.top;
  const canvasX = canvasWrapperCoordinates.left;
  labelNamePopUp.style.top = `${yCoordinate + canvasY}px`;
  labelNamePopUp.style.left = `${xCoordinate + canvasX}px`;
  getLabelOptions();
  deleteAndAddLastRowToRefreshDiv();
  labelNamePopUp.style.display = 'block';
  resetLabelOptionsListScroll();
  if (hasScrollbar()) {
    labelNamePopUp.style.top = '';
    labelNamePopUp.style.bottom = '5px';
  } else {
    labelNamePopUp.style.bottom = '';
  }
  window.setTimeout(() => {
    getLabelPopUp().select();
    window.popupInputKeyDown({ key: 'stub' });
  }, 0);
}

function lightUpWindow() {
  baseDiv = document.getElementById('base-div');
  baseDiv.style.backgroundColor = 'rgba(0,0,0,0)';
  window.setTimeout(() => {
    baseDiv.style.position = '';
  }, 500);
}

function hideLabelPopUp() {
  lightUpWindow();
  document.getElementById('labelNamePopUp').style.display = 'none';
}

function initialiseLabelPopupOptionsList() {
  labellerPopupLabelOptionsElement = document.getElementById('popup-label-options');
  getLabelOptions().forEach((option) => {
    addLabelToList(option.text, option.color.label);
  });
}

export {
  showLabelPopUp, getLabelPopUpText,
  hideLabelPopUp, initialiseLabelPopupOptionsList,
};
