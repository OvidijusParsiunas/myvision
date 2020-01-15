import { getNumberOfShapeTypes } from '../../../../globalStatistics/globalStatistics';

let selected = false;
let exportButtonActive = false;
let currentlySelectedElement = null;
let exportLabelsPopupParent = null;
let exportButtonElement = null;
let genericFormatOptionsTextElements = null;
let genericFormatOptionsCheckboxElements = null;
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

function disableBoundingBoxFormatOptions() {
  for (let i = 0; i < boundingBoxFormatOptionsTextElements.length; i += 1) {
    boundingBoxFormatOptionsTextElements[i].style.color = '#bfbfbf';
    boundingBoxFormatOptionsCheckboxElements[i].disabled = true;
    if (boundingBoxFormatOptionsCheckboxElements[i].checked === true) {
      boundingBoxFormatOptionsCheckboxElements[i].checked = false;
      selected = false;
      setExportButtonDefault();
    }
  }
}

function disablePolygonFormatOptions() {
  for (let i = 0; i < genericFormatOptionsTextElements.length; i += 1) {
    genericFormatOptionsTextElements[i].style.color = '#bfbfbf';
    genericFormatOptionsCheckboxElements[i].disabled = true;
    if (genericFormatOptionsCheckboxElements[i].checked === true) {
      genericFormatOptionsCheckboxElements[i].checked = false;
      selected = false;
      setExportButtonDefault();
    }
  }
}

function disableFormatOptionsTextIfNoBoundingBoxes() {
  const { boundingBoxes, polygons } = getNumberOfShapeTypes();
  if (boundingBoxes === 0) {
    disableBoundingBoxFormatOptions();
    if (polygons === 0) {
      disablePolygonFormatOptions();
      exportButtonElement.classList.replace('popup-label-button', 'popup-label-button-disabled');
    } else {
      for (let i = 0; i < genericFormatOptionsCheckboxElements.length; i += 1) {
        genericFormatOptionsTextElements[i].style.color = 'black';
        genericFormatOptionsCheckboxElements[i].disabled = false;
      }
      exportButtonElement.classList.replace('popup-label-button-disabled', 'popup-label-button');
    }
  } else {
    for (let i = 0; i < boundingBoxFormatOptionsCheckboxElements.length; i += 1) {
      boundingBoxFormatOptionsTextElements[i].style.color = 'black';
      boundingBoxFormatOptionsCheckboxElements[i].disabled = false;
    }
    for (let i = 0; i < genericFormatOptionsCheckboxElements.length; i += 1) {
      genericFormatOptionsTextElements[i].style.color = 'black';
      genericFormatOptionsCheckboxElements[i].disabled = false;
    }
    exportButtonElement.classList.replace('popup-label-button-disabled', 'popup-label-button');
  }
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
  genericFormatOptionsTextElements = document.getElementsByClassName('generic-format-option-text');
  genericFormatOptionsCheckboxElements = document.getElementsByClassName('generic-format-option-checkbox');
}

export {
  selectFormat, disableFormatOptionsTextIfNoBoundingBoxes, displayCheckBoxInformationPopover,
  hideExportLabelsPopUp, initialiseExportLabelsPopupElements, removeCheckBoxInformationPopover,
};
