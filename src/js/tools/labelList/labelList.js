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
import { resetCanvasToDefaultAfterAddPoints } from '../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasAfterAddPoints';

let isLabelSelected = false;
let activeDropdownElements = null;
let activeLabelTextElement = null;
let activeLabelId = null;
let deselectedEditing = false;
let labelHasBeenDeselected = false;
let activeShape = null;
let activeLabelElementId = null;
let activeEditLabelButton = null;
let tableElement = null;

// polygon movable objects bug where after selecting to draw new polygon, clicking movable objects
// then default, the polygons remain movable
// background of the label in the list should be removed when clicking edit button

// New shape popup
// when assigning a label for a shape, make sure there are no return breaks or spaces on the edges

function findLabelListElement() {
  tableElement = document.getElementById('tableList');
}

function initialiseLabelListFunctionality() {
  findLabelListElement();
  setLabelListElementForHighlights(tableElement);
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
    <div id="visibilityButton${id}" onMouseEnter="mouseEnterOnVisibility(this)" onMouseLeave="mouseLeaveOnVisibility(this)" style="float:left; user-select: none; padding-right: 5px">
      <img src="visibility-button.svg" style="width:10px" alt="visibility">
      <img src="visibility-button-highlighted.svg" style="width:10px; display: none" alt="visibility">
    </div>
    <div id="editButton${id}" onMouseEnter="mouseEnterOnLabelEdit(this)" onMouseLeave="mouseLeaveOnLabelEdit(this)" onClick="editLabelBtnClick(${id}, this)" style="float:left; user-select: none; padding-right: 5px">
      <img id="editButton${id}" src="edit.svg" style="width:9px" alt="edit">
      <img id="editButton${id}" src="edit-highlighted.svg" style="width:9px; display: none" alt="edit">
      <img id="editButton${id}" src="done-tick.svg" style="width:9px; display: none" alt="edit">
      <img id="editButton${id}" src="done-tick-highlighted.svg" style="width:9px; display: none" alt="edit">
  </div>
    <div id="labelText${id}" onkeydown="labelTextKeyDown(event)" ondblclick="labelDblClicked(${id})" class="labelText" contentEditable="false" onInput="changeObjectLabelText(innerHTML, this, event)" style="user-select: none; padding-right: 28px; border: 1px solid transparent; display: grid;">${labelText}</div>
    <div class="dropdown-content labelDropdown${id}" style="width: 100px; overflow-x: auto;">
      <a class="labelDropdownOption">Labelasdasgusgyasdaasdadugs1style="width:100px;"</a>
      <a class="labelDropdownOption">ggggggggggggggg</a>
      <a class="labelDropdownOption">wwwwwwwwww</a>
    </div>
  </div>
  `;
}

function highlightDefaultIcon(element) {
  element.childNodes[1].style.display = 'none';
  element.childNodes[3].style.display = '';
}

function dimDefaultIcon(element) {
  element.childNodes[1].style.display = '';
  element.childNodes[3].style.display = 'none';
}

function highlightActiveIcon(element) {
  element.childNodes[5].style.display = 'none';
  element.childNodes[7].style.display = '';
}

function dimActiveIcon(element) {
  element.childNodes[5].style.display = '';
  element.childNodes[7].style.display = 'none';
}

function switchToDefaultIcon() {
  activeEditLabelButton.childNodes[1].style.display = '';
  activeEditLabelButton.childNodes[5].style.display = 'none';
}

function switchToActiveIcon(element) {
  element.childNodes[1].style.display = 'none';
  element.childNodes[5].style.display = '';
}

function switchToHighlightedActiveIcon(element) {
  element.childNodes[3].style.display = 'none';
  element.childNodes[7].style.display = '';
}

function switchToHighlightedDefaultIcon() {
  activeEditLabelButton.childNodes[3].style.display = '';
  activeEditLabelButton.childNodes[7].style.display = 'none';
}

window.mouseEnterOnVisibility = (element) => {
  highlightDefaultIcon(element);
};

window.mouseLeaveOnVisibility = (element) => {
  dimDefaultIcon(element);
};

window.mouseEnterOnLabelEdit = (element) => {
  if (!isLabelSelected) {
    highlightDefaultIcon(element);
  } else if (activeEditLabelButton.id !== element.id) {
    highlightDefaultIcon(element);
  } else {
    highlightActiveIcon(element);
  }
};

window.mouseLeaveOnLabelEdit = (element) => {
  if (!isLabelSelected) {
    dimDefaultIcon(element);
  } else if (activeEditLabelButton.id !== element.id) {
    dimDefaultIcon(element);
  } else {
    dimActiveIcon(element);
  }
};

function preventPasteOrMoveTextFromCreatingNewLine(element, inputEvent) {
  let finalText = '';
  if (inputEvent.inputType === 'insertFromPaste') {
    const noReturnCharactersText = element.innerHTML.replace(/(\r\n|\n|\r)/gm, '');
    element.innerHTML = noReturnCharactersText;
    finalText = noReturnCharactersText;
  } else {
    const temp = element.innerHTML;
    element.innerHTML = '';
    element.innerHTML = temp;
    finalText = temp;
  }
  setEndOfContentEditable(activeLabelTextElement);
  changeObjectLabelText(activeLabelId, finalText);
}

window.changeObjectLabelText = (innerHTML, element, inputEvent) => {
  if (element.offsetHeight > 30) {
    preventPasteOrMoveTextFromCreatingNewLine(element, inputEvent);
  } else {
    changeObjectLabelText(activeLabelId, innerHTML);
  }
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

function scrollHorizontallyToAppropriateWidth(text) {
  let myCanvas = document.createElement('canvas');
  const context = myCanvas.getContext('2d');
  context.font = '16pt Times New Roman';
  const metrics = context.measureText(text);
  if (metrics.width > 160) {
    tableElement.scrollLeft = metrics.width - 150;
  } else {
    tableElement.scrollLeft = 0;
  }
  myCanvas = null;
}

function setEndOfContentEditable(contentEditableElement) {
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
  scrollHorizontallyToAppropriateWidth(contentEditableElement.innerHTML);
}

function initLabelEditing(id) {
  activeLabelTextElement = document.getElementById(`labelText${id}`);
  activeLabelTextElement.contentEditable = true;
  activeLabelTextElement.style.backgroundColor = 'white';
  activeLabelTextElement.style.borderColor = '#a39f9e';
  // give space for the texxt from the left border when editing
  activeLabelTextElement.style.paddingLeft = '2px';
  activeEditLabelButton = document.getElementById(`editButton${id}`);
  activeEditLabelButton.style.paddingRight = '3px';
  activeLabelId = id;
  setEndOfContentEditable(activeLabelTextElement);
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
    resetCanvasToDefaultAfterAddPoints(id);
  } else {
    window.cancel();
  }
  activeShape = getShapeById(id);
  selectShape(id);
  initLabelEditing(id);
  labelHasBeenDeselected = false;
  activeLabelElementId = `labelId${id}`;
}

function editLabel(id, element) {
  if (id !== activeLabelId) {
    initiateEditing(id);
    switchToHighlightedActiveIcon(element);
  } else if (deselectedEditing) {
    deselectedEditing = false;
    labelHasBeenDeselected = true;
  } else if (!deselectedEditing) {
    initiateEditing(id);
    switchToHighlightedActiveIcon(element);
  }
}

window.labelDblClicked = (id) => {
  initLabelEditing(id);
  const editElement = document.getElementById(`editButton${id}`);
  switchToActiveIcon(editElement);
};

window.editLabelBtnClick = (id, element) => {
  // remove visibility button when editing
  // const visibilityButton = document.getElementById(`visibilityButton${id}`);
  // visibilityButton.style.display = 'none';
  // const labelButton = document.getElementById(`editButton${id}`);
  // labelButton.style.marginLeft = '4px';
  // labelButton.style.marginRight = '2px'
  editLabel(id, element);
};

function trimLabelText() {
  const trimmedText = activeLabelTextElement.innerHTML.trim();
  activeLabelTextElement.innerHTML = trimmedText;
  changeObjectLabelText(activeLabelId, trimmedText);
}

function removeLabelDropDownContent() {
  if (activeDropdownElements[0].classList.contains('show')) {
    activeDropdownElements[0].classList.remove('show');
  }
  isLabelSelected = false;
}

function resetLabelElement() {
  trimLabelText();
  removeLabelDropDownContent();
  activeLabelTextElement.contentEditable = false;
  activeLabelTextElement.style.backgroundColor = null;
  activeLabelTextElement.style.borderColor = 'transparent';
  activeLabelTextElement.style.paddingLeft = '';
  activeEditLabelButton.style.paddingRight = '5px';
  setEditingLabelId(null);
}

function stopEditing() {
  activeShape = false;
  switchToDefaultIcon();
  resetLabelElement();
}

function refocusOnLabelListTextAfterDropdown() {
  window.setTimeout(() => {
    activeLabelTextElement.focus();
    setEndOfContentEditable(activeLabelTextElement);
  }, 0);
}

window.labelTextKeyDown = (event) => {
  if (event.key === 'Enter') {
    stopEditing();
  }
};

window.onmousedown = (event) => {
  // should be is editing
  if (isLabelSelected) {
    if (event.target.matches('.labelDropdownOption')) {
      const newText = event.target.text;
      activeLabelTextElement.innerHTML = newText;
      changeObjectLabelText(activeLabelId, newText);
      // fix here as after moving polygon, points stay
      removeLabelDropDownContent();
      stopEditing();
      scrollHorizontallyToAppropriateWidth(newText);
    } else if (event.target.id === `labelText${activeLabelId}`) {
      // do nothing
    } else if (event.target.id === `editButton${activeLabelId}`) {
      if (!labelHasBeenDeselected) {
        deselectedEditing = true;
        switchToHighlightedDefaultIcon();
        resetLabelElement();
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
//   setEndOfContentEditable(activeLabelTextElement);
// }, 0);

function initialiseParentElement() {
  return document.createElement('id');
}

function addLabelToList(labelText, id) {
  const labelElement = initialiseParentElement();
  labelElement.id = id;
  labelElement.innerHTML = createLabelElementMarkup(labelText, id);
  const newRow = tableElement.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.appendChild(labelElement);
  // scroll to left on new shape insert in order to see available funcitonality
  tableElement.scrollLeft = 0;
}

function removeLabelFromList(id) {
  let index = 0;
  const tableList = tableElement.childNodes[1].childNodes;
  while (index !== tableList.length) {
    if (parseInt(tableList[index].childNodes[0].childNodes[0].id, 10) === id) {
      tableList[index].remove();
      break;
    }
    index += 1;
  }
  // tableElement.deleteRow(0);
}

export { initialiseLabelListFunctionality, addLabelToList, removeLabelFromList };
