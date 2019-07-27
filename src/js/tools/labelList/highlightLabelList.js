let labelListElement = null;
let currentlyHighlightedElement = null;
let preventHighlighting = false;

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
  if (!preventHighlighting) {
    removeHighlightOfListLabel();
    [currentlyHighlightedElement] = labelListElement.getElementsByClassName(`label${id}`);
    currentlyHighlightedElement.style.backgroundColor = 'red';
  }
}

function preventHighlightingOnEditClick() {
  removeHighlightOfListLabel();
  preventHighlighting = true;
}

function allowHighlighting() {
  preventHighlighting = false;
}

export {
  setLabelListElementForHighlights, highlightLabelInTheList,
  removeHighlightOfListLabel, preventHighlightingOnEditClick,
  allowHighlighting,
};
