let isUploadImagesButtonDisplayed = false;
let isNoImagesFoundErrorDisplayed = false;

function removeErrorMessage() {
  const errorMessagesElement = document.getElementById('machine-learning-popup-error-messages');
  const buttons = document.getElementById('machine-learning-popup-buttons');
  errorMessagesElement.innerHTML = '';
  buttons.style.marginTop = '12px';
}

function removeProgressMessage() {
  const progressMessagesElement = document.getElementById('machine-learning-popup-progress-messages');
  const buttons = document.getElementById('machine-learning-popup-buttons');
  progressMessagesElement.innerHTML = '';
  buttons.style.marginTop = '12px';
}

function displayErrorMessage(errorMessage) {
  removeProgressMessage();
  const errorMessagesElement = document.getElementById('machine-learning-popup-error-messages');
  const buttons = document.getElementById('machine-learning-popup-buttons');
  errorMessagesElement.innerHTML = errorMessage;
  buttons.style.marginTop = '5px';
}

function updateProgressMessage(progressMessage) {
  removeErrorMessage();
  const progressMessagesElement = document.getElementById('machine-learning-popup-progress-messages');
  const buttons = document.getElementById('machine-learning-popup-buttons');
  progressMessagesElement.innerHTML = progressMessage;
  buttons.style.marginTop = '5px';
}

function removeStartButton() {
  const submitButton = document.getElementById('machine-learning-popup-submit-button');
  submitButton.style.display = 'none';
}

function disableStartButton() {
  const submitButton = document.getElementById('machine-learning-popup-submit-button');
  setTimeout(() => {
    submitButton.classList.replace('popup-label-button', 'popup-label-button-disabled');
  });
}

function enableStartButton() {
  const submitButton = document.getElementById('machine-learning-popup-submit-button');
  submitButton.classList.replace('popup-label-button-disabled', 'popup-label-button');
}

function highlightCancelButton() {
  const cancelButton = document.getElementById('machine-learning-popup-cancel-button');
  cancelButton.style.backgroundColor = '#e2acac';
}

function displayUploadImagesButton() {
  const displayImagesButton = document.getElementById('uploadImagesButton');
  displayImagesButton.style.zIndex = 3;
  displayImagesButton.style.border = '2px solid rgb(218, 197, 73)';
  isUploadImagesButtonDisplayed = true;
}

function hideUploadImagesButton() {
  const displayImagesButton = document.getElementById('uploadImagesButton');
  displayImagesButton.style.zIndex = 1;
  displayImagesButton.style.border = '';
  isUploadImagesButtonDisplayed = false;
}

function closeMachineLearningPopUp() {
  if (isUploadImagesButtonDisplayed) {
    setTimeout(() => {
      hideUploadImagesButton();
    }, 2000);
  }
}

function displayNoImagesFoundError() {
  displayUploadImagesButton();
  disableStartButton();
  displayErrorMessage('Please upload an image before using Machine Learning');
  isNoImagesFoundErrorDisplayed = true;
}

function removeUploadedImageAfterNoneFoundError() {
  if (isNoImagesFoundErrorDisplayed) {
    hideUploadImagesButton();
    removeErrorMessage();
    enableStartButton();
    isNoImagesFoundErrorDisplayed = false;
  }
}

// change generated labels view file
function changeDescription() {
  const descriptionElement = document.getElementById('machine-learning-popup-description');
  descriptionElement.innerHTML = 'The following names were automatically assigned to the generated objects, you can edit them below:';
}

function switchToChangeGeneratedLabelsView() {
  changeDescription();
}

let editingActive = false;
let activeTextRow = null;
let activeTextElement = null;

function displayEditLabelButton(element) {
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

function hideEditLabelButton(element) {
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

function getDefaultFont() {
  const defaultSyle = window.getComputedStyle(activeTextElement, null);
  const size = defaultSyle.getPropertyValue('font-size');
  const fontFamily = defaultSyle.getPropertyValue('font-family');
  return `${size} ${fontFamily}`;
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

function isVerticalScrollPresent() {
  const parentEl = document.getElementById('machine-learning-popup-names-change');
  return parentEl.scrollHeight > parentEl.clientHeight;
}

function isHorizontalScrollPresent() {
  const parentEl = document.getElementById('machine-learning-popup-names-change');
  return parentEl.scrollWidth > parentEl.clientWidth;
}

function scrollHorizontallyToAppropriateWidth(text) {
  let myCanvas = document.createElement('canvas');
  const context = myCanvas.getContext('2d');
  context.font = getDefaultFont();
  const metrics = context.measureText(text);
  const parentEl = document.getElementById('machine-learning-popup-names-change');
  let originalParentMaxWidth = 345;
  if (isVerticalScrollPresent()) originalParentMaxWidth -= getScrollWidth();
  if (metrics.width > originalParentMaxWidth) {
    parentEl.scrollLeft = metrics.width - 320;
  } else {
    parentEl.scrollLeft = 0;
  }
  myCanvas = null;
}

// need validation for empty
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

// contains fix for paste with spaces - check it
function pasteHandlerOnDiv(event) {
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

function setTextElementToEditable() {
  activeTextElement.contentEditable = true;
}

function setActiveRowToDefault() {
  activeTextElement.contentEditable = false;
  activeTextRow.style.backgroundColor = '';
  activeTextRow.childNodes[1].style.display = '';
  activeTextRow.childNodes[5].style.display = 'none';
  activeTextRow.style.cursor = 'pointer';
  editingActive = false;
}

let activeTextElementInitialText = '';

// label list popup does not have empty string validation but label list does

function setTextElementToNotEditable(element) {
  const parentEl = document.getElementById('machine-learning-popup-names-change');
  if (activeTextElement && activeTextElement !== element
    && activeTextRow !== element && element !== parentEl && element.id !== activeTextElement.id) {
    if (activeTextElement.innerHTML === '') {
      activeTextElement.innerHTML = activeTextElementInitialText;
    }
    setActiveRowToDefault();
  }
}

// change the ids to use regex for number comparisons

function isElementHeightFullyVisibleInParent(childElement, parentElement) {
  const childBoundingRect = childElement.getBoundingClientRect();
  const parentBoundingRect = parentElement.getBoundingClientRect();
  if (childBoundingRect.top < parentBoundingRect.top) {
    return false;
  }
  if ((isHorizontalScrollPresent()
    && childBoundingRect.bottom > parentBoundingRect.bottom - getScrollWidth())
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

function editMachineLearningLabel(element) {
  if (element !== activeTextRow) {
    activeTextRow = element;
    activeTextElement = element.childNodes[7];
    activeTextElementInitialText = element.childNodes[7].innerHTML;
    element.style.backgroundColor = '#f7f7f7';
    setTextElementToEditable();
    element.childNodes[5].style.display = '';
    element.childNodes[3].style.display = 'none';
    element.childNodes[7].addEventListener('paste', pasteHandlerOnDiv);
    const parentEl = document.getElementById('machine-learning-popup-names-change');
    scrollIntoViewIfNeeded(activeTextElement, parentEl);
    // change pointer style to text edit
    element.style.cursor = 'default';
    setCaretPositionOnDiv(element.childNodes[7].innerHTML.length, element.childNodes[7]);
    editingActive = true;
  }
}

let maxWidthAppended = false;

window.MLLabelTextKeyDown = (event) => {
  if (event.key === 'Enter') {
    setActiveRowToDefault();
  }
  window.setTimeout(() => {
    if (event.code === 'Space') {
      const currentCaretPosition = getCaretPositionOnDiv(activeTextElement).position;
      activeTextElement.innerHTML = activeTextElement.innerHTML.replace(/\s/g, '-');
      setCaretPositionOnDiv(currentCaretPosition, activeTextElement, true);
    }
    const parentEl = document.getElementById('machine-learning-popup-names-change');
    parentEl.style.width = `${activeTextRow.clientWidth + getScrollWidth()}px`;
    if (!maxWidthAppended && parseInt(parentEl.style.width, 10) > 360) {
      parentEl.style.maxWidth = '360px';
      parentEl.style.overflowX = 'auto';
      maxWidthAppended = true;
    } else if (maxWidthAppended && parseInt(parentEl.style.width, 10) < 360) {
      parentEl.style.maxWidth = '';
      parentEl.style.overflowX = 'hidden';
      maxWidthAppended = false;
    }
  }, 1);
};

export {
  displayErrorMessage, updateProgressMessage, highlightCancelButton, editMachineLearningLabel,
  removeStartButton, disableStartButton, enableStartButton, displayUploadImagesButton,
  removeUploadedImageAfterNoneFoundError, closeMachineLearningPopUp, displayNoImagesFoundError,
  switchToChangeGeneratedLabelsView, displayEditLabelButton, hideEditLabelButton,
  setTextElementToNotEditable,
};
