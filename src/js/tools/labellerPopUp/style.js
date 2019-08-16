import { getLabelOptions } from '../labelList/labelOptions';

let labellerPopupLabelOptionsElement = null;

function initialiseParentElement() {
  return document.createElement('div');
}

function addLabelToList(labelText) {
  const labelElement = initialiseParentElement();
  labelElement.innerHTML = `<div class="labelDropdownOption" ondblclick="labelShape()" onClick="selectLabelOption(innerHTML)">${labelText}</div>`;
  const newRow = labellerPopupLabelOptionsElement.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.appendChild(labelElement);
}

function deleteAndAddLastRowToRefreshDiv() {
  const labelOptions = getLabelOptions();
  labellerPopupLabelOptionsElement.deleteRow(labelOptions.length - 1);
  if (labelOptions.length === 6) {
    labellerPopupLabelOptionsElement.style.height = '125px';
  } else if (labelOptions.length === 7) {
    addLabelToList('temp horizontal');
  }
  window.setTimeout(() => {
    addLabelToList(labelOptions[labelOptions.length - 1].text);
    if (labelOptions.length === 7) {
      labellerPopupLabelOptionsElement.deleteRow(6);
    }
  }, 0);
}

function resetLabelOptionsListScroll() {
  labellerPopupLabelOptionsElement.scrollTop = 0;
  labellerPopupLabelOptionsElement.scrollLeft = 0;
}

function showLabelPopUp(xCoordinate, yCoordinate) {
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
}

function getLabelPopUpText() {
  return document.getElementById('label-popup-input').value;
}

function hideLabelPopUp() {
  document.getElementById('labelNamePopUp').style.display = 'none';
}

function initialiseLabelPopupOptionsList() {
  labellerPopupLabelOptionsElement = document.getElementById('popup-label-options');
  getLabelOptions().forEach((option) => {
    addLabelToList(option.text);
  });
}

export {
  showLabelPopUp, getLabelPopUpText,
  hideLabelPopUp, initialiseLabelPopupOptionsList,
};
