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
  currentlyHighlightedElement.style.backgroundColor = 'grey';
}

export { setLabelListElementForHighlights, highlightLabelInTheList, removeHighlightOfListLabel };

// let labelListElement = null;
// let currentlyHighlightedElement = null;
// let canHighlightLabel = true;
//
// function setLabelListElementForHighlights(labelListElementRef) {
//   labelListElement = labelListElementRef;
// }
//
// function removeHighlightOfListLabel() {
//   if (currentlyHighlightedElement !== null) {
//     currentlyHighlightedElement.style.backgroundColor = null;
//   } else {
//     currentlyHighlightedElement = null;
//   }
// }
//
// function highlightLabelInTheList(id) {
//   if (canHighlightLabel) {
//     removeHighlightOfListLabel();
//     [currentlyHighlightedElement] = labelListElement.getElementsByClassName(`label${id}`);
//     currentlyHighlightedElement.style.backgroundColor = '#f5f5f2';
//   }
// }
//
// function canHighlightLabelOnClick(state) {
//   canHighlightLabel = state;
// }
//
// export {
//   setLabelListElementForHighlights, highlightLabelInTheList,
//   removeHighlightOfListLabel, canHighlightLabelOnClick,
// };
