let labelListElement = null;
let currentlyHighlightedElement = null;

function setLabelListElementForHighlights(labelListElementRef) {
  labelListElement = labelListElementRef;
}

function removeHighlightOfListLabel() {
  if (currentlyHighlightedElement !== null) {
    currentlyHighlightedElement.style.backgroundColor = null;
  } else {
    currentlyHighlightedElement = null;
  }
}

function highlightLabelInTheList(id) {
  removeHighlightOfListLabel();
  [currentlyHighlightedElement] = labelListElement.getElementsByClassName(`label${id}`);
  currentlyHighlightedElement.style.backgroundColor = 'red';
}

export { setLabelListElementForHighlights, highlightLabelInTheList, removeHighlightOfListLabel };
