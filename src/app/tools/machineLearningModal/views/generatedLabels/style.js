import { getScrollbarWidth } from '../../../globalStyling/style.js';
import scrollIntoViewIfNeeded from '../../../utils/tableUtils.js';
import {
  getCaretPositionOnDiv, emptyContentEditableFirefoxBugFix,
  isVerticalScrollPresent, getDefaultFont, setCaretPositionOnDiv,
} from '../../../utils/elementCaretUtils.js';
import { preprocessPastedText, preprocessLabelText } from '../../../utils/textProcessingUtils.js';
import { getScreenSizeDelta } from '../../../globalStyling/screenSizeDelta.js';
import IS_FIREFOX from '../../../utils/browserType.js';

let editingActive = false;
let activeTextRow = null;
let activeTextElement = null;
let displayingRedEditButton = false;
let maxWidthStyleAppended = false;
let overflowScrollWidth = 0;
let objectNames = null;
let tableMaxWidth = null;
let isTableMaxHeightSet = false;

let generatedLabelsParentElement = null;
let generatedLabelsTableElement = null;
let generatedLabelsOuterContainerElement = null;
let submitButtonElement = null;
let descriptionElement = null;

function displayHighlightedDefaultEditLabelButton(element) {
  if (activeTextElement !== element && !element.classList.contains('activeLabelEditIcon')) {
    if (!editingActive) {
      element.style.backgroundColor = '#f7f7f7';
      element.childNodes[1].style.display = 'none';
      element.childNodes[3].style.display = '';
    } else if (element !== activeTextRow) {
      element.childNodes[1].style.display = 'none';
      element.childNodes[3].style.display = '';
    }
  }
}

function displayGreyedDefaultEditLabelButton(element) {
  if (activeTextElement !== element && !element.classList.contains('activeLabelEditIcon')) {
    if (!editingActive) {
      element.childNodes[1].style.display = '';
      element.childNodes[3].style.display = 'none';
      element.style.backgroundColor = '';
    } else if (element !== activeTextRow) {
      element.childNodes[1].style.display = '';
      element.childNodes[3].style.display = 'none';
    }
  }
}

function scrollHorizontallyToAppropriateWidth(text) {
  let myCanvas = document.createElement('canvas');
  const context = myCanvas.getContext('2d');
  context.font = getDefaultFont(activeTextElement);
  const metrics = context.measureText(text);
  let originalParentMaxWidth = 337 / getScreenSizeDelta();
  if (isVerticalScrollPresent(generatedLabelsParentElement)) {
    originalParentMaxWidth -= overflowScrollWidth;
  }
  if (metrics.width > originalParentMaxWidth) {
    generatedLabelsParentElement.scrollLeft = metrics.width - 312 / getScreenSizeDelta();
  } else {
    generatedLabelsParentElement.scrollLeft = 0;
  }
  myCanvas = null;
}

function MLLabelTextPaste(event) {
  event.stopPropagation();
  event.preventDefault();
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData('Text');
  const caretOnPaste = getCaretPositionOnDiv(activeTextElement, true);
  const caretPositionEnd = caretOnPaste.position;
  const caretPositionStart = caretPositionEnd - caretOnPaste.highlightRangeOnPaste;
  const preprocessedPastedData = preprocessPastedText(pastedData);
  activeTextElement.innerHTML = activeTextElement.innerHTML.slice(0, caretPositionStart)
   + preprocessedPastedData + activeTextElement.innerHTML.slice(caretPositionEnd);
  setCaretPositionOnDiv(caretPositionStart + preprocessedPastedData.length, activeTextElement,
    false, scrollHorizontallyToAppropriateWidth);
}

function updateGeneratedLabelsElementWidth() {
  generatedLabelsParentElement.style.width = `${activeTextRow.clientWidth + overflowScrollWidth}px`;
  if (!maxWidthStyleAppended
      && parseInt(generatedLabelsParentElement.style.width, 10) > tableMaxWidth) {
    generatedLabelsParentElement.style.maxWidth = `${tableMaxWidth}px`;
    generatedLabelsParentElement.style.overflowX = 'auto';
    maxWidthStyleAppended = true;
  } else if (maxWidthStyleAppended
      && parseInt(generatedLabelsParentElement.style.width, 10) < tableMaxWidth) {
    generatedLabelsParentElement.style.maxWidth = '';
    generatedLabelsParentElement.style.overflowX = 'hidden';
    maxWidthStyleAppended = false;
  }
}

function changeEditedLabelText(text) {
  activeTextElement.innerHTML = text;
  window.setTimeout(() => {
    updateGeneratedLabelsElementWidth();
  }, 1);
}

function setEditingStateToFalse() {
  setTimeout(() => {
    editingActive = false;
    activeTextRow = null;
    activeTextElement = null;
  }, 1);
}

function stopEditingActiveTextElement() {
  activeTextElement.contentEditable = false;
  activeTextRow.style.backgroundColor = '';
  activeTextRow.childNodes[1].style.display = '';
  if (displayingRedEditButton) {
    activeTextRow.childNodes[7].style.display = 'none';
    displayingRedEditButton = false;
  } else {
    activeTextRow.childNodes[5].style.display = 'none';
  }
  activeTextRow.style.cursor = 'pointer';
  setEditingStateToFalse();
}

function getLastDigitFromText(text) {
  if (text.match(/\d+$/)) {
    return text.match(/\d+$/)[0];
  }
  return -1;
}

function isElementIdNotTheGeneratedLabelsElementId(element) {
  if (element.id.startsWith('MLLabel')) {
    const elementIdNumber = getLastDigitFromText(element.id);
    const activeTextElementIdNumber = getLastDigitFromText(activeTextElement.id);
    return elementIdNumber !== activeTextElementIdNumber;
  }
  return true;
}

function isElementNotTheCurrentlyActiveTextRow(element) {
  return activeTextRow && activeTextRow !== element;
}

function isElementNotTheCurrentlyActiveTextElement(element) {
  return activeTextElement && activeTextElement !== element;
}

function canChangeRowToStopEdit(element) {
  if (isElementNotTheCurrentlyActiveTextElement(element)
    && isElementNotTheCurrentlyActiveTextRow(element)
    && isElementIdNotTheGeneratedLabelsElementId(element)) {
    return true;
  }
  return false;
}

function setTextElementContentToEditable() {
  activeTextElement.contentEditable = true;
}

function setElementStyleToActive(element) {
  element.style.backgroundColor = '#f7f7f7';
  setTextElementContentToEditable();
  element.childNodes[5].style.display = '';
  element.childNodes[1].style.display = 'none';
  element.childNodes[3].style.display = 'none';
  element.style.cursor = 'auto';
}

function setActiveElementProperties(element) {
  activeTextRow = element;
  activeTextElement = element.childNodes[9];
}

function changeRowToEdit(element) {
  if (element !== activeTextRow) {
    const textElement = element.childNodes[9];
    setActiveElementProperties(element);
    setElementStyleToActive(element);
    scrollIntoViewIfNeeded(textElement, generatedLabelsParentElement);
    setCaretPositionOnDiv(textElement.innerHTML.length, textElement, false,
      scrollHorizontallyToAppropriateWidth);
    editingActive = true;
  }
}

function emptyDivFirefoxBugFix(key) {
  if (IS_FIREFOX && key === 'Backspace') emptyContentEditableFirefoxBugFix(activeTextElement);
}

function displayRedEditButtonIfActiveTextEmpty() {
  const preprocessedText = preprocessLabelText(activeTextElement.innerHTML);
  if (preprocessedText === '') {
    activeTextRow.childNodes[5].style.display = 'none';
    activeTextRow.childNodes[7].style.display = '';
    displayingRedEditButton = true;
  } else if (displayingRedEditButton) {
    activeTextRow.childNodes[5].style.display = '';
    activeTextRow.childNodes[7].style.display = 'none';
    displayingRedEditButton = false;
  }
}

function updateGeneratedLabelsParentElementWidthOnStartup() {
  activeTextRow = generatedLabelsTableElement.childNodes[1].childNodes[0].childNodes[0];
  updateGeneratedLabelsElementWidth();
  activeTextRow = null;
}

function calculateContainerDivHeight() {
  const numberOfRows = Object.keys(objectNames).length;
  const baseHeight = numberOfRows > 1 ? 104 : 114;
  const numberOfVisibleRows = numberOfRows > 5 ? 5 : numberOfRows;
  const newNameHeight = baseHeight / getScreenSizeDelta() + numberOfVisibleRows * 10;
  return `${newNameHeight}px`;
}

function setLabelsParentElementMaxHeight() {
  const tableElement = generatedLabelsParentElement.childNodes[1].childNodes[1];
  if (tableElement.childNodes.length > 0) {
    generatedLabelsParentElement.style.maxHeight = `${generatedLabelsParentElement.childNodes[1].childNodes[1].childNodes[0].getBoundingClientRect().height * 5}px`;
    isTableMaxHeightSet = true;
  }
}

function changeElementsToVisible() {
  generatedLabelsOuterContainerElement.style.display = '';
  generatedLabelsOuterContainerElement.style.height = calculateContainerDivHeight();
}

function changeElementsToMoveListUpwards() {
  submitButtonElement.style.marginTop = `${2 / getScreenSizeDelta()}px`;
  submitButtonElement.style.marginBottom = `${6 / getScreenSizeDelta()}px`;
  descriptionElement.style.marginBottom = `${6 / getScreenSizeDelta()}px`;
}

function resetElementsToMoveListToDefaultPosition() {
  submitButtonElement.style.marginTop = '';
  submitButtonElement.style.marginBottom = '';
  descriptionElement.style.marginBottom = '';
}

function createLabelElementMarkup(labelText, id) {
  return `
    <div class="machine-learning-modal-generated-labels-row" onClick="editMachineLearningLabel(this)" onMouseEnter="displayMachineLearningModalEditLabelButton(this)" onMouseLeave="hideMachineLearningModalEditLabelButton(this)">
      <img class="defaultLabelEditIcon machine-learning-modal-generated-labels-edit-icon" src="assets/svg/edit-disabled.svg" alt="edit">
      <img id="MLLabelHighlightedEditButton${id}" class="defaultLabelEditIcon machine-learning-modal-generated-labels-edit-icon" style="display: none" src="assets/svg/edit.svg" alt="edit">
      <img id="MLLabelActiveEditButton${id}" class="defaultLabelEditIcon machine-learning-modal-generated-labels-edit-icon reverse-icon" style="display: none" src="assets/svg/edit-blue.svg" alt="edit">
      <img id="MLLabelDisabledEditButton${id}" class="defaultLabelEditIcon machine-learning-modal-generated-labels-edit-icon reverse-icon" style="display: none" src="assets/svg/edit-red.svg" alt="edit">
      <div id="MLLabelText${id}" class="machine-learning-modal-generated-labels-input" spellcheck="false" onkeydown="MLLabelTextKeyDown(event)" onpaste="MLLabelTextPaste(event)">${labelText}</div>
    </div>
  `;
}

// fix for chrome where upon clicking on a row to edit, the row height
// would get smaller
function triggerContentEditableOnce(cell) {
  const textInput = cell.childNodes[1].childNodes[9];
  textInput.contentEditable = true;
  setTimeout(() => {
    textInput.contentEditable = false;
  });
}

function changeModalStylingOnGeneratedLabelData(numberOfItems, longestName) {
  if (numberOfItems > 4) {
    changeElementsToMoveListUpwards();
  } else {
    resetElementsToMoveListToDefaultPosition();
  }
  generatedLabelsTableElement.style.marginLeft = longestName <= 3 ? 'unset' : 'auto';
}

function populateGeneratedLabelsTable() {
  let index = 0;
  let longestName = 0;
  Object.keys(objectNames).forEach((key) => {
    const newNameRow = generatedLabelsTableElement.insertRow(-1);
    const cell = newNameRow.insertCell(0);
    cell.innerHTML = createLabelElementMarkup(objectNames[key].pendingName, index);
    index += 1;
    if (longestName < objectNames[key].pendingName.length) {
      longestName = objectNames[key].pendingName.length;
    }
    triggerContentEditableOnce(cell);
  });
  changeModalStylingOnGeneratedLabelData(index, longestName);
}

function changeModalDescription() {
  descriptionElement.innerHTML = 'The following names were automatically assigned to the generated objects, you can edit them below:';
}

function displayDescription() {
  descriptionElement.style.display = '';
}

function setLocalVariables() {
  overflowScrollWidth = getScrollbarWidth();
}

function displayViewElements(objectNamesArg) {
  objectNames = objectNamesArg;
  setLocalVariables();
  changeModalDescription();
  displayDescription();
  populateGeneratedLabelsTable();
  changeElementsToVisible();
  if (!isTableMaxHeightSet) setLabelsParentElementMaxHeight();
  updateGeneratedLabelsParentElementWidthOnStartup();
}

function removeGeneratedLabelsTableRows() {
  const newtbody = document.createElement('tbody');
  if (generatedLabelsTableElement.childNodes[1]) {
    generatedLabelsTableElement.replaceChild(newtbody, generatedLabelsTableElement.childNodes[1]);
  }
}

function hideGeneratedLabelsViewAssets() {
  generatedLabelsOuterContainerElement.style.display = 'none';
  removeGeneratedLabelsTableRows();
}

function assignGeneratedLabelsViewLocalVariables() {
  tableMaxWidth = 352 / getScreenSizeDelta();
  descriptionElement = document.getElementById('machine-learning-modal-description');
  generatedLabelsParentElement = document.getElementById('machine-learning-modal-generated-labels');
  submitButtonElement = document.getElementById('machine-learning-modal-generated-labels-submit-button');
  generatedLabelsTableElement = document.getElementById('machine-learning-modal-generated-labels-table');
  generatedLabelsOuterContainerElement = document.getElementById('machine-learning-modal-generated-labels-outer-container');
}

export {
  displayGreyedDefaultEditLabelButton, changeEditedLabelText,
  emptyDivFirefoxBugFix, assignGeneratedLabelsViewLocalVariables,
  stopEditingActiveTextElement, displayRedEditButtonIfActiveTextEmpty,
  canChangeRowToStopEdit, MLLabelTextPaste, hideGeneratedLabelsViewAssets,
  scrollHorizontallyToAppropriateWidth, displayViewElements, changeRowToEdit,
  updateGeneratedLabelsElementWidth, displayHighlightedDefaultEditLabelButton,
};
