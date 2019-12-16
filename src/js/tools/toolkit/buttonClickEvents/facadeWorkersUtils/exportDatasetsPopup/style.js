import { getNumberOfShapeTypes } from '../../../../globalStatistics/globalStatistics';

let selected = false;
let exportButtonActive = false;
let currentlySelectedElement = null;
let exportLabelsPopupParent = null;
let exportButtonElement = null;
let boundingBoxFormatOptionsTextElements = null;
let boundingBoxFormatOptionsCheckboxElements = null;

function setExportButtonActive() {
  if (!exportButtonActive) {
    exportButtonElement.style.backgroundColor = 'rgb(205, 232, 205)';
    exportButtonElement.classList.add('export-button-active');
    exportButtonActive = true;
  }
}

function setExportButtonDefault() {
  exportButtonElement.style.backgroundColor = 'rgb(222, 222, 222)';
  exportButtonElement.classList.remove('export-button-active');
  exportButtonActive = false;
}

function uncheckCurrentlySelected() {
  currentlySelectedElement.checked = false;
}

function selectFormat(target) {
  if (!selected) {
    currentlySelectedElement = target;
    setExportButtonActive();
    selected = true;
  } else if (target === currentlySelectedElement) {
    selected = false;
    setExportButtonDefault();
  } else {
    uncheckCurrentlySelected();
    currentlySelectedElement = target;
  }
}

function disableFormatOptionsTextIfNoBoundingBoxes() {
  if (getNumberOfShapeTypes().boundingBoxes === 0) {
    for (let i = 0; i < boundingBoxFormatOptionsTextElements.length; i += 1) {
      boundingBoxFormatOptionsTextElements[i].style.color = '#bfbfbf';
      boundingBoxFormatOptionsCheckboxElements[i].disabled = true;
      if (boundingBoxFormatOptionsCheckboxElements[i].checked === true) {
        boundingBoxFormatOptionsCheckboxElements[i].checked = false;
        selected = false;
        setExportButtonDefault();
      }
    }
  } else {
    for (let i = 0; i < boundingBoxFormatOptionsCheckboxElements.length; i += 1) {
      boundingBoxFormatOptionsTextElements[i].style.color = 'black';
      boundingBoxFormatOptionsCheckboxElements[i].disabled = false;
    }
  }
}

function displayExportLabelsPopup() {
  disableFormatOptionsTextIfNoBoundingBoxes();
  setTimeout(() => {
    exportLabelsPopupParent.style.display = 'block';
  }, 100);
}

function hideExportLabelsPopUp() {
  exportLabelsPopupParent.style.display = 'none';
}

let readyToDisplay = null;

function displayPopover(id) {
  readyToDisplay = id;
  setTimeout(() => {
    if (readyToDisplay === id) {
      const popover = document.getElementById(`format-option-checkbox-popover-${id}`);
      const arrow = document.getElementById(`format-option-checkbox-arrow-${id}`);
      popover.style.display = 'block';
      arrow.style.display = 'block';
    }
  }, 400);
}

function displayCheckBoxInformationPopover(id, text) {
  if (text) {
    if (getNumberOfShapeTypes().boundingBoxes === 0) {
      displayPopover(id);
    }
  } else {
    displayPopover(id);
  }
}

function removeCheckBoxInformationPopover(id) {
  readyToDisplay = null;
  const popover = document.getElementById(`format-option-checkbox-popover-${id}`);
  const arrow = document.getElementById(`format-option-checkbox-arrow-${id}`);
  popover.style.display = 'none';
  arrow.style.display = 'none';
}

function initialiseExportLabelsPopupElements() {
  exportLabelsPopupParent = document.getElementById('export-labels-popup-parent');
  exportButtonElement = document.getElementById('export-labels-popup-export-button');
  boundingBoxFormatOptionsTextElements = document.getElementsByClassName('bounding-box-format-option-text');
  boundingBoxFormatOptionsCheckboxElements = document.getElementsByClassName('bounding-box-format-option-checkbox');
}

export {
  selectFormat, displayExportLabelsPopup, displayCheckBoxInformationPopover,
  hideExportLabelsPopUp, initialiseExportLabelsPopupElements, removeCheckBoxInformationPopover,
};
