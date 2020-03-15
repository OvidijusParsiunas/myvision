let titleElement = null;
let backButtonElement = null;
let imagesTableElement = null;
let buttonsGroupElement = null;
let uploadButtonElement = null;
let annotationsTableElement = null;
let uploadDatasetsModalElement = null;
let imagesTableOuterContainerElement = null;
let uploadDatasetFilesTriggerElement = null;
let uploadDatasetsOuterContainerElement = null;
let annotationsTableOuterContainerElement = null;
let errorRowIndex = 0;
const modalWidth = 505;
const modalHeight = 340;
const ANNOTATION_FILE_ERROR_POPOVER_POSITION_CLASS = 'upload-datasets-modal-upload-datasets-table-error-row-popover-left';
const IMAGE_FILE_ERROR_POPOVER_POSITION_CLASS = 'upload-datasets-modal-upload-datasets-table-error-row-popover-right';

function createTableRowElementMarkup(fileName) {
  return `
    <div class="upload-datasets-modal-upload-datasets-table-row">
      <div class="upload-datasets-modal-upload-datasets-table-row-text">${fileName}</div>
    </div>
  `;
}

function createTableRowElementMarkupWthError(fileName, message, popoverPositionClass) {
  return `
    <div id="upload-datasets-modal-file-error-popover-${errorRowIndex}" class="popover upload-datasets-modal-upload-datasets-table-error-row-popover ${popoverPositionClass}">${message}</div>
    <div id="upload-datasets-modal-file-error-popover-arrow-${errorRowIndex}" style="margin-left: ${(modalWidth / 2 / 2) - 20}px;" class="arrow default-arrow-position upload-datasets-modal-upload-datasets-table-error-row-popover-arrow-color "></div>
    <div class="upload-datasets-modal-upload-datasets-table-row">
        <div class="upload-datasets-modal-upload-datasets-table-row-text upload-datasets-modal-upload-datasets-table-row-text-error" onmouseenter="displayUploadDatasetsAnnotationFileErrorPopover(${errorRowIndex})" onmouseleave="removeUploadDatasetsAnnotationFileErrorPopover(${errorRowIndex})">${fileName}</div>
    </div>
  `;
}

window.displayUploadDatasetsAnnotationFileErrorPopover = (id) => {
  document.getElementById(`upload-datasets-modal-file-error-popover-${id}`).style.display = 'block';
  document.getElementById(`upload-datasets-modal-file-error-popover-arrow-${id}`).style.display = 'block';
};

window.removeUploadDatasetsAnnotationFileErrorPopover = (id) => {
  document.getElementById(`upload-datasets-modal-file-error-popover-${id}`).style.display = 'none';
  document.getElementById(`upload-datasets-modal-file-error-popover-arrow-${id}`).style.display = 'none';
};

function checkFileAlreadyInTable(newFileName, validationResult, tableElement, errorClass) {
  const tableBody = tableElement.childNodes[1];
  for (let i = 0; i < tableBody.childNodes.length; i += 1) {
    let fileName = '';
    if (tableBody.childNodes[i].childNodes[0].childNodes[1].id.startsWith('upload-datasets-modal-file-error-popover-')) {
      fileName = tableBody.childNodes[i].childNodes[0].childNodes[5]
        .childNodes[1].innerHTML;
    } else {
      fileName = tableBody.childNodes[i].childNodes[0].childNodes[1].childNodes[1].innerHTML;
    }
    if (newFileName === fileName) {
      if (validationResult.error) {
        const rowParentElement = tableBody.childNodes[i].childNodes[0];
        rowParentElement.innerHTML = createTableRowElementMarkupWthError(
          newFileName, validationResult.message, errorClass,
        );
        errorRowIndex += 1;
      }
      return true;
    }
  }
  return false;
}

function insertRowToImagesTable(fileName, validationResult) {
  if (!checkFileAlreadyInTable(fileName, validationResult,
    imagesTableElement, ANNOTATION_FILE_ERROR_POPOVER_POSITION_CLASS)) {
    const row = imagesTableElement.insertRow(-1);
    const cell = row.insertCell(0);
    if (validationResult.error) {
      cell.innerHTML = createTableRowElementMarkupWthError(fileName, validationResult.message,
        IMAGE_FILE_ERROR_POPOVER_POSITION_CLASS);
      errorRowIndex += 1;
    } else {
      cell.innerHTML = createTableRowElementMarkup(fileName);
    }
  }
}

function insertRowToAnnotationsTable(fileName, validationResult) {
  if (!checkFileAlreadyInTable(fileName, validationResult,
    annotationsTableElement, IMAGE_FILE_ERROR_POPOVER_POSITION_CLASS)) {
    const row = annotationsTableElement.insertRow(-1);
    const cell = row.insertCell(0);
    if (validationResult.error) {
      cell.innerHTML = createTableRowElementMarkupWthError(fileName, validationResult.message,
        ANNOTATION_FILE_ERROR_POPOVER_POSITION_CLASS);
      errorRowIndex += 1;
    } else {
      cell.innerHTML = createTableRowElementMarkup(fileName);
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
  uploadButtonElement = document.getElementById('upload-datasets-modal-upload-datasets-upload-button');
  uploadDatasetFilesTriggerElement = document.getElementById('upload-datasets-modal-upload-datasets-upload-trigger');
  backButtonElement = document.getElementById('upload-datasets-modal-back-button');
  imagesTableElement = document.getElementById('upload-datsets-modal-upload-datasets-images-table');
  imagesTableOuterContainerElement = document.getElementById('upload-datsets-modal-upload-datasets-images-table-outer-container');
  annotationsTableOuterContainerElement = document.getElementById('upload-datsets-modal-upload-datasets-annotations-table-outer-container');
  annotationsTableElement = document.getElementById('upload-datsets-modal-upload-datasets-annotations-table');
  uploadDatasetsModalElement = document.getElementById('upload-datasets-modal-parent');
}

export {
  assignUploadDatasetsViewLocalVariables, prepareUploadDatasetsView,
  hideUploadDatasetsViewAssets, insertRowToImagesTable, insertRowToAnnotationsTable,
};
