import scrollIntoViewIfNeeded from '../utils/tableUtils.js';

let labelListElement = null;
let currentlyHighlightedElement = null;
let highlightedElementOriginalColor = null;
let labelListOverflowParentElement = null;

function setLabelListElementForHighlights(labelListElementRef, labelsListOverflowParentElementRef) {
  labelListElement = labelListElementRef;
  labelListOverflowParentElement = labelsListOverflowParentElementRef;
}

function removeHighlightOfListLabel() {
  if (currentlyHighlightedElement !== null) {
    currentlyHighlightedElement.style.backgroundColor = highlightedElementOriginalColor;
  }
  currentlyHighlightedElement = null;
}

function highlightLabelInTheList(id) {
  removeHighlightOfListLabel();
  [currentlyHighlightedElement] = labelListElement.getElementsByClassName(`label${id}`);
  highlightedElementOriginalColor = currentlyHighlightedElement.style.backgroundColor;
  const highlightColor = `${highlightedElementOriginalColor.substring(0, highlightedElementOriginalColor.length - 5)} 0.6)`;
  currentlyHighlightedElement.style.backgroundColor = highlightColor;
  scrollIntoViewIfNeeded(currentlyHighlightedElement, labelListOverflowParentElement);
}

function changeLabelColor(color) {
  highlightedElementOriginalColor = color;
  currentlyHighlightedElement.style.backgroundColor = color;
}

function getCurrentlyHighlightedElement() {
  return currentlyHighlightedElement;
}

export {
  setLabelListElementForHighlights, removeHighlightOfListLabel,
  highlightLabelInTheList, changeLabelColor, getCurrentlyHighlightedElement,
};
