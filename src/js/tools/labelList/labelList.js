import { changeObjectLabelText } from '../../canvas/objects/label/label';
import { highlightShapeFill, defaultShapeFill, getShapeById } from '../../canvas/objects/allShapes/allShapes';
import {
  setEditingLabelId, setNewShapeSelectedViaLabelListState,
  getDefaultState, getAddingPolygonPointsState,
} from '../toolkit/buttonEvents/facadeWorkersUtils/stateManager';
import {
  polygonMouseDownEvents, polygonMouseUpEvents, getLastSelectedShapeId,
  programaticallySelectBoundingBox, programaticallyDeselectBoundingBox,
} from '../../canvas/mouseInteractions/mouseEvents/eventWorkers/editPolygonEventsWorker';
import {
  removeHighlightOfListLabel, setLabelListElementForHighlights, highlightLabelInTheList,
} from './highlightLabelList';
import { reset } from '../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasStateAfterAddPoints';


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
    <div id="editButton${id}" onClick="editLabelBtnClick(${id})" style="float:left; user-select: none; padding-right: 5px">
      <img id="editButton${id}" src="edit.svg" style="width:9px" alt="edit">
    </div>
    <div id="labelText${id}" ondblclick="labelDblClicked(${id})" class="labelText" contentEditable="false" onInput="changeObjectLabelText(innerHTML)" style="margin-left:12px; user-select: none; border: 1px solid transparent; overflow: hidden; text-overflow: clip; white-space: nowrap;">${labelText}</div>
    <div class="dropdown-content labelDropdown${id}">
      <a class="labelDropdownOption">Label 1</a>
      <a class="labelDropdownOption">Label 2</a>
      <a class="labelDropdownOption">Labe</a>
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
  activeLabelTextElement.contentEditable = true;
  activeLabelId = id;
  activeLabelTextElement.style.backgroundColor = 'white';
  activeLabelTextElement.style.border = '1px solid black';
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
  highlightLabelInTheList(id);
  activeShape = getShapeById(id);
  selectShape();
};

function initiateEditing(id) {
  if (id !== getLastSelectedShapeId()) {
    setNewShapeSelectedViaLabelListState(true);
  } else {
    setNewShapeSelectedViaLabelListState(false);
  }
  setEditingLabelId(id);
  if (getAddingPolygonPointsState()) {
    // check if selected a different polygon to what was added, create state?
    reset(id);
  } else {
    window.cancel();
  }
  activeShape = getShapeById(id);
  selectShape(id);
  initLabelEditing(id);
  labelHasBeenDeselected = false;
  activeLabelElementId = `labelId${id}`;
}

function editLabel(id) {
  if (id !== activeLabelId) {
    initiateEditing(id);
  } else if (deselectedEditing) {
    deselectedEditing = false;
    labelHasBeenDeselected = true;
  } else if (!deselectedEditing) {
    initiateEditing(id);
  }
}

window.labelDblClicked = (id) => {
  initLabelEditing(id);
};

window.editLabelBtnClick = (id) => {
  editLabel(id);
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
  removeLabelDropDownContent();
  activeLabelTextElement.contentEditable = false;
  activeLabelTextElement.style.backgroundColor = null;
  activeLabelTextElement.style.borderColor = 'transparent';
  setEditingLabelId(null);
}

function editButtonDeselected() {
  removeLabelDropDownContent();
  deselectedEditing = true;
  activeLabelTextElement.contentEditable = false;
  activeLabelTextElement.style.backgroundColor = null;
  activeLabelTextElement.style.borderColor = 'transparent';
  setEditingLabelId(null);
}

function refocusOnLabelListTextAfterDropdown() {
  window.setTimeout(() => {
    activeLabelTextElement.focus();
    setEndOfContenteditable(activeLabelTextElement);
  }, 0);
}

window.onmousedown = (event) => {
  // should be is editing
  if (isLabelSelected) {
    if (event.target.matches('.labelDropdownOption')) {
      const newText = event.target.text;
      activeLabelTextElement.innerHTML = newText;
      changeObjectLabelText(activeLabelId, newText);
      // fix here as after moving polygon, points stay
      removeLabelDropDownContent();
      refocusOnLabelListTextAfterDropdown();
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
