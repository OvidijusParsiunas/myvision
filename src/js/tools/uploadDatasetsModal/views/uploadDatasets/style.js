import { ANNOTATIONS_TABLE_INDICATOR, IMAGES_TABLE_INDICATOR } from '../../consts';

let titleElement = null;
let backButtonElement = null;
let imagesTableElement = null;
let finishButtonElement = null;
let buttonsGroupElement = null;
let uploadButtonElement = null;
let annotationsTableElement = null;
let uploadDatasetsModalElement = null;
let allImagesStyleSetToDefault = null;
let imagesTableOuterContainerElement = null;
let uploadDatasetFilesTriggerElement = null;
let uploadDatasetsOuterContainerElement = null;
let annotationsTableOuterContainerElement = null;
let popoverIndex = 0;
const modalWidth = 505;
const modalHeight = 340;
const ANNOTATION_FILE_POPOVER_POSITION_CLASS = 'upload-datasets-modal-upload-datasets-table-row-popover-left';
const ANNOTATION_FILE_POPOVER_ARROW_POSITION_CLASS = 'upload-datasets-modal-upload-datasets-table-row-popover-arrow-left';
const IMAGE_FILE_POPOVER_POSITION_CLASS = 'upload-datasets-modal-upload-datasets-table-row-popover-right';
const IMAGE_FILE_POPOVER_ARROW_POSITION_CLASS = 'upload-datasets-modal-upload-datasets-table-row-popover-arrow-right';

function createTableRowElementMarkup(fileName, tableName) {
  return `
    <div class="upload-datasets-modal-upload-datasets-table-row">
        <div onmouseenter="displayActiveRemoveFileIcon(this)" onmouseleave="displayDefaultRemoveFileIcon(this)" onclick="removeFileFromUploadDatasetFiles('${fileName}', '${tableName}')">
          <img src="x-icon-default.svg" class="upload-datasets-modal-remove-file-button"  alt="remove">
          <img src="x-icon-active.svg" style="display: none" class="upload-datasets-modal-remove-file-button" alt="remove">
        </div>
      <div class="upload-datasets-modal-upload-datasets-table-row-text">${fileName}</div>
    </div>
  `;
}

function createTableRowElementMarkupWthError(fileName, message, popoverPositionClass,
  popoverArrowClass, tableName, index) {
  return `
    <div id="upload-datasets-modal-file-popover-${index}" class="popover upload-datasets-modal-upload-datasets-table-row-popover error-popover-color-theme ${popoverPositionClass}">${message}</div>
    <div id="upload-datasets-modal-file-popover-arrow-${index}" style="margin-left: ${(modalWidth / 2 / 2) - 20}px;" class="arrow default-arrow-position upload-datasets-modal-upload-datasets-table-error-row-popover-arrow ${popoverArrowClass}"></div>
    <div class="upload-datasets-modal-upload-datasets-table-row">
        <div onmouseenter="displayActiveRemoveFileIcon(this)" onmouseleave="displayDefaultRemoveFileIcon(this)" onclick="removeFileFromUploadDatasetFiles('${fileName}', '${tableName}', '${message}')">
          <img src="x-icon-default.svg" class="upload-datasets-modal-remove-file-button"  alt="remove">
          <img src="x-icon-active.svg" style="display: none" class="upload-datasets-modal-remove-file-button" alt="remove">
        </div>
        <div class="upload-datasets-modal-upload-datasets-table-row-text upload-datasets-modal-upload-datasets-table-row-text-error" onmouseenter="displayUploadDatasetsAnnotationFilePopover(${index}, '${tableName}')" onmouseleave="removeUploadDatasetsAnnotationFilePopover(${popoverIndex})">${fileName}</div>
    </div>
  `;
}

window.displayUploadDatasetsAnnotationFilePopover = (id, tableName) => {
  const tableOuterContainerElement = tableName === ANNOTATIONS_TABLE_INDICATOR
    ? annotationsTableOuterContainerElement : imagesTableOuterContainerElement;
  document.getElementById(`upload-datasets-modal-file-popover-${id}`).style.display = 'block';
  document.getElementById(`upload-datasets-modal-file-popover-${id}`).style.marginTop = `-${tableOuterContainerElement.scrollTop + 30}px`;
  document.getElementById(`upload-datasets-modal-file-popover-arrow-${id}`).style.display = 'block';
  document.getElementById(`upload-datasets-modal-file-popover-arrow-${id}`).style.marginTop = `-${tableOuterContainerElement.scrollTop + 4}px`;
};

window.removeUploadDatasetsAnnotationFilePopover = (id) => {
  document.getElementById(`upload-datasets-modal-file-popover-${id}`).style.display = 'none';
  document.getElementById(`upload-datasets-modal-file-popover-arrow-${id}`).style.display = 'none';
};

window.displayActiveRemoveFileIcon = (element) => {
  element.childNodes[1].style.display = 'none';
  element.childNodes[3].style.display = '';
};

window.displayDefaultRemoveFileIcon = (element) => {
  element.childNodes[1].style.display = '';
  element.childNodes[3].style.display = 'none';
};

function getFileName(tableBody, rowIndex) {
  if (tableBody.childNodes[rowIndex].childNodes[0].childNodes[1].classList[1] === 'upload-datasets-modal-upload-datasets-table-row-popover') {
    return {
      fileName: tableBody.childNodes[rowIndex].childNodes[0].childNodes[5].childNodes[3].innerHTML,
      currentRowHasError: true,
    };
  }
  return {
    fileName: tableBody.childNodes[rowIndex].childNodes[0].childNodes[1].childNodes[3].innerHTML,
    currentRowHasError: false,
  };
}

function removeRow(subjectFileName, tableName) {
  const tableElement = tableName === ANNOTATIONS_TABLE_INDICATOR ? annotationsTableElement
    : imagesTableElement;
  const tableBody = tableElement.childNodes[1];
  for (let i = 0; i < tableBody.childNodes.length; i += 1) {
    const { fileName } = getFileName(tableBody, i);
    if (subjectFileName === fileName) {
      tableBody.childNodes[i].remove();
      break;
    }
  }
}

function checkFileAlreadyInTable(newFileName, validationResult, tableElement,
  popoverPositionClass, popoverArrowPositionClass) {
  const tableBody = tableElement.childNodes[1];
  for (let i = 0; i < tableBody.childNodes.length; i += 1) {
    const { fileName, currentRowHasError } = getFileName(tableBody, i);
    if (newFileName === fileName) {
      const tableName = tableElement.id === 'upload-datsets-modal-upload-datasets-annotations-table' ? ANNOTATIONS_TABLE_INDICATOR : IMAGES_TABLE_INDICATOR;
      if (validationResult.error) {
        const rowParentElement = tableBody.childNodes[i].childNodes[0];
        rowParentElement.innerHTML = createTableRowElementMarkupWthError(
          newFileName, validationResult.message, popoverPositionClass, popoverArrowPositionClass,
          tableName, popoverIndex += 1,
        );
        if (tableName === IMAGES_TABLE_INDICATOR) {
          allImagesStyleSetToDefault = false;
        }
      } else if (currentRowHasError && !validationResult.error) {
        const rowParentElement = tableBody.childNodes[i].childNodes[0];
        rowParentElement.innerHTML = createTableRowElementMarkup(newFileName, tableName);
      }
      return true;
    }
  }
  return false;
}

function insertRowToImagesTable(fileName, validationResult) {
  if (!checkFileAlreadyInTable(fileName, validationResult,
    imagesTableElement, IMAGE_FILE_POPOVER_POSITION_CLASS,
    IMAGE_FILE_POPOVER_ARROW_POSITION_CLASS)) {
    const row = imagesTableElement.insertRow(-1);
    const cell = row.insertCell(0);
    if (validationResult.error) {
      cell.innerHTML = createTableRowElementMarkupWthError(fileName, validationResult.message,
        IMAGE_FILE_POPOVER_POSITION_CLASS, IMAGE_FILE_POPOVER_ARROW_POSITION_CLASS,
        IMAGES_TABLE_INDICATOR, popoverIndex += 1);
      allImagesStyleSetToDefault = false;
    } else {
      cell.innerHTML = createTableRowElementMarkup(fileName, IMAGES_TABLE_INDICATOR);
    }
  }
}

function changeAllImagesTableRowsToDefault() {
  if (!allImagesStyleSetToDefault) {
    const tableBody = imagesTableElement.childNodes[1];
    for (let i = 0; i < tableBody.childNodes.length; i += 1) {
      const rowParentElement = tableBody.childNodes[i].childNodes[0];
      const { fileName } = getFileName(tableBody, i);
      rowParentElement.innerHTML = createTableRowElementMarkup(fileName, IMAGES_TABLE_INDICATOR);
    }
  }
  allImagesStyleSetToDefault = true;
}

function changeAnnotationRowToDefault(annotationFileName) {
  const tableBody = annotationsTableElement.childNodes[1];
  for (let i = 0; i < tableBody.childNodes.length; i += 1) {
    const rowParentElement = tableBody.childNodes[i].childNodes[0];
    const { fileName } = getFileName(tableBody, i);
    if (annotationFileName === fileName) {
      rowParentElement.innerHTML = createTableRowElementMarkup(
        annotationFileName, ANNOTATIONS_TABLE_INDICATOR,
      );
    }
  }
}

function insertRowToAnnotationsTable(fileName, validationResult) {
  if (!checkFileAlreadyInTable(fileName, validationResult,
    annotationsTableElement, ANNOTATION_FILE_POPOVER_POSITION_CLASS,
    ANNOTATION_FILE_POPOVER_ARROW_POSITION_CLASS)) {
    const row = annotationsTableElement.insertRow(-1);
    const cell = row.insertCell(0);
    if (validationResult.error) {
      cell.innerHTML = createTableRowElementMarkupWthError(fileName, validationResult.message,
        ANNOTATION_FILE_POPOVER_POSITION_CLASS,
        ANNOTATION_FILE_POPOVER_ARROW_POSITION_CLASS,
        ANNOTATIONS_TABLE_INDICATOR, popoverIndex += 1);
    } else {
      cell.innerHTML = createTableRowElementMarkup(fileName, ANNOTATIONS_TABLE_INDICATOR);
    }
  }
}

function setTitleElement(title) {
  titleElement.innerHTML = title;
}

function setTitleElementMarginTop(pixels) {
  titleElement.style.marginTop = pixels;
}

function resetTitleElementMarginTop() {
  titleElement.style.marginTop = '';
}

function setButtonGroupElementMarginTop(pixels) {
  buttonsGroupElement.style.marginTop = pixels;
}

// should be a global variable
function isFirefox() {
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}

function setButtonGroupElementMarginTopByBrowser() {
  if (!isFirefox()) {
    setButtonGroupElementMarginTop('3px');
  } else {
    setButtonGroupElementMarginTop('1px');
  }
}

function resetButtonGroupElementMarginTop() {
  buttonsGroupElement.style.marginTop = '';
}

function displayFinishButtonElement() {
  finishButtonElement.style.display = '';
}

function displayUploadButtonElement() {
  uploadButtonElement.style.display = '';
}

function hideUploadButtonElement() {
  uploadButtonElement.style.display = 'none';
}

function displayBackButton() {
  backButtonElement.style.display = '';
}

function hideBackButton() {
  backButtonElement.style.display = 'none';
}

function displayUploadDatasetsOuterContainerElement() {
  uploadDatasetsOuterContainerElement.style.display = '';
}

function hideUploadDatasetsOuterContainerElement() {
  uploadDatasetsOuterContainerElement.style.display = 'none';
}

function setTriggerAcceptedFileFormat(format) {
  uploadDatasetFilesTriggerElement.accept = format;
}

function changeUploadDatasetsModalElementDimensions(width, height) {
  uploadDatasetsModalElement.style.width = `${width}px`;
  uploadDatasetsModalElement.style.height = `${height}px`;
}

function resetUploadDatasetsModalElementDimensions() {
  uploadDatasetsModalElement.style.width = '';
  uploadDatasetsModalElement.style.height = '';
}

window.uploadDatasetsModalImagesTableScroll = () => {
  annotationsTableOuterContainerElement.scrollTo(0, imagesTableOuterContainerElement.scrollTop);
};

window.uploadDatasetsModalAnnotationsTableScroll = () => {
  imagesTableOuterContainerElement.scrollTo(0, annotationsTableOuterContainerElement.scrollTop);
};

// will later take an object argument with relevant input attributes
function prepareUploadDatasetsView() {
  setTitleElementMarginTop('8px');
  setTitleElement('COCO JSON');
  setTriggerAcceptedFileFormat('.json, image/*');
  displayBackButton();
  displayUploadButtonElement();
  displayFinishButtonElement();
  setButtonGroupElementMarginTopByBrowser();
  displayUploadDatasetsOuterContainerElement();
  changeUploadDatasetsModalElementDimensions(modalWidth, modalHeight);
}

function hideUploadDatasetsViewAssets() {
  hideBackButton();
  hideUploadButtonElement();
  resetTitleElementMarginTop();
  resetButtonGroupElementMarginTop();
  hideUploadDatasetsOuterContainerElement();
  resetUploadDatasetsModalElementDimensions();
}

function assignUploadDatasetsViewLocalVariables() {
  buttonsGroupElement = document.getElementById('upload-datasets-modal-buttons');
  titleElement = document.getElementById('upload-datsets-modal-upload-datasets-title');
  uploadDatasetsOuterContainerElement = document.getElementById('upload-datsets-modal-upload-datasets-outer-container');
  backButtonElement = document.getElementById('upload-datasets-modal-back-button');
  uploadButtonElement = document.getElementById('upload-datasets-modal-upload-datasets-upload-button');
  uploadDatasetFilesTriggerElement = document.getElementById('upload-datasets-modal-upload-datasets-upload-trigger');
  finishButtonElement = document.getElementById('upload-datasets-modal-finish-button');
  imagesTableElement = document.getElementById('upload-datsets-modal-upload-datasets-images-table');
  imagesTableOuterContainerElement = document.getElementById('upload-datsets-modal-upload-datasets-images-table-outer-container');
  annotationsTableOuterContainerElement = document.getElementById('upload-datsets-modal-upload-datasets-annotations-table-outer-container');
  annotationsTableElement = document.getElementById('upload-datsets-modal-upload-datasets-annotations-table');
  uploadDatasetsModalElement = document.getElementById('upload-datasets-modal-parent');
}

export {
  hideUploadDatasetsViewAssets, insertRowToImagesTable, changeAllImagesTableRowsToDefault,
  assignUploadDatasetsViewLocalVariables, prepareUploadDatasetsView, insertRowToAnnotationsTable,
  changeAnnotationRowToDefault, removeRow,
};
