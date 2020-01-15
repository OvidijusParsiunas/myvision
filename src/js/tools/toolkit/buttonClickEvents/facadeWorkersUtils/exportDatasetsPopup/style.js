import { getNumberOfShapeTypes } from '../../../../globalStatistics/globalStatistics';

let isCheckboxSelected = false;
let isExportButtonActive = false;
let currentlyHoveredPopoverId = null;
let exportButtonElement = null;
let exportLabelsPopupParentElement = null;
let currentlySelectedCheckboxElement = null;
let genericFormatOptionsTextElements = null;
let genericFormatOptionsCheckboxElements = null;
let boundingBoxFormatOptionsTextElements = null;
let boundingBoxFormatOptionsCheckboxElements = null;

function removeExportPopUpInformationPopover(id) {
  currentlyHoveredPopoverId = null;
  const popover = document.getElementById(`format-option-checkbox-popover-${id}`);
  const arrow = document.getElementById(`format-option-checkbox-arrow-${id}`);
  popover.style.display = 'none';
  arrow.style.display = 'none';
}

function displayPopover(id) {
  currentlyHoveredPopoverId = id;
  setTimeout(() => {
    if (currentlyHoveredPopoverId === id) {
      const popover = document.getElementById(`format-option-checkbox-popover-${id}`);
      const arrow = document.getElementById(`format-option-checkbox-arrow-${id}`);
      popover.style.display = 'block';
      arrow.style.display = 'block';
    }
  }, 400);
}

function displayExportPopUpInformationPopover(id) {
  if (getNumberOfShapeTypes().polygons > 0) {
    displayPopover(id);
  }
}

function uncheckCurrentlySelectedCheckbox() {
  currentlySelectedCheckboxElement.checked = false;
}

function enableExportButton() {
  if (!isExportButtonActive) {
    exportButtonElement.classList.add('popup-proceed-button');
    exportButtonElement.classList.replace('popup-label-button-disabled', 'popup-label-button');
    isExportButtonActive = true;
  }
}

function disableExportButton() {
  exportButtonElement.classList.remove('popup-proceed-button');
  exportButtonElement.classList.replace('popup-label-button', 'popup-label-button-disabled');
  isExportButtonActive = false;
}

function enableBoundingBoxFormatOptions() {
  for (let i = 0; i < boundingBoxFormatOptionsCheckboxElements.length; i += 1) {
    boundingBoxFormatOptionsTextElements[i].style.color = 'black';
    boundingBoxFormatOptionsCheckboxElements[i].disabled = false;
  }
}

function enableGenericShapeFormatOptions() {
  for (let i = 0; i < genericFormatOptionsCheckboxElements.length; i += 1) {
    genericFormatOptionsTextElements[i].style.color = 'black';
    genericFormatOptionsCheckboxElements[i].disabled = false;
  }
}

function disableBoundingBoxFormatOptions() {
  for (let i = 0; i < boundingBoxFormatOptionsTextElements.length; i += 1) {
    boundingBoxFormatOptionsTextElements[i].style.color = '#bfbfbf';
    boundingBoxFormatOptionsCheckboxElements[i].disabled = true;
    if (boundingBoxFormatOptionsCheckboxElements[i].checked === true) {
      boundingBoxFormatOptionsCheckboxElements[i].checked = false;
      isCheckboxSelected = false;
      disableExportButton();
    }
  }
}

function disablePolygonFormatOptions() {
  for (let i = 0; i < genericFormatOptionsTextElements.length; i += 1) {
    genericFormatOptionsTextElements[i].style.color = '#bfbfbf';
    genericFormatOptionsCheckboxElements[i].disabled = true;
    if (genericFormatOptionsCheckboxElements[i].checked === true) {
      genericFormatOptionsCheckboxElements[i].checked = false;
      isCheckboxSelected = false;
      disableExportButton();
    }
  }
}

function disableFormatOptionsTextIfNoBoundingBoxes() {
  const { boundingBoxes, polygons } = getNumberOfShapeTypes();
  if (boundingBoxes === 0) {
    disableBoundingBoxFormatOptions();
    if (polygons === 0) {
      disablePolygonFormatOptions();
      disableExportButton();
    } else {
      enableGenericShapeFormatOptions();
    }
  } else {
    enableBoundingBoxFormatOptions();
    enableGenericShapeFormatOptions();
  }
}

function selectFormat(target) {
  if (!isCheckboxSelected) {
    currentlySelectedCheckboxElement = target;
    enableExportButton();
    isCheckboxSelected = true;
  } else if (target === currentlySelectedCheckboxElement) {
    isCheckboxSelected = false;
    disableExportButton();
  } else {
    uncheckCurrentlySelectedCheckbox();
    currentlySelectedCheckboxElement = target;
  }
}

function hideExportLabelsPopUp() {
  exportLabelsPopupParentElement.style.display = 'none';
}

function initialiseExportLabelsPopupElements() {
  exportButtonElement = document.getElementById('export-labels-popup-export-button');
  exportLabelsPopupParentElement = document.getElementById('export-labels-popup-parent');
  boundingBoxFormatOptionsTextElements = document.getElementsByClassName('bounding-box-format-option-text');
  boundingBoxFormatOptionsCheckboxElements = document.getElementsByClassName('bounding-box-format-option-checkbox');
  genericFormatOptionsTextElements = document.getElementsByClassName('generic-format-option-text');
  genericFormatOptionsCheckboxElements = document.getElementsByClassName('generic-format-option-checkbox');
}

export {
  selectFormat, disableFormatOptionsTextIfNoBoundingBoxes, displayExportPopUpInformationPopover,
  hideExportLabelsPopUp, initialiseExportLabelsPopupElements, removeExportPopUpInformationPopover,
};
