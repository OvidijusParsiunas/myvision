import { setChangingMLGeneratedLabelNamesState } from '../../../toolkit/buttonClickEvents/facadeWorkersUtils/stateManager';

let editingActive = false;
let activeTextRow = null;
let activeTextElement = null;
let activeTextElementInitialText = '';
let displayingRedEditButton = false;
let maxWidthStyleAppended = false;
let overflowScrollWidth = 0;
let uniqueLabelPair = null;

let generatedLabelsParentElement = null;
let generatedLabelsTableElement = null;
let generatedLabelsOuterContainerElement = null;
let descriptionElement = null;
let buttonsGroupElement = null;

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

function isVerticalScrollPresent() {
  return generatedLabelsParentElement.scrollHeight > generatedLabelsParentElement.clientHeight;
}

function isHorizontalScrollPresent() {
  return generatedLabelsParentElement.scrollWidth > generatedLabelsParentElement.clientWidth;
}

function getDefaultFont() {
  const defaultSyle = window.getComputedStyle(activeTextElement, null);
  const size = defaultSyle.getPropertyValue('font-size');
  const fontFamily = defaultSyle.getPropertyValue('font-family');
  return `${size} ${fontFamily}`;
}

function scrollHorizontallyToAppropriateWidth(text) {
  let myCanvas = document.createElement('canvas');
  const context = myCanvas.getContext('2d');
  context.font = getDefaultFont();
  const metrics = context.measureText(text);
  let originalParentMaxWidth = 345;
  if (isVerticalScrollPresent()) originalParentMaxWidth -= overflowScrollWidth;
  if (metrics.width > originalParentMaxWidth) {
    generatedLabelsParentElement.scrollLeft = metrics.width - 320;
  } else {
    generatedLabelsParentElement.scrollLeft = 0;
  }
  myCanvas = null;
}

// replicated logic should be exported to a shared service
function setCaretPositionOnDiv(index, contentEditableElement, space) {
  let range;
  if (document.createRange) {
    // Firefox, Chrome, Opera, Safari, IE 9+
    range = document.createRange();
    // false means collapse to end rather than the start
    range.setStart(contentEditableElement.childNodes[0], index);
    range.collapse(false);
    const selection = window.getSelection();
    // remove any selections already made
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (document.selection) { // IE 8 and lower
    range = document.body.createTextRange();
    range.moveToElementText(contentEditableElement);
    // false means collapse to end rather than the start
    range.collapse(false);
    // make it the visible selection
    range.select();
  }
  if (!space) {
    scrollHorizontallyToAppropriateWidth(contentEditableElement.innerHTML.substring(0, index));
  }
}

function getCaretPositionOnDiv(editableDiv, paste) {
  const currentCaretPosition = { position: 0, highlightRangeOnPaste: 0 };
  let range = null;
  if (window.getSelection) {
    const selection = window.getSelection();
    if (selection.rangeCount) {
      range = selection.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode === editableDiv) {
        currentCaretPosition.position = range.endOffset;
      }
      if (paste) {
        currentCaretPosition.highlightRangeOnPaste = Math.abs(selection.focusOffset
          - selection.anchorOffset);
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    if (range.parentElement() === editableDiv) {
      const tempElement = document.createElement('span');
      editableDiv.insertBefore(tempElement, editableDiv.firstChild);
      const tempRange = range.duplicate();
      tempRange.moveToElementText(tempRange);
      tempRange.setEndPoint('EndToEnd', range);
      currentCaretPosition.position = tempRange.text.length;
    }
  }
  return currentCaretPosition;
}

function preprocessPastedText(text) {
  const noReturnChars = text.replace(/(\r\n|\n|\r)/gm, '');
  const spacesToHythons = noReturnChars.replace(/\s/g, '-');
  return spacesToHythons;
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
  setCaretPositionOnDiv(caretPositionStart + preprocessedPastedData.length, activeTextElement);
}

function setTextElementContentToEditable() {
  activeTextElement.contentEditable = true;
}

function setEditingStateToFalse() {
  setTimeout(() => {
    editingActive = false;
    activeTextRow = null;
  }, 1);
}

function updateGeneratedLabelsElementWidth() {
  generatedLabelsParentElement.style.width = `${activeTextRow.clientWidth + overflowScrollWidth}px`;
  if (!maxWidthStyleAppended && parseInt(generatedLabelsParentElement.style.width, 10) > 360) {
    generatedLabelsParentElement.style.maxWidth = '360px';
    generatedLabelsParentElement.style.overflowX = 'auto';
    maxWidthStyleAppended = true;
  } else if (maxWidthStyleAppended
    && parseInt(generatedLabelsParentElement.style.width, 10) < 360) {
    generatedLabelsParentElement.style.maxWidth = '';
    generatedLabelsParentElement.style.overflowX = 'hidden';
    maxWidthStyleAppended = false;
  }
}

function displayInitialTextIfEmpty() {
  if (activeTextElement.innerHTML === '') {
    activeTextElement.innerHTML = activeTextElementInitialText;
    window.setTimeout(() => {
      updateGeneratedLabelsElementWidth();
    }, 1);
  }
}

function getLastDigitFromText(text) {
  if (text.match(/\d+$/)) {
    return text.match(/\d+$/)[0];
  }
  return -1;
}

function setNewLabelName() {
  if (activeTextElement.innerHTML !== activeTextElementInitialText) {
    Object.keys(uniqueLabelPair).forEach((key) => {
      if (uniqueLabelPair[key].pendingName === activeTextElementInitialText) {
        uniqueLabelPair[key].pendingName = activeTextElement.innerHTML;
      }
    });
  }
}

function stopEditingActiveTextElement() {
  displayInitialTextIfEmpty();
  setNewLabelName();
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

function isElementNotTheCurrentlyActiveTextElement(element) {
  return activeTextElement && activeTextElement !== element;
}

function isElementNotTheCurrentlyActiveTextRow(element) {
  return activeTextRow && activeTextRow !== element;
}

function isElementIdNotTheGeneratedLabelsElementId(element) {
  if (element.id.startsWith('MLLabel')) {
    const elementIdNumber = getLastDigitFromText(element.id);
    const activeTextElementIdNumber = getLastDigitFromText(activeTextElement.id);
    return elementIdNumber !== activeTextElementIdNumber;
  }
  return true;
}

function stopEditingMLGeneratedLabelName(element) {
  if (isElementNotTheCurrentlyActiveTextElement(element)
    && isElementNotTheCurrentlyActiveTextRow(element)
    && isElementIdNotTheGeneratedLabelsElementId(element)) {
    stopEditingActiveTextElement();
  }
}

function isElementHeightFullyVisibleInParent(childElement, parentElement) {
  const childBoundingRect = childElement.getBoundingClientRect();
  const parentBoundingRect = parentElement.getBoundingClientRect();
  if (childBoundingRect.top < parentBoundingRect.top) {
    return false;
  }
  if ((isHorizontalScrollPresent()
    && childBoundingRect.bottom > parentBoundingRect.bottom - overflowScrollWidth)
    || (childBoundingRect.bottom > parentBoundingRect.bottom)) {
    return false;
  }
  return true;
}

function scrollIntoViewIfNeeded(childElement, parentElement) {
  if (!isElementHeightFullyVisibleInParent(childElement, parentElement)) {
    activeTextElement.scrollIntoView();
  }
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
  activeTextElementInitialText = element.childNodes[9].innerHTML;
}

function editMachineLearningLabel(element) {
  if (element !== activeTextRow) {
    const textElement = element.childNodes[9];
    setActiveElementProperties(element);
    setElementStyleToActive(element);
    scrollIntoViewIfNeeded(textElement, generatedLabelsParentElement);
    setCaretPositionOnDiv(textElement.innerHTML.length, textElement);
    editingActive = true;
  }
}

function displayRedEditButtonIfActiveTextEmpty() {
  if (activeTextElement.innerHTML === '') {
    activeTextRow.childNodes[5].style.display = 'none';
    activeTextRow.childNodes[7].style.display = '';
    displayingRedEditButton = true;
  }
}

function postProcessSpacesInTextElement() {
  const currentCaretPosition = getCaretPositionOnDiv(activeTextElement).position;
  activeTextElement.innerHTML = activeTextElement.innerHTML.replace(/\s/g, '-');
  setCaretPositionOnDiv(currentCaretPosition, activeTextElement, true);
}

function getScrollWidth() {
  // create a div with the scroll
  const div = document.createElement('div');
  div.style.overflowY = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';
  // must put it in the document, otherwise sizes will be 0
  document.body.append(div);
  const scrollWidth = div.offsetWidth - div.clientWidth;
  div.remove();
  return scrollWidth;
}

function createLabelElementMarkup(labelText, id) {
  return `
    <div class="machine-learning-popup-generated-labels-row" onClick="editMachineLearningLabel(this)" onMouseEnter="displayMachineLearningPopUpEditLabelButton(this)" onMouseLeave="hideMachineLearningPopUpEditLabelButton(this)">
      <img class="defaultLabelEditIcon machine-learning-popup-generated-labels-edit-icon" src="edit-disabled.svg" alt="edit">
      <img id="MLLabelHighlightedEditButton${id}" class="defaultLabelEditIcon machine-learning-popup-generated-labels-edit-icon" style="display: none" src="edit.svg" alt="edit">
      <img id="MLLabelActiveEditButton${id}" class="defaultLabelEditIcon machine-learning-popup-generated-labels-edit-icon reverse-icon" style="display: none" src="edit.svg" alt="edit">
      <img id="MLLabelDisabledEditButton${id}" class="defaultLabelEditIcon machine-learning-popup-generated-labels-edit-icon reverse-icon" style="display: none" src="edit-red.svg" alt="edit">
      <div id="MLLabelText${id}" class="machine-learning-popup-generated-labels-input" spellcheck="false" onkeydown="MLLabelTextKeyDown(event)" onpaste="MLLabelTextPaste(event)">${labelText}</div>
    </div>
  `;
}

function generateTableRows() {
  let index = 0;
  Object.keys(uniqueLabelPair).forEach((key) => {
    const newNameRow = generatedLabelsTableElement.insertRow(-1);
    const cell = newNameRow.insertCell(0);
    cell.innerHTML = createLabelElementMarkup(uniqueLabelPair[key].pendingName, index);
    index += 1;
  });
}

function calculateContainerDivHeight() {
  const numberOfRows = Object.keys(uniqueLabelPair).length;
  const baseHeight = numberOfRows > 1 ? 104 : 114;
  const numberOfVisibleRows = numberOfRows > 5 ? 5 : numberOfRows;
  const newNameHeight = baseHeight + numberOfVisibleRows * 10;
  return `${newNameHeight}px`;
}

function displayElements() {
  buttonsGroupElement.style.display = '';
  generatedLabelsOuterContainerElement.style.display = '';
  generatedLabelsOuterContainerElement.style.height = calculateContainerDivHeight();
}

function getUniqueLabelPair() {
  return uniqueLabelPair;
}

let generatedObjectsObj = null;

function createObjectNamesEditingObject(generatedObjects) {
  const beforeAfterLabelNames = {};
  Object.keys(generatedObjects).forEach((key) => {
    const predictions = generatedObjects[key];
    for (let i = 0; i < predictions.length; i += 1) {
      if (!Object.prototype.hasOwnProperty.call(beforeAfterLabelNames, predictions[i].class)) {
        beforeAfterLabelNames[predictions[i].class] = { pendingName: predictions[i].class };
      }
    }
  });
  return beforeAfterLabelNames;
}

function populateGeneratedLabelsTable(generatedObjects) {
  generatedObjectsObj = generatedObjects;
  uniqueLabelPair = createObjectNamesEditingObject(generatedObjects);
  generateTableRows(uniqueLabelPair);
}

function setLocalVariables() {
  overflowScrollWidth = getScrollWidth();
}

function changePopUpDescription() {
  descriptionElement.innerHTML = 'The following names were automatically assigned to the generated objects, you can edit them below:';
}

function assignChangeGeneratedLabelsViewLocalVariables() {
  descriptionElement = document.getElementById('machine-learning-popup-description');
  generatedLabelsParentElement = document.getElementById('machine-learning-popup-generated-labels');
  generatedLabelsTableElement = document.getElementById('machine-learning-popup-generated-labels-table');
  buttonsGroupElement = document.getElementById('machine-learning-popup-generated-labels-buttons');
  generatedLabelsOuterContainerElement = document.getElementById('machine-learning-popup-generated-labels-outer-container');
}

function updateGeneratedLabelsParentElementWidthOnStartup() {
  activeTextRow = generatedLabelsTableElement.childNodes[1].childNodes[1].childNodes[0];
  updateGeneratedLabelsElementWidth();
  activeTextRow = null;
}

function displayChangeGeneratedLabelsView(generatedObjects) {
  setLocalVariables();
  changePopUpDescription();
  populateGeneratedLabelsTable(generatedObjects);
  displayElements(generatedObjects);
  updateGeneratedLabelsParentElementWidthOnStartup();
  setChangingMLGeneratedLabelNamesState(true);
}

function getGeneratedMachineLearningData() {
  return generatedObjectsObj;
}

export {
  updateGeneratedLabelsElementWidth, postProcessSpacesInTextElement,
  assignChangeGeneratedLabelsViewLocalVariables, stopEditingMLGeneratedLabelName,
  displayChangeGeneratedLabelsView, displayHighlightedDefaultEditLabelButton,
  stopEditingActiveTextElement, displayRedEditButtonIfActiveTextEmpty, MLLabelTextPaste,
  displayGreyedDefaultEditLabelButton, editMachineLearningLabel,
  getUniqueLabelPair, getGeneratedMachineLearningData,
};
