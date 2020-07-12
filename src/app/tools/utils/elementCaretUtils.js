// test this in different browsers
function getDefaultFont(element) {
  const defaultSyle = window.getComputedStyle(element, null);
  const size = defaultSyle.getPropertyValue('font-size');
  const fontFamily = defaultSyle.getPropertyValue('font-family');
  return `${size} ${fontFamily}`;
}

function emptyContentEditableFirefoxBugFix(div) {
  if (div.innerHTML === '<br>') div.innerHTML = '';
}

function isVerticalScrollPresent(element) {
  return element.scrollHeight > element.clientHeight;
}

function setCarretPosition(index, contentEditableElement) {
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
}

function setCaretPositionOnDiv(index, contentEditableElement, space, scrollHorintallyFunc) {
  try {
    setCarretPosition(index, contentEditableElement);
    if (!space) { scrollHorintallyFunc(contentEditableElement.innerHTML.substring(0, index)); }
  } catch (err) {
    setCarretPosition(0, contentEditableElement);
    if (!space) { scrollHorintallyFunc(''); }
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

export {
  emptyContentEditableFirefoxBugFix, getCaretPositionOnDiv,
  setCaretPositionOnDiv, isVerticalScrollPresent, getDefaultFont,
};
