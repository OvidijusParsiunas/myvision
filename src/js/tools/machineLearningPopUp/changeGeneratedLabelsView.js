let generatedLabelsElement = null;
let descriptionElement = null;
let editingActive = false;
let activeTextRow = null;
let activeTextElement = null;
let activeTextElementInitialText = '';
let displayingRedEditButton = false;
let maxWidthStyleAppended = false;

function changePopUpDescription() {
  descriptionElement.innerHTML = 'The following names were automatically assigned to the generated objects, you can edit them below:';
}

function identifyViewElements() {
  descriptionElement = document.getElementById('machine-learning-popup-description');
  generatedLabelsElement = document.getElementById('machine-learning-popup-generated-labels');
}

function switchToChangeGeneratedLabelsView() {
  identifyViewElements();
  changePopUpDescription();
}

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
  return generatedLabelsElement.scrollHeight > generatedLabelsElement.clientHeight;
}

function isHorizontalScrollPresent() {
  return generatedLabelsElement.scrollWidth > generatedLabelsElement.clientWidth;
}

function scrollHorizontallyToAppropriateWidth(text) {
  let myCanvas = document.createElement('canvas');
  const context = myCanvas.getContext('2d');
  context.font = getDefaultFont();
  const metrics = context.measureText(text);
  let originalParentMaxWidth = 345;
  if (isVerticalScrollPresent()) originalParentMaxWidth -= getScrollWidth();
  if (metrics.width > originalParentMaxWidth) {
    generatedLabelsElement.scrollLeft = metrics.width - 320;
  } else {
    generatedLabelsElement.scrollLeft = 0;
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

function setEditingStateToFalse() {
  setTimeout(() => {
    editingActive = false;
    activeTextRow = null;
  }, 1);
}

function displayInitialTextIfEmpty() {
  if (activeTextElement.innerHTML === '') {
    activeTextElement.innerHTML = activeTextElementInitialText;
    window.setTimeout(() => {
      generatedLabelsElement.style.width = `${activeTextRow.clientWidth + getScrollWidth()}px`;
      if (!maxWidthStyleAppended && parseInt(generatedLabelsElement.style.width, 10) > 360) {
        generatedLabelsElement.style.maxWidth = '360px';
        generatedLabelsElement.style.overflowX = 'auto';
        maxWidthStyleAppended = true;
      } else if (maxWidthStyleAppended && parseInt(generatedLabelsElement.style.width, 10) < 360) {
        generatedLabelsElement.style.maxWidth = '';
        generatedLabelsElement.style.overflowX = 'hidden';
        maxWidthStyleAppended = false;
      }
    }, 1);
  }
}

function setActiveRowToDefault() {
  displayInitialTextIfEmpty();
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

// label list popup does not have empty string validation but label list does

function isElementTheCurrentlyActiveTextElement(element) {
  return activeTextElement && activeTextElement !== element;
}

function isElementTheCurrentlyActiveTextRow(element) {
  return activeTextRow && activeTextRow !== element;
}

function isElementTheGeneratedLabelsElement(element) {
  return element !== generatedLabelsElement;
}

function setTextElementToNotEditable(element) {
  if (isElementTheCurrentlyActiveTextElement(element)
    && isElementTheCurrentlyActiveTextRow(element)
    && isElementTheGeneratedLabelsElement(element)
    && element.id !== activeTextElement.id) {
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
    activeTextElement = element.childNodes[9];
    activeTextElementInitialText = element.childNodes[9].innerHTML;
    element.style.backgroundColor = '#f7f7f7';
    setTextElementToEditable();
    element.childNodes[5].style.display = '';
    element.childNodes[1].style.display = 'none';
    element.childNodes[3].style.display = 'none';
    element.childNodes[9].addEventListener('paste', pasteHandlerOnDiv);
    scrollIntoViewIfNeeded(activeTextElement, generatedLabelsElement);
    element.style.cursor = 'auto';
    setCaretPositionOnDiv(element.childNodes[9].innerHTML.length, element.childNodes[9]);
    editingActive = true;
  }
}

function displayRedEditButtonIfTextEmpty(text) {
  if (text === '') {
    activeTextRow.childNodes[5].style.display = 'none';
    activeTextRow.childNodes[7].style.display = '';
    displayingRedEditButton = true;
  }
}

window.MLLabelTextKeyDown = (event) => {
  if (event.key === 'Enter') {
    setActiveRowToDefault();
  } else {
    window.setTimeout(() => {
      if (event.code === 'Space') {
        const currentCaretPosition = getCaretPositionOnDiv(activeTextElement).position;
        activeTextElement.innerHTML = activeTextElement.innerHTML.replace(/\s/g, '-');
        setCaretPositionOnDiv(currentCaretPosition, activeTextElement, true);
      }
      generatedLabelsElement.style.width = `${activeTextRow.clientWidth + getScrollWidth()}px`;
      if (!maxWidthStyleAppended && parseInt(generatedLabelsElement.style.width, 10) > 360) {
        generatedLabelsElement.style.maxWidth = '360px';
        generatedLabelsElement.style.overflowX = 'auto';
        maxWidthStyleAppended = true;
      } else if (maxWidthStyleAppended && parseInt(generatedLabelsElement.style.width, 10) < 360) {
        generatedLabelsElement.style.maxWidth = '';
        generatedLabelsElement.style.overflowX = 'hidden';
        maxWidthStyleAppended = false;
      }
      displayRedEditButtonIfTextEmpty(activeTextElement.innerHTML);
    }, 1);
  }
};

export {
  switchToChangeGeneratedLabelsView, displayHighlightedDefaultEditLabelButton,
  displayGreyedDefaultEditLabelButton, editMachineLearningLabel, setTextElementToNotEditable,
};
