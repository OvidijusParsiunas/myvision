import {
  ANNOTATIONS_TABLE_INDICATOR, CLASSES_TABLE_INDICATOR,
  TWO_TABLE_STRATEGY, THREE_TABLE_STRATEGY, IMAGES_TABLE_INDICATOR,
} from '../../consts.js';
import IS_FIREFOX from '../../../utils/browserType.js';
import { getScreenSizeDelta } from '../../../globalStyling/screenSizeDelta.js';

let titleElement = null;
let table1Element = null;
let table2Element = null;
let table3Element = null;
let backButtonElement = null;
let imagesTableElement = null;
let classesTableElement = null;
let finishButtonElement = null;
let buttonsGroupElement = null;
let uploadButtonElement = null;
let annotationsTableTitle = null;
let annotationsTableElement = null;
let uploadDatasetsModalElement = null;
let allImagesStyleSetToDefault = null;
let imagesTableOuterContainerElement = null;
let uploadDatasetFilesTriggerElement = null;
let uploadDatasetsOuterContainerElement = null;
let annotationsTableOuterContainerElement = null;

let popoverIndex = 0;
const modalWidth = 678;
const modalHeight = 390;
let currentTableStrategy = TWO_TABLE_STRATEGY;
let finishButtonEnabled = false;

const POPOVER_LEFT_POSITION_CLASS = 'upload-datasets-modal-upload-datasets-table-row-popover-left';
const POPOVER_ARROW_LEFT_POSITION_CLASS = 'upload-datasets-modal-upload-datasets-table-row-popover-arrow-left';
const POPOVER_RIGHT_POSITION_CLASS = 'upload-datasets-modal-upload-datasets-table-row-popover-right';
const POPOVER_ARROW_RIGHT_POSITION_CLASS = 'upload-datasets-modal-upload-datasets-table-row-popover-arrow-right';
const POPOVER_CENTER_POSITION_CLASS = 'upload-datasets-modal-upload-datasets-table-row-popover-center';
const POPOVER_ARROW_CENTER_POSITION_CLASS = 'upload-datasets-modal-upload-datasets-table-row-popover-arrow-center';
const TWO_TABLE_STRATEGY_CLASS = 'upload-datsets-modal-upload-datasets-two-table-strategy-section';
const THREE_TABLE_STRATEGY_CLASS = 'upload-datsets-modal-upload-datasets-three-table-strategy-section';
const POPOVER_ERROR_THEME_CLASS = 'error-popover-color-theme';
const POPOVER_ARROW_ERROR_THEME_CLASS = 'upload-datasets-modal-upload-datasets-table-error-row-popover-arrow';
const POPOVER_INFORMATION_THEME_CLASS = 'information-popover-color-theme';
const POPOVER_ARROW_INFORMATION_THEME_CLASS = 'upload-datasets-modal-upload-datasets-table-information-row-popover-arrow';
const ERROR_TEXT_THEME_CLASS = 'upload-datasets-modal-upload-datasets-table-row-text-error';
const PROCEED_BUTTON_CLASS = 'popup-proceed-button';
const ACTIVE_BUTTON_CLASS = 'popup-label-button';
const DISABLED_BUTTON_CLASS = 'popup-label-button-disabled';
const CLASSES_FILE_POPUP_INFORMATION = 'If this file belongs in the annotations table, make sure that each row contains exactly 5 attributes: class x y width height';
let currentAnnotationsPopoverPositionClass = null;
let currentAnnotationsPopoverArrowPositionClass = null;

function createTableRowElementMarkup(fileName, tableName) {
  return `
    <div class="upload-datasets-modal-upload-datasets-table-row">
        <div onmouseenter="displayActiveRemoveFileIcon(this)" onmouseleave="displayDefaultRemoveFileIcon(this)" onclick="removeFileFromUploadDatasetFiles('${fileName}', '${tableName}')">
          <img src="assets/svg/x-icon-default.svg" class="upload-datasets-modal-remove-file-button"  alt="remove">
          <img src="assets/svg/x-icon-active.svg" style="display: none" class="upload-datasets-modal-remove-file-button" alt="remove">
        </div>
      <div class="upload-datasets-modal-upload-datasets-table-row-text">${fileName}</div>
    </div>
  `;
}

function addPopoverArrowMarginLeftStyle(tableName) {
  if (currentTableStrategy === TWO_TABLE_STRATEGY
      && tableName === ANNOTATIONS_TABLE_INDICATOR) {
    return `style="margin-left: ${(((modalWidth / 2 / 2) - 20) / getScreenSizeDelta())}px;"`;
  }
  if (currentTableStrategy === THREE_TABLE_STRATEGY
    && tableName === CLASSES_TABLE_INDICATOR) {
    return `style="margin-left: ${(((modalWidth / 3 / 2) + 34) / getScreenSizeDelta())}px;"`;
  }
  return '';
}

function createTableRowElementMarkupWthPopover(fileName, message, popoverPositionClass,
  popoverArrowPositionClass, tableName, index, popoverColorThemeClass,
  popoverArrowTheme, textThemeClass) {
  return `
    <div id="upload-datasets-modal-file-popover-${index}" class="popover upload-datasets-modal-upload-datasets-table-row-popover ${popoverColorThemeClass} ${popoverPositionClass}">${message}</div>
    <div id="upload-datasets-modal-file-popover-arrow-${index}" ${addPopoverArrowMarginLeftStyle(tableName)} class="arrow ${popoverArrowTheme} ${popoverArrowPositionClass}"></div>
    <div class="upload-datasets-modal-upload-datasets-table-row">
        <div onmouseenter="displayActiveRemoveFileIcon(this)" onmouseleave="displayDefaultRemoveFileIcon(this)" onclick="removeFileFromUploadDatasetFiles('${fileName}', '${tableName}')">
          <img src="assets/svg/x-icon-default.svg" class="upload-datasets-modal-remove-file-button" alt="remove">
          <img src="assets/svg/x-icon-active.svg" style="display: none" class="upload-datasets-modal-remove-file-button" alt="remove">
        </div>
        <div class="upload-datasets-modal-upload-datasets-table-row-text ${textThemeClass}" onmouseenter="displayUploadDatasetsAnnotationFilePopover(${index}, '${tableName}')" onmouseleave="removeUploadDatasetsAnnotationFilePopover(${popoverIndex})">${fileName}</div>
    </div>
  `;
}

window.displayUploadDatasetsAnnotationFilePopover = (id, tableName) => {
  const tableOuterContainerElement = tableName === ANNOTATIONS_TABLE_INDICATOR
    ? annotationsTableOuterContainerElement : imagesTableOuterContainerElement;
  document.getElementById(`upload-datasets-modal-file-popover-${id}`).style.display = 'block';
  document.getElementById(`upload-datasets-modal-file-popover-${id}`).style.marginTop = `-${tableOuterContainerElement.scrollTop + 29.4 / getScreenSizeDelta()}px`;
  document.getElementById(`upload-datasets-modal-file-popover-arrow-${id}`).style.display = 'block';
  document.getElementById(`upload-datasets-modal-file-popover-arrow-${id}`).style.marginTop = `-${tableOuterContainerElement.scrollTop + 4 / getScreenSizeDelta()}px`;
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

function getTableElement(tableName) {
  switch (tableName) {
    case ANNOTATIONS_TABLE_INDICATOR:
      return annotationsTableElement;
    case IMAGES_TABLE_INDICATOR:
      return imagesTableElement;
    case CLASSES_TABLE_INDICATOR:
      return classesTableElement;
    default:
      return annotationsTableElement;
  }
}

function removeRow(subjectFileName, tableName) {
  const tableElement = getTableElement(tableName);
  const tableBody = tableElement.childNodes[1];
  for (let i = 0; i < tableBody.childNodes.length; i += 1) {
    const { fileName } = getFileName(tableBody, i);
    if (subjectFileName === fileName) {
      tableBody.childNodes[i].remove();
      return true;
    }
  }
  return false;
}

function getTableName(tableId) {
  switch (tableId) {
    case 'upload-datsets-modal-upload-datasets-annotations-table':
      return ANNOTATIONS_TABLE_INDICATOR;
    case 'upload-datsets-modal-upload-datasets-images-table':
      return IMAGES_TABLE_INDICATOR;
    case 'upload-datsets-modal-upload-datasets-classes-table':
      return CLASSES_TABLE_INDICATOR;
    default:
      return ANNOTATIONS_TABLE_INDICATOR;
  }
}

function checkFileAlreadyInTable(newFileName, validationResult, tableElement,
  popoverPositionClass, popoverArrowPositionClass) {
  const tableBody = tableElement.childNodes[1];
  for (let i = 0; i < tableBody.childNodes.length; i += 1) {
    const { fileName, currentRowHasError } = getFileName(tableBody, i);
    if (newFileName === fileName) {
      const tableName = getTableName(tableElement.id);
      const rowParentElement = tableBody.childNodes[i].childNodes[0];
      if (validationResult.error) {
        rowParentElement.innerHTML = createTableRowElementMarkupWthPopover(
          newFileName, validationResult.message, popoverPositionClass, popoverArrowPositionClass,
          tableName, popoverIndex += 1, POPOVER_ERROR_THEME_CLASS, POPOVER_ARROW_ERROR_THEME_CLASS,
          ERROR_TEXT_THEME_CLASS,
        );
        if (tableName === IMAGES_TABLE_INDICATOR) {
          allImagesStyleSetToDefault = false;
        }
      } else if (validationResult.information) {
        rowParentElement.innerHTML = createTableRowElementMarkupWthPopover(
          newFileName, validationResult.message, popoverPositionClass, popoverArrowPositionClass,
          tableName, popoverIndex += 1, POPOVER_INFORMATION_THEME_CLASS,
          POPOVER_ARROW_INFORMATION_THEME_CLASS, '',
        );
      } else if (currentRowHasError && !validationResult.error) {
        rowParentElement.innerHTML = createTableRowElementMarkup(newFileName, tableName);
      }
      rowParentElement.scrollIntoView();
      return true;
    }
  }
  return false;
}

function insertRowToClassesTable(fileName, validationResult) {
  let popoverThemeClass;
  let popoverArrowThemeClass;
  let textThemeClass;
  if (!validationResult.error) {
    validationResult.information = true;
    validationResult.message = CLASSES_FILE_POPUP_INFORMATION;
    popoverThemeClass = POPOVER_INFORMATION_THEME_CLASS;
    popoverArrowThemeClass = POPOVER_ARROW_INFORMATION_THEME_CLASS;
    textThemeClass = '';
  } else {
    popoverThemeClass = POPOVER_ERROR_THEME_CLASS;
    popoverArrowThemeClass = POPOVER_ARROW_ERROR_THEME_CLASS;
    textThemeClass = ERROR_TEXT_THEME_CLASS;
  }
  if (!checkFileAlreadyInTable(fileName, validationResult,
    classesTableElement, POPOVER_LEFT_POSITION_CLASS,
    POPOVER_ARROW_LEFT_POSITION_CLASS)) {
    const row = classesTableElement.insertRow(-1);
    const cell = row.insertCell(0);
    cell.innerHTML = createTableRowElementMarkupWthPopover(fileName, validationResult.message,
      POPOVER_LEFT_POSITION_CLASS, POPOVER_ARROW_LEFT_POSITION_CLASS,
      CLASSES_TABLE_INDICATOR, popoverIndex += 1,
      popoverThemeClass, popoverArrowThemeClass, textThemeClass);
    cell.scrollIntoView();
  }
}

function insertRowToImagesTable(fileName, validationResult) {
  if (!checkFileAlreadyInTable(fileName, validationResult,
    imagesTableElement, POPOVER_RIGHT_POSITION_CLASS,
    POPOVER_ARROW_RIGHT_POSITION_CLASS)) {
    const row = imagesTableElement.insertRow(-1);
    const cell = row.insertCell(0);
    if (validationResult.error) {
      cell.innerHTML = createTableRowElementMarkupWthPopover(fileName, validationResult.message,
        POPOVER_RIGHT_POSITION_CLASS, POPOVER_ARROW_RIGHT_POSITION_CLASS,
        IMAGES_TABLE_INDICATOR, popoverIndex += 1,
        POPOVER_ERROR_THEME_CLASS, POPOVER_ARROW_ERROR_THEME_CLASS,
        ERROR_TEXT_THEME_CLASS);
      allImagesStyleSetToDefault = false;
    } else {
      cell.innerHTML = createTableRowElementMarkup(fileName, IMAGES_TABLE_INDICATOR);
    }
    cell.scrollIntoView();
  }
}

function changeAllImagesTableRowsToDefault() {
  if (!allImagesStyleSetToDefault) {
    const tableBody = imagesTableElement.childNodes[1];
    for (let i = 0; i < tableBody.childNodes.length; i += 1) {
      const rowParentElement = tableBody.childNodes[i].childNodes[0];
      const { fileName } = getFileName(tableBody, i);
      rowParentElement.innerHTML = createTableRowElementMarkup(fileName, IMAGES_TABLE_INDICATOR);
      rowParentElement.scrollIntoView();
    }
  }
  allImagesStyleSetToDefault = true;
}

function changeClassesRowToDefault(classesFileName) {
  const tableBody = classesTableElement.childNodes[1];
  for (let i = 0; i < tableBody.childNodes.length; i += 1) {
    const rowParentElement = tableBody.childNodes[i].childNodes[0];
    const { fileName } = getFileName(tableBody, i);
    if (classesFileName === fileName) {
      rowParentElement.innerHTML = createTableRowElementMarkup(
        classesFileName, CLASSES_TABLE_INDICATOR,
      );
      rowParentElement.scrollIntoView();
    }
  }
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
      rowParentElement.scrollIntoView();
    }
  }
}

function insertRowToAnnotationsTable(fileName, validationResult) {
  if (!checkFileAlreadyInTable(fileName, validationResult,
    annotationsTableElement, currentAnnotationsPopoverPositionClass,
    currentAnnotationsPopoverArrowPositionClass)) {
    const row = annotationsTableElement.insertRow(-1);
    const cell = row.insertCell(0);
    if (validationResult.error) {
      cell.innerHTML = createTableRowElementMarkupWthPopover(fileName, validationResult.message,
        currentAnnotationsPopoverPositionClass, currentAnnotationsPopoverArrowPositionClass,
        ANNOTATIONS_TABLE_INDICATOR, popoverIndex += 1,
        POPOVER_ERROR_THEME_CLASS, POPOVER_ARROW_ERROR_THEME_CLASS, ERROR_TEXT_THEME_CLASS);
    } else {
      cell.innerHTML = createTableRowElementMarkup(fileName,
        ANNOTATIONS_TABLE_INDICATOR);
    }
    cell.scrollIntoView();
  }
}

function clearTable(tableElement) {
  const newTbody = document.createElement('tbody');
  if (tableElement.childNodes[1]) {
    tableElement.replaceChild(newTbody, tableElement.childNodes[1]);
  }
}

function clearAllTables() {
  clearTable(annotationsTableElement);
  clearTable(imagesTableElement);
  clearTable(classesTableElement);
}

function setTitleElement(title) {
  titleElement.innerHTML = title;
}

function setTitleElementMarginTop(length) {
  titleElement.style.marginTop = `${length / getScreenSizeDelta()}px`;
}

function resetTitleElementMarginTop() {
  titleElement.style.marginTop = '';
}

function displayTable1() {
  table1Element.style.display = '';
}

function hideTable1() {
  table1Element.style.display = 'none';
}

function changeTwoTableStrategyToThree() {
  table2Element.classList.replace(TWO_TABLE_STRATEGY_CLASS, THREE_TABLE_STRATEGY_CLASS);
  table3Element.classList.replace(TWO_TABLE_STRATEGY_CLASS, THREE_TABLE_STRATEGY_CLASS);
}

function changeThreeTableStrategyToTwo() {
  table2Element.classList.replace(THREE_TABLE_STRATEGY_CLASS, TWO_TABLE_STRATEGY_CLASS);
  table3Element.classList.replace(THREE_TABLE_STRATEGY_CLASS, TWO_TABLE_STRATEGY_CLASS);
}

function setAnnotationsTableTitle(format) {
  annotationsTableTitle.innerHTML = `Annotations (${format})`;
}

function setButtonGroupElementMarginTop(length) {
  buttonsGroupElement.style.marginTop = length;
}

function setButtonGroupElementMarginTopByBrowser() {
  if (!IS_FIREFOX) {
    setButtonGroupElementMarginTop(`${272 / getScreenSizeDelta()}px`);
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

function hideFinishButtonElement() {
  finishButtonElement.style.display = 'none';
}

function enableFinishButton() {
  if (!finishButtonEnabled) {
    finishButtonElement.classList.add(PROCEED_BUTTON_CLASS);
    finishButtonElement.classList.replace(DISABLED_BUTTON_CLASS, ACTIVE_BUTTON_CLASS);
    finishButtonEnabled = true;
  }
}

function disableFinishButton() {
  finishButtonElement.classList.remove(PROCEED_BUTTON_CLASS);
  finishButtonElement.classList.replace(ACTIVE_BUTTON_CLASS, DISABLED_BUTTON_CLASS);
  finishButtonEnabled = false;
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

function getAcceptedFileFormat() {
  return uploadDatasetFilesTriggerElement.accept;
}

function setAcceptedFileFormatTrigger(format) {
  uploadDatasetFilesTriggerElement.accept = format;
}

function changeUploadDatasetsModalElementDimensions(width, height) {
  uploadDatasetsModalElement.style.width = `${width / getScreenSizeDelta()}px`;
  uploadDatasetsModalElement.style.height = `${height / getScreenSizeDelta()}px`;
}

function resetUploadDatasetsModalElementDimensions() {
  uploadDatasetsModalElement.style.width = '';
  uploadDatasetsModalElement.style.height = '';
}

function displayTableStrategyRelevantAssets(tableStrategy) {
  if (tableStrategy === THREE_TABLE_STRATEGY) {
    displayTable1();
    displayUploadButtonElement();
    changeUploadDatasetsModalElementDimensions(977, modalHeight);
    changeTwoTableStrategyToThree();
    currentAnnotationsPopoverPositionClass = POPOVER_CENTER_POSITION_CLASS;
    currentAnnotationsPopoverArrowPositionClass = POPOVER_ARROW_CENTER_POSITION_CLASS;
  } else {
    displayUploadButtonElement();
    changeUploadDatasetsModalElementDimensions(modalWidth, modalHeight);
    currentAnnotationsPopoverPositionClass = POPOVER_LEFT_POSITION_CLASS;
    currentAnnotationsPopoverArrowPositionClass = POPOVER_ARROW_LEFT_POSITION_CLASS;
  }
  currentTableStrategy = tableStrategy;
}

function prepareUploadDatasetsView(formatName, acceptedFileFormats, annotationFileFormat,
  tableStrategy) {
  setTitleElementMarginTop(9);
  setTitleElement(formatName);
  setAnnotationsTableTitle(annotationFileFormat);
  setAcceptedFileFormatTrigger(acceptedFileFormats);
  displayBackButton();
  displayFinishButtonElement();
  setButtonGroupElementMarginTopByBrowser();
  displayTableStrategyRelevantAssets(tableStrategy);
  displayUploadDatasetsOuterContainerElement();
}

function hideUploadDatasetsViewAssets() {
  if (currentTableStrategy === THREE_TABLE_STRATEGY) {
    hideTable1();
    changeThreeTableStrategyToTwo();
    currentTableStrategy = TWO_TABLE_STRATEGY;
  }
  hideBackButton();
  hideUploadButtonElement();
  hideFinishButtonElement();
  disableFinishButton();
  resetTitleElementMarginTop();
  resetButtonGroupElementMarginTop();
  hideUploadDatasetsOuterContainerElement();
  resetUploadDatasetsModalElementDimensions();
  clearAllTables();
  popoverIndex = 0;
}

function assignUploadDatasetsViewLocalVariables() {
  table1Element = document.getElementById('upload-datasets-modal-upload-datasets-table-1');
  table2Element = document.getElementById('upload-datasets-modal-upload-datasets-table-2');
  table3Element = document.getElementById('upload-datasets-modal-upload-datasets-table-3');
  buttonsGroupElement = document.getElementById('upload-datasets-modal-buttons');
  titleElement = document.getElementById('upload-datsets-modal-upload-datasets-title');
  uploadDatasetsOuterContainerElement = document.getElementById('upload-datsets-modal-upload-datasets-outer-container');
  backButtonElement = document.getElementById('upload-datasets-modal-back-button');
  uploadButtonElement = document.getElementById('upload-datasets-modal-upload-datasets-upload-button');
  uploadDatasetFilesTriggerElement = document.getElementById('upload-datasets-modal-upload-datasets-upload-trigger');
  finishButtonElement = document.getElementById('upload-datasets-modal-finish-button');
  imagesTableElement = document.getElementById('upload-datsets-modal-upload-datasets-images-table');
  imagesTableOuterContainerElement = document.getElementById('upload-datsets-modal-upload-datasets-images-table-outer-container');
  annotationsTableTitle = document.getElementById('upload-datasets-modal-upload=datasets-annotations-table-title');
  annotationsTableOuterContainerElement = document.getElementById('upload-datsets-modal-upload-datasets-annotations-table-outer-container');
  classesTableElement = document.getElementById('upload-datsets-modal-upload-datasets-classes-table');
  annotationsTableElement = document.getElementById('upload-datsets-modal-upload-datasets-annotations-table');
  uploadDatasetsModalElement = document.getElementById('upload-datasets-modal-parent');
}

export {
  insertRowToClassesTable, changeClassesRowToDefault, getAcceptedFileFormat,
  changeAnnotationRowToDefault, removeRow, enableFinishButton, disableFinishButton,
  hideUploadDatasetsViewAssets, insertRowToImagesTable, changeAllImagesTableRowsToDefault,
  assignUploadDatasetsViewLocalVariables, prepareUploadDatasetsView, insertRowToAnnotationsTable,
};
