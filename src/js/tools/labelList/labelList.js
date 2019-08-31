import { changeObjectLabelText, changeLabelVisibilityById } from '../../canvas/objects/label/label';
import {
  highlightShapeFill, defaultShapeFill, changeShapeColorById,
  getShapeById, changeShapeVisibilityById, getShapeVisibilityById,
} from '../../canvas/objects/allShapes/allShapes';
import { removePolygonPoints } from '../../canvas/objects/polygon/alterPolygon/alterPolygon';
import {
  setEditingLabelId, setNewShapeSelectedViaLabelListState,
  getDefaultState, getAddingPolygonPointsState,
} from '../toolkit/buttonEvents/facadeWorkersUtils/stateManager';
import {
  polygonMouseDownEvents, polygonMouseUpEvents, getLastSelectedShapeId, removeEditedPolygonId,
  programaticallySelectBoundingBox, programaticallyDeselectBoundingBox, setShapeToInvisible,
} from '../../canvas/mouseInteractions/mouseEvents/eventWorkers/editPolygonEventsWorker';
import {
  setLabelListElementForHighlights, changeLabelColor,
  removeHighlightOfListLabel, highlightLabelInTheList,
} from './labelListHighlightUtils';
import { resetCanvasToDefaultAfterAddPoints } from '../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasAfterAddPoints';
import {
  addToLabelOptions, sendLabelOptionToFront, getLabelOptions, getLabelColor,
} from './labelOptions';
import {
  dimActiveIcon, dimDefaultIcon, switchToActiveIcon, switchToDefaultIcon,
  highlightActiveIcon, highlightDefaultIcon, switchToHighlightedActiveIcon,
  switchToHighlightedDefaultIcon, switchToHighlightedDefaultVisibilityIcon,
} from './iconHighlightUtils';
import { resetPopUpLabelOptions } from '../labellerPopUp/style';

let isEditing = false;
let isVisibilitySelected = false;
let isVisibilityRestored = false;
let activeDropdownElements = null;
let activeLabelTextElement = null;
let activeLabelId = null;
let deselectedEditing = false;
let labelHasBeenDeselected = false;
let activeShape = null;
let activeLabelElementId = null;
let activeEditLabelButton = null;
let labelListElement = null;
let currentTableElementScrollPosition = 0;
let isLabelChanged = false;
let popuplabelOptionsElement = null;
let lastSelectedLabelOption = null;
let originalLabelText = null;
let availableListOptions = [];
let labelListELementHorizontalScrollPresent = false;

// refactor label popup label options element manipulation code

// consider narrowing down the dropdown to make it more appropriate
// should be able to select labels in add/remove point modes

// get default font style in browser and compute dimensions accordingly
// make sure to consider label name validations
// escape should close the popup - more on hotkeys

function findLabelListElement() {
  labelListElement = document.getElementById('label-list');
}

function findPopupElement() {
  popuplabelOptionsElement = document.getElementById('popup-label-options');
}

function initialiseLabelListFunctionality() {
  findLabelListElement();
  findPopupElement();
  setLabelListElementForHighlights(labelListElement);
}

function createNewDropdown() {
  const labelDropdownOptions = getLabelOptions();
  let dropdown = '<tbody>';
  for (let i = 0; i < labelDropdownOptions.length; i += 1) {
    const dropdownElement = `<tr><td><div id="labelOption${i}" onMouseEnter="mouseEnterLabelDropdownOption(this, '${labelDropdownOptions[i].color.label}')" onMouseLeave="mouseLeaveLabelDropdownOption(this)" class="labelDropdownOption">${labelDropdownOptions[i].text}</div></td></tr>\n`;
    dropdown += dropdownElement;
  }
  dropdown += '</tbody>';
  return dropdown;
}

function repopulateDropdown() {
  const dropdown = createNewDropdown();
  const dropdownParentElements = document.getElementsByClassName('dropdown-content');
  for (let i = 0; i < dropdownParentElements.length; i += 1) {
    dropdownParentElements[i].innerHTML = dropdown;
  }
}

function createLabelElementMarkup(labelText, id, backgroundColor) {
  return `
  <div id="labelId${id}" onMouseEnter="mouseEnterLabel(${id})" onMouseLeave="mouseLeaveLabel(${id})" onClick="labelBtnClick(${id})" class="label${id} labelListItem" style="background-color: ${backgroundColor}">
    <div id="default" onMouseEnter="mouseEnterVisibilityBtn(id, this)" onMouseLeave="mouseLeaveVisibilityBtn(id, this)" onClick="visibilityBtnClick(${id}, this)" style="float:left; user-select: none; padding-right: 5px; width: 12px;">
      <img class="defaultVisibilityIcon" src="visibility-button.svg" alt="visibility">
      <img class="highlightedVisibilityIcon" src="visibility-button-highlighted.svg" style="display: none" alt="visibility">
      <img class="defaultVisibilityIcon" src="invisible-button.svg" style="display: none" alt="visibility">
      <img class="highlightedVisibilityIcon" src="invisible-button-highlighted.svg" style="display: none" alt="visibility">
    </div>
    <div id="editButton${id}" onMouseEnter="mouseEnterLabelEditBtn(this)" onMouseLeave="mouseLeaveLabelEditBtn(this)" onClick="labelEditBtnClick(${id}, this)" style="float:left; user-select: none; padding-right: 5px; width: 11px">
      <img class="defaultLabelEditIcon" id="editButton${id}" src="edit.svg" style="padding-left: 1px" alt="edit">
      <img class="highlightedLabelEditIcon" id="editButton${id}" src="edit-highlighted.svg" style="display: none" alt="edit">
      <img class="defaultLabelEditIcon" id="editButton${id}" src="done-tick.svg" style="display: none" alt="edit">
      <img class="highlightedLabelEditTickIcon" id="editButton${id}" src="done-tick-highlighted.svg" style="display: none" alt="edit">
  </div>
    <div id="labelText${id}" onkeydown="labelTextKeyDown(event)" ondblclick="labelDblClicked(${id})" class="labelText" contentEditable="false" onInput="changeLabelText(innerHTML, this, event)" style="user-select: none; padding-right: 29px; border: 1px solid transparent; display: grid;">${labelText}</div>
      <table class="dropdown-content labelDropdown${id}">
      </table>
    </div>
  </div>
  `;
}

function initialiseParentElement() {
  return document.createElement('div');
}

function addNewLabelToListFromPopUp(labelText, id, labelColor) {
  const labelElement = initialiseParentElement();
  labelElement.id = id;
  labelElement.innerHTML = createLabelElementMarkup(labelText, id, labelColor);
  const newRow = labelListElement.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.appendChild(labelElement);
  labelListElement.scrollLeft = 0;
  repopulateDropdown();
  cell.scrollIntoView();
}

function removeLabelFromListOnShapeDelete(id) {
  if (id != null) {
    let index = 0;
    const tableList = labelListElement.childNodes[1].childNodes;
    while (index !== tableList.length) {
      if (parseInt(tableList[index].childNodes[0].childNodes[0].id, 10) === id) {
        tableList[index].remove();
        break;
      }
      index += 1;
    }
  }
}

function scrollHorizontallyToAppropriateWidth(text) {
  let myCanvas = document.createElement('canvas');
  const context = myCanvas.getContext('2d');
  context.font = '16pt Times New Roman';
  const metrics = context.measureText(text);
  if (metrics.width > 160) {
    labelListElement.scrollLeft = metrics.width - 150;
  } else {
    labelListElement.scrollLeft = 0;
  }
  myCanvas = null;
}

function setEndOfContentEditable(contentEditableElement) {
  let range;
  if (document.createRange) {
    // Firefox, Chrome, Opera, Safari, IE 9+
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

function addLabelToDropdown(labelText, dropdownLabelsElem, id, color) {
  const labelElement = initialiseParentElement();
  labelElement.innerHTML = `<div class="labelDropdownOption" id="labelOption${id}" onMouseEnter="mouseEnterLabelDropdownOption(this, '${color}')" onMouseLeave="mouseLeaveLabelDropdownOption(this)">${labelText}</div>`;
  const newRow = dropdownLabelsElem.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.appendChild(labelElement);
}

function highlightSelectedLabelOptionOnEditInit() {
  window.labelTextKeyDown({ key: 'stub' });
}

function positionDropDownCorrectlyOnScreen() {
  if (activeLabelTextElement) {
    const dropdownElementPosition = activeLabelTextElement.getBoundingClientRect();
    const dropDownOffset = dropdownElementPosition.height + dropdownElementPosition.top;
    activeDropdownElements[0].style.top = `${dropDownOffset}px`;
  }
}

function deleteAndAddLastRowToRefreshDropdownDiv(dropdownLabelsElement) {
  const labelOptions = getLabelOptions();
  dropdownLabelsElement.deleteRow(labelOptions.length - 1);
  if (labelOptions.length === 6) {
    popuplabelOptionsElement.style.height = '120px';
  } else if (labelOptions.length === 7) {
    addLabelToDropdown('temp horizontal', dropdownLabelsElement);
  }
  window.setTimeout(() => {
    const lastLabel = labelOptions[labelOptions.length - 1];
    addLabelToDropdown(lastLabel.text, dropdownLabelsElement,
      labelOptions.length - 1, lastLabel.color.label);
    if (labelOptions.length === 7) {
      dropdownLabelsElement.deleteRow(6);
    }
    highlightSelectedLabelOptionOnEditInit();
  }, 0);
}

function prepareLabelDivForEditing(id) {
  activeLabelTextElement = document.getElementById(`labelText${id}`);
  activeLabelTextElement.contentEditable = true;
  activeLabelTextElement.style.backgroundColor = 'white';
  activeLabelTextElement.style.borderColor = '#a39f9e';
  activeLabelTextElement.style.paddingLeft = '2px';
  activeEditLabelButton = document.getElementById(`editButton${id}`);
  activeEditLabelButton.style.paddingRight = '3px';
  activeLabelId = id;
  setEndOfContentEditable(activeLabelTextElement);
  activeDropdownElements = document.getElementsByClassName(`labelDropdown${id}`);
  activeDropdownElements[0].classList.toggle('show');
  activeDropdownElements[0].scrollTop = 0;
  activeDropdownElements[0].scrollLeft = 0;
}

function initLabelEditing(id) {
  prepareLabelDivForEditing(id);
  deleteAndAddLastRowToRefreshDropdownDiv(activeDropdownElements[0]);
  positionDropDownCorrectlyOnScreen();
  // change this to match wider div
  // const labelDropdownOptions = getLabelOptions();
  // if (labelDropdownOptions.length > 5) {
  //   activeDropdownElements[0].style = 'width: 150px';
  // }
  originalLabelText = activeLabelTextElement.innerHTML;
  availableListOptions = getLabelOptions();
  currentTableElementScrollPosition = labelListElement.scrollTop;
  labelListELementHorizontalScrollPresent = labelListElement.scrollWidth
    > labelListElement.clientWidth;
  isEditing = true;
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

function selectShapeBeforeLabelEdit(id) {
  if (id !== getLastSelectedShapeId()) {
    setNewShapeSelectedViaLabelListState(true);
  } else {
    setNewShapeSelectedViaLabelListState(false);
  }
  setEditingLabelId(id);
  if (getAddingPolygonPointsState()) {
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

function trimLabelText() {
  const trimmedText = activeLabelTextElement.innerHTML.trim();
  activeLabelTextElement.innerHTML = trimmedText;
  changeObjectLabelText(activeLabelId, trimmedText);
}

function removeLabelDropDownContent() {
  if (activeDropdownElements[0].classList.contains('show')) {
    activeDropdownElements[0].classList.remove('show');
  }
  isEditing = false;
}

function resetLabelElement() {
  trimLabelText();
  removeLabelDropDownContent();
  activeLabelTextElement.contentEditable = false;
  activeLabelTextElement.style.backgroundColor = null;
  activeLabelTextElement.style.borderColor = 'transparent';
  activeLabelTextElement.style.paddingLeft = '';
  activeEditLabelButton.style.paddingRight = '5px';
  labelListElement.scrollLeft = 0;
  setEditingLabelId(null);
  isLabelChanged = false;
}

function moveSelectedLabelToFrontOfLabelOptions(id, text) {
  if (id !== 0) {
    sendLabelOptionToFront(id);
    const newLabelColor = getLabelColor(text);
    changeShapeColorById(activeLabelId, newLabelColor);
    changeLabelColor(newLabelColor.label);
    repopulateDropdown();
    resetPopUpLabelOptions();
  }
}

function addNewLabelToLabelOptions(text) {
  if (isLabelChanged) {
    if (text === '') {
      activeLabelTextElement.innerHTML = originalLabelText;
    } else {
      addToLabelOptions(text);
      const newLabelColor = getLabelColor(text);
      changeShapeColorById(activeLabelId, newLabelColor);
      changeLabelColor(newLabelColor.label);
      repopulateDropdown();
      resetPopUpLabelOptions();
    }
  }
}

function stopEditing() {
  activeShape = false;
  switchToDefaultIcon(activeEditLabelButton);
  resetLabelElement();
}

function highlightDropdownLabelOption(labelOptionsIndex, divIndex) {
  const [currentlyAvailableDropdownElements] = activeDropdownElements[0].childNodes;
  const labelParenElement = currentlyAvailableDropdownElements.childNodes[divIndex];
  [lastSelectedLabelOption] = labelParenElement.childNodes[0].childNodes;
  const labelColor = availableListOptions[labelOptionsIndex].color.label;
  lastSelectedLabelOption.style.backgroundColor = labelColor;
  lastSelectedLabelOption.scrollIntoViewIfNeeded();
}

function wasHorizontalScrollCreated() {
  if (!labelListELementHorizontalScrollPresent
    && labelListElement.scrollWidth > labelListElement.clientWidth) {
    currentTableElementScrollPosition = labelListElement.scrollTop;
    labelListELementHorizontalScrollPresent = true;
    positionDropDownCorrectlyOnScreen();
    return true;
  }
  return false;
}

window.labelTextKeyDown = (event) => {
  if (event.key === 'Enter') {
    addNewLabelToLabelOptions(activeLabelTextElement.innerHTML);
    stopEditing();
  }
  window.setTimeout(() => {
    if (lastSelectedLabelOption) {
      lastSelectedLabelOption.style.backgroundColor = '';
    }
    let found = false;
    for (let i = 0; i < availableListOptions.length - 1; i += 1) {
      if (availableListOptions[i].text === activeLabelTextElement.innerHTML) {
        found = highlightDropdownLabelOption(i, i * 2);
        if (found) break;
      }
    }
    if (!found) {
      const lastLabelOptionIndex = availableListOptions.length - 1;
      if (availableListOptions[lastLabelOptionIndex].text === activeLabelTextElement.innerHTML) {
        highlightDropdownLabelOption(lastLabelOptionIndex, lastLabelOptionIndex * 2 + 1);
      }
    }
  }, 0);
};

window.labelBtnClick = (id) => {
  if (!getDefaultState()) {
    window.cancel();
  }
  highlightLabelInTheList(id);
  activeShape = getShapeById(id);
  if (!isVisibilitySelected) {
    if (getShapeVisibilityById(id)) {
      selectShape();
    } else if (activeShape.shapeName === 'bndBox') {
      programaticallyDeselectBoundingBox();
    } else {
      removePolygonPoints();
      removeEditedPolygonId();
      setShapeToInvisible();
    }
  } else {
    if (isVisibilityRestored) {
      selectShape();
    } else {
      removePolygonPoints();
      removeEditedPolygonId();
      setShapeToInvisible();
      if (activeShape.shapeName === 'bndBox') {
        programaticallyDeselectBoundingBox();
      }
    }
    isVisibilitySelected = false;
  }
};

window.onmousedown = (event) => {
  if (isEditing) {
    if (event.target.matches('.labelDropdownOption')) {
      const newText = event.target.innerHTML;
      activeLabelTextElement.innerHTML = newText;
      changeObjectLabelText(activeLabelId, newText);
      removeLabelDropDownContent();
      stopEditing();
      moveSelectedLabelToFrontOfLabelOptions(event.target.id.substring(11, 12), newText);
    } else if (event.target.id === `labelText${activeLabelId}` || event.target.matches('.dropdown-content')) {
      // do nothing
    } else if (event.target.id === `editButton${activeLabelId}`) {
      if (!labelHasBeenDeselected) {
        deselectedEditing = true;
        switchToHighlightedDefaultIcon(activeEditLabelButton);
        addNewLabelToLabelOptions(activeLabelTextElement.innerHTML);
        resetLabelElement();
      }
    } else if (event.target.nodeName === 'CANVAS' || event.target.id === 'tools-button' || event.target.id === activeLabelElementId) {
      addNewLabelToLabelOptions(activeLabelTextElement.innerHTML);
      stopEditing();
    } else {
      addNewLabelToLabelOptions(activeLabelTextElement.innerHTML);
      stopEditing();
      deselectShape();
    }
  }
};

window.onScrolling = () => {
  if (currentTableElementScrollPosition !== labelListElement.scrollTop) {
    if (!wasHorizontalScrollCreated()) {
      if (activeDropdownElements && activeDropdownElements[0].classList.contains('show')) {
        addNewLabelToLabelOptions(activeLabelTextElement.innerHTML);
        stopEditing();
      }
    }
  }
};

window.mouseEnterLabelDropdownOption = (element, color) => {
  element.style.backgroundColor = color;
};

window.mouseLeaveLabelDropdownOption = (element) => {
  if (element.id !== 'used') {
    element.style.backgroundColor = '';
  }
};

window.mouseEnterVisibilityBtn = (id, element) => {
  if (id === 'default') {
    highlightDefaultIcon(element);
  } else {
    highlightActiveIcon(element);
  }
};

window.mouseLeaveVisibilityBtn = (id, element) => {
  if (id === 'default') {
    dimDefaultIcon(element);
  } else {
    dimActiveIcon(element);
  }
};

window.visibilityBtnClick = (id, element) => {
  changeShapeVisibilityById(id);
  isVisibilityRestored = changeLabelVisibilityById(id);
  isVisibilitySelected = true;
  if (element.id === 'default') {
    element.id = 'highlighted';
    switchToHighlightedActiveIcon(element);
  } else {
    element.id = 'default';
    switchToHighlightedDefaultVisibilityIcon(element);
  }
};

window.mouseEnterLabelEditBtn = (element) => {
  if (!isEditing) {
    highlightDefaultIcon(element);
  } else if (activeEditLabelButton.id !== element.id) {
    highlightDefaultIcon(element);
  } else {
    highlightActiveIcon(element);
  }
};

window.mouseLeaveLabelEditBtn = (element) => {
  if (!isEditing) {
    dimDefaultIcon(element);
  } else if (activeEditLabelButton.id !== element.id) {
    dimDefaultIcon(element);
  } else {
    dimActiveIcon(element);
  }
};

window.labelEditBtnClick = (id, element) => {
  if (id !== activeLabelId) {
    selectShapeBeforeLabelEdit(id);
    switchToHighlightedActiveIcon(element);
  } else if (deselectedEditing) {
    deselectedEditing = false;
    labelHasBeenDeselected = true;
  } else if (!deselectedEditing) {
    selectShapeBeforeLabelEdit(id);
    switchToHighlightedActiveIcon(element);
  }
};

window.changeLabelText = (innerHTML, element, inputEvent) => {
  if (element.offsetHeight > 30) {
    preventPasteOrMoveTextFromCreatingNewLine(element, inputEvent);
  } else {
    changeObjectLabelText(activeLabelId, innerHTML);
  }
  isLabelChanged = true;
};

window.labelDblClicked = (id) => {
  initLabelEditing(id);
  const editElement = document.getElementById(`editButton${id}`);
  switchToActiveIcon(editElement);
};

window.mouseEnterLabel = (id) => {
  highlightShapeFill(id);
};

window.mouseLeaveLabel = (id) => {
  defaultShapeFill(id);
};

export {
  initialiseLabelListFunctionality, addNewLabelToListFromPopUp,
  removeLabelFromListOnShapeDelete, moveSelectedLabelToFrontOfLabelOptions,
};
