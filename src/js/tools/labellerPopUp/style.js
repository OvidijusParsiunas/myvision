import { getLabelOptions } from '../labelList/labelOptions';

let labellerPopupLabelOptionsElement = null;

function initialiseParentElement() {
  return document.createElement('div');
}

function addLabelToList(labelText) {
  const labelElement = initialiseParentElement();
  labelElement.innerHTML = `<div class="labelDropdownOption" onClick="selectLabelOption(innerHTML)">${labelText}</div>`;
  const newRow = labellerPopupLabelOptionsElement.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.appendChild(labelElement);
}

function deleteAndAddLastRowToRefreshDiv() {
  const labelOptions = getLabelOptions();
  if (labelOptions.length !== 0) {
    labellerPopupLabelOptionsElement = document.getElementById('popup-label-options');
    labellerPopupLabelOptionsElement.deleteRow(labelOptions.length - 1);
    if (labelOptions.length === 4) {
      addLabelToList('temp horizontal');
    }
    window.setTimeout(() => {
      addLabelToList(labelOptions[labelOptions.length - 1].text);
      if (labelOptions.length === 4) {
        labellerPopupLabelOptionsElement.deleteRow(3);
      }
    }, 0);
  }
}

function showLabelPopUp(xCoordinate, yCoordinate) {
  const labelNamePopUp = document.getElementById('labelNamePopUp');
  const canvasWrapperCoordinates = document.getElementById('canvas-wrapper').getBoundingClientRect();
  const canvasY = canvasWrapperCoordinates.top;
  const canvasX = canvasWrapperCoordinates.left;
  labelNamePopUp.style.top = `${yCoordinate + canvasY}px`;
  labelNamePopUp.style.left = `${xCoordinate + canvasX}px`;
  labelNamePopUp.style.display = 'block';
  getLabelOptions();
  deleteAndAddLastRowToRefreshDiv();
}

function getLabelPopUpText() {
  return document.getElementById('label-popup-input').value;
}

function hideLabelPopUp() {
  document.getElementById('labelNamePopUp').style.display = 'none';
}

export { showLabelPopUp, getLabelPopUpText, hideLabelPopUp };
