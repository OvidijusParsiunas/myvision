import { changeObjectLabelText } from '../../canvas/objects/label/label';
import { highlightShapeFill, defaultShapeFill, getShapeById } from '../../canvas/objects/allShapes/allShapes';
import { setEditingLabelId, setNewShapeSelectedViaLabelListState, getDefaultState } from '../toolkit/buttonEvents/facadeWorkersUtils/stateManager';
import {
  polygonMouseDownEvents, polygonMouseUpEvents, getLastSelectedShapeId,
  programaticallySelectBoundingBox, programaticallyDeselectBoundingBox,
} from '../../canvas/mouseInteractions/mouseEvents/eventWorkers/editPolygonEventsWorker';
import {
  removeHighlightOfListLabel, setLabelListElementForHighlights, highlightLabelInTheList,
} from './highlightLabelList';

let selectedLabelId = null;
let labelListElement = null;
let isLabelSelected = false;
let activeDropdownElements = null;
let activeLabelTextElement = null;
let activeLabelId = null;
let deselectedEditing = false;
let labelHasBeenDeselected = false;
let activeShape = null;
let activeLabelElementId = null;

// insert logic to edit actual label in real-time

function findLabelListElement() {
  labelListElement = document.getElementById('labelList');
}

function initialiseLabelListFunctionality() {
  findLabelListElement();
  setLabelListElementForHighlights(labelListElement);
}

// function initialiseNewElement() {
//   return document.createElement('button');
// }
//
// function addLabelToList(labelName) {
//   const labelElement = initialiseNewElement();
//   labelElement.innerHTML = labelName;
//   labelListElement.appendChild(labelElement);
// }

// .labelListObj:hover {
//   background-color: blue;
// }

function createLabelElementMarkup(labelText, id) {
  return `
  <div id="labelId${id}" onMouseEnter="highlightShapeFill(${id})" onMouseLeave="defaultShapeFill(${id})" onClick="labelBtnClick(${id})" class="labelListObj label${id}">
    <button id="editButton${id}" class="MetroBtn dropbtn" onClick="editLabelBtnClick(id);">Edit</button>
    <div id="labelText${id}" class="labelText" contentEditable="false" onInput="changeObjectLabelText(innerHTML)">${labelText}</div>
      <div class="dropdown-content labelDropdown${id}">
        <a onClick="randomFunc()" class="labelDropdownOption">Label 1</a>
        <a class="labelDropdownOption">Label 2</a>
        <a class="labelDropdownOption">Label 3</a>
      </div>
  </div>
  `;
}

window.changeObjectLabelText = (innerHTML) => {
  changeObjectLabelText(activeLabelId, innerHTML);
};

window.highlightShapeFill = (id) => {
  highlightShapeFill(id);
};

window.defaultShapeFill = (id) => {
  defaultShapeFill(id);
};

// cannot do delete shape on label edit unless we switch the currently selected
// shape to the edited one - for all modes
// when starting to type, remove dropdown

// use this approach only if you want to vary the colours per label,
// otherwise use the style sheet method

// window.onEnter = (element) => {
//   element.style.backgroundColor = 'blue';
// };
//
// window.onLeave = (element) => {
//   element.style.backgroundColor = null;
// };
//
// <a onmouseover="onEnter(this)" onmouseleave="onLeave(this)"
// class="labelDropdownOption">Label 1</a>

function setEndOfContenteditable(contentEditableElement) {
  let range;
  if (document.createRange) { // Firefox, Chrome, Opera, Safari, IE 9+
    range = document.createRange();
    range.selectNodeContents(contentEditableElement);
    // false means collapse to end rather than the start
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

function initLabelEditing(id) {
  activeLabelTextElement = document.getElementById(`labelText${id}`);
  activeLabelTextElement.style.backgroundColor = 'white';
  activeLabelId = id;
  activeLabelTextElement.contentEditable = true;
  // element.focus();
  setEndOfContenteditable(activeLabelTextElement);
  activeDropdownElements = document.getElementsByClassName(`labelDropdown${id}`);
  activeDropdownElements[0].classList.toggle('show');
  isLabelSelected = true;
}

function selectShape() {
  const eventShape = {};
  eventShape.target = activeShape;
  polygonMouseDownEvents(eventShape);
  polygonMouseUpEvents(eventShape);
  if (activeShape.shapeName === 'bndBox') {
    programaticallySelectBoundingBox(activeShape);
  }
}

function deselectShape() {
  removeHighlightOfListLabel();
  polygonMouseDownEvents({});
  polygonMouseUpEvents({});
  if (activeShape.shapeName === 'bndBox') {
    programaticallyDeselectBoundingBox();
  }
}

window.labelBtnClick = (id) => {
  if (!getDefaultState()) {
    window.cancel();
  }
  if (id !== selectedLabelId) {
    removeHighlightOfListLabel();
    highlightLabelInTheList(id);
    selectedLabelId = id;
    activeShape = getShapeById(id);
    selectShape();
  }
};

function initiateEditing(id) {
  if (id !== getLastSelectedShapeId()) {
    setNewShapeSelectedViaLabelListState(true);
  } else {
    setNewShapeSelectedViaLabelListState(false);
  }
  setEditingLabelId(id);
  window.cancel();
  activeShape = getShapeById(id);
  selectShape(id);
  initLabelEditing(id);
  labelHasBeenDeselected = false;
  activeLabelElementId = `labelId${id}`;
}

function parseLabelIdFromFromButtonId(id) {
  const getSubstring = id.substring(10, id.length);
  const parsedId = parseInt(getSubstring, 10);
  return parsedId;
}

window.editLabelBtnClick = (buttonId) => {
  const labelId = parseLabelIdFromFromButtonId(buttonId);
  if (labelId !== activeLabelId) {
    initiateEditing(labelId);
  } else if (deselectedEditing) {
    deselectedEditing = false;
    labelHasBeenDeselected = true;
  } else if (!deselectedEditing) {
    initiateEditing(labelId);
  }
};

function removeLabelDropDownContent() {
  if (activeDropdownElements[0].classList.contains('show')) {
    activeDropdownElements[0].classList.remove('show');
  }
  isLabelSelected = false;
}

function stopEditing() {
  activeShape = false;
  deselectedEditing = false;
  selectedLabelId = null;
  removeLabelDropDownContent();
  activeLabelTextElement.contentEditable = false;
  activeLabelTextElement.style.backgroundColor = null;
  setEditingLabelId(null);
}

function editButtonDeselected() {
  deselectedEditing = true;
  removeLabelDropDownContent();
  activeLabelTextElement.contentEditable = false;
  activeLabelTextElement.style.backgroundColor = null;
  setEditingLabelId(null);
  deselectShape();
}

window.onmousedown = (event) => {
  if (isLabelSelected) {
    if (event.target.matches('.labelDropdownOption')) {
      const newText = event.target.text;
      activeLabelTextElement.innerHTML = newText;
      changeObjectLabelText(activeLabelId, newText);
      stopEditing();
      deselectShape();
    } else if (event.target.id === `labelText${activeLabelId}`) {
      // do nothing
    } else if (event.target.id === `editButton${activeLabelId}`) {
      if (!labelHasBeenDeselected) {
        editButtonDeselected();
      }
    } else if (event.target.nodeName === 'CANVAS' || event.target.id === 'toolsButton' || event.target.id === activeLabelElementId) {
      stopEditing();
    } else {
      stopEditing();
      deselectShape();
    }
  }
};

// decide if this is necessary
//    window.setTimeout(function ()
// {
//   activeLabelTextElement.focus();
//   setEndOfContenteditable(activeLabelTextElement);
// }, 0);

function initialiseParentElement() {
  return document.createElement('id');
}

function addLabelToList(labelText, id) {
  const labelElement = initialiseParentElement();
  labelElement.id = id;
  labelElement.innerHTML = createLabelElementMarkup(labelText, id);
  labelListElement.appendChild(labelElement);
}

function removeLabelFromList(id) {
  let index = 0;
  while (index !== labelListElement.childNodes.length - 1) {
    if (parseInt(labelListElement.childNodes[index + 1].id, 10) === id) {
      labelListElement.childNodes[index + 1].remove();
      break;
    }
    index += 1;
  }
}

export { initialiseLabelListFunctionality, addLabelToList, removeLabelFromList };
