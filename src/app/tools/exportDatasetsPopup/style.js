import { getNumberOfShapeTypes } from '../globalStatistics/globalStatistics.js';
import { setExportDatasetsPopupOpenState } from '../state.js';
import { setStickyPopupProperties, setPopupPosition } from '../utils/popups/stickyPopup.js';

let isCheckboxSelected = false;
let isExportButtonActive = false;
let currentlyHoveredPopoverId = null;
let exportButtonElement = null;
let exportToolkitButtonElement = null;
let exportDatasetsPopupParentElement = null;
let currentlySelectedCheckboxElement = null;
let genericFormatOptionsTextElements = null;
let genericFormatOptionsCheckboxElements = null;
let boundingBoxFormatOptionsTextElements = null;
let boundingBoxFormatOptionsCheckboxElements = null;
const POPOVER_DISPLAY_LAG_MILLISECONDS = 0;
const stickyProperties = { isPopupSticky: false, stickCoordinates: 0 };

function setStickyExportDatasetsPopupProperties() {
  setStickyPopupProperties(exportDatasetsPopupParentElement,
    exportToolkitButtonElement, stickyProperties);
}

function removeExportPopupInformationPopover(id) {
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
  }, POPOVER_DISPLAY_LAG_MILLISECONDS);
}

function displayExportPopupInformationPopover(id) {
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
    boundingBoxFormatOptionsCheckboxElements[i].style.cursor = 'pointer';
  }
}

function enableGenericShapeFormatOptions() {
  for (let i = 0; i < genericFormatOptionsCheckboxElements.length; i += 1) {
    genericFormatOptionsTextElements[i].style.color = 'black';
    genericFormatOptionsCheckboxElements[i].disabled = false;
    genericFormatOptionsCheckboxElements[i].style.cursor = 'pointer';
  }
}

function disableBoundingBoxFormatOptions() {
  for (let i = 0; i < boundingBoxFormatOptionsTextElements.length; i += 1) {
    boundingBoxFormatOptionsTextElements[i].style.color = '#bfbfbf';
    boundingBoxFormatOptionsCheckboxElements[i].disabled = true;
    boundingBoxFormatOptionsCheckboxElements[i].style.cursor = '';
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
    genericFormatOptionsCheckboxElements[i].style.cursor = '';
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

function displayExportDatasetsPopup() {
  disableFormatOptionsTextIfNoBoundingBoxes();
  setPopupPosition(exportDatasetsPopupParentElement, exportToolkitButtonElement);
  exportDatasetsPopupParentElement.style.display = 'block';
  setStickyExportDatasetsPopupProperties();
  setExportDatasetsPopupOpenState(true);
}

function hideExportDatasetsPopup() {
  exportDatasetsPopupParentElement.style.display = 'none';
  exportDatasetsPopupParentElement.style.bottom = '';
  stickyProperties.isPopupSticky = false;
  setExportDatasetsPopupOpenState(false);
}

function setInitialCheckBoxInputValues() {
  document.getElementById('export-datasets-popup-coco-json-format-checkbox').checked = false;
  document.getElementById('export-datasets-popup-vgg-json-format-checkbox').checked = false;
  document.getElementById('export-datasets-popup-csv-format-checkbox').checked = false;
  document.getElementById('export-datasets-popup-voc-xml-format-checkbox').checked = false;
  document.getElementById('export-datasets-popup-yolo-txt-format-checkbox').checked = false;
}

function assignExportDatasetsPopupElementLocalVariables() {
  exportToolkitButtonElement = document.getElementById('export-datasets-button');
  exportButtonElement = document.getElementById('export-datasets-popup-export-button');
  exportDatasetsPopupParentElement = document.getElementById('export-datasets-popup-parent');
  boundingBoxFormatOptionsTextElements = document.getElementsByClassName('bounding-box-format-option-text');
  boundingBoxFormatOptionsCheckboxElements = document.getElementsByClassName('bounding-box-format-option-checkbox');
  genericFormatOptionsTextElements = document.getElementsByClassName('generic-format-option-text');
  genericFormatOptionsCheckboxElements = document.getElementsByClassName('generic-format-option-checkbox');
}

function initialiseExportDatasetsPopupStyling() {
  assignExportDatasetsPopupElementLocalVariables();
  setInitialCheckBoxInputValues();
}

export {
  removeExportPopupInformationPopover, displayExportDatasetsPopup,
  initialiseExportDatasetsPopupStyling, displayExportPopupInformationPopover,
  setStickyExportDatasetsPopupProperties, selectFormat, hideExportDatasetsPopup,
};
