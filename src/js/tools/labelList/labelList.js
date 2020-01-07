import { changeLabelText, changeLabelVisibilityById } from '../../canvas/objects/label/label';
import {
  highlightShapeFill, defaultShapeFill, changeShapeColorById, changeShapeLabelText,
  getShapeById, changeShapeVisibilityById, getShapeVisibilityById,
} from '../../canvas/objects/allShapes/allShapes';
import { removePolygonPoints } from '../../canvas/objects/polygon/alterPolygon/alterPolygon';
import {
  setEditingLabelId, getRemovingPolygonPointsState, getAddingPolygonPointsState, getDefaultState,
  getSettingsPopUpOpenState, setSettingsPopUpOpenState, setNewShapeSelectedViaLabelListState,
  getChangingMLGeneratedLabelNamesState,
} from '../toolkit/buttonClickEvents/facadeWorkersUtils/stateManager';
import {
  polygonMouseDownEvents, polygonMouseUpEvents, getLastSelectedShapeId, removeEditedPolygonId,
  programaticallySelectBoundingBox, programaticallyDeselectBoundingBox, setShapeToInvisible,
} from '../../canvas/mouseInteractions/mouseEvents/eventWorkers/editPolygonEventsWorker';
import { pointMouseDownEvents, pointMouseUpEvents, setPolygonNotEditableOnClick } from '../../canvas/mouseInteractions/mouseEvents/eventWorkers/removePointsEventsWorker';
import { pointMouseDownEvents as addPointsMouseDownEvents, pointMouseUpEvents as addPointsMouseUpEvents, setPolygonNotEditableOnClick as addPointsPolygonNotEditable } from '../../canvas/mouseInteractions/mouseEvents/eventWorkers/addPointsEventsWorker';
import {
  setLabelListElementForHighlights, changeLabelColor,
  removeHighlightOfListLabel, highlightLabelInTheList,
} from './labelListHighlightUtils';
import {
  addToLabelOptions, sendLabelOptionToFront, getLabelOptions, getLabelColor,
} from './labelOptions';
import {
  dimActiveIcon, dimDefaultIcon, switchToActiveIcon, switchToDefaultIcon,
  highlightActiveIcon, highlightDefaultIcon, switchToHighlightedActiveIcon,
  switchToHighlightedDefaultIcon, switchToHighlightedDefaultVisibilityIcon,
} from './iconHighlightUtils';
import { resetPopUpLabelOptions } from '../labellerPopUp/style';
import { getRemovingPointsState } from '../../canvas/mouseInteractions/mouseEvents/eventWorkers/removePointsOnNewPolygonEventsWorker';
import { stopEditingMLGeneratedLabelName } from '../machineLearningPopUp/views/changeGeneratedLabelsView/style';

let isEditingLabel = false;
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
let labelsListOverflowParentElement = null;
let horizontalScrollPresentWhenEditAndScroll = false;
let mouseHoveredOnLabelEditButton = false;

// refactor label popup label options element manipulation code

// consider narrowing down the dropdown to make it more appropriate
// should be able to select labels in add/remove point modes

// get default font style in browser and compute dimensions accordingly
// make sure to consider label name validations
// escape should close the popup - more on hotkeys

function findLabelListElement() {
  labelListElement = document.getElementById('label-list');
  labelsListOverflowParentElement = document.getElementById('labels-list-overflow-parent');
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

function generateLabelVisibilityMarkup(shapeVisibile) {
  if (shapeVisibile === 'default') {
    return `
      <img class="defaultVisibilityIcon" src="visibility-button.svg" alt="visibility">
      <img class="highlightedVisibilityIcon" src="visibility-button-highlighted.svg" style="display: none" alt="visibility">
      <img class="defaultVisibilityIcon" src="invisible-button.svg" style="display: none" alt="visibility">
      <img class="highlightedVisibilityIcon" src="invisible-button-highlighted.svg" style="display: none" alt="visibility">
    `;
  }
  return `
    <img class="defaultVisibilityIcon" src="visibility-button.svg" style="display: none" alt="visibility">
    <img class="highlightedVisibilityIcon" src="visibility-button-highlighted.svg" style="display: none" alt="visibility">
    <img class="defaultVisibilityIcon" src="invisible-button.svg" alt="visibility">
    <img class="highlightedVisibilityIcon" src="invisible-button-highlighted.svg" style="display: none" alt="visibility">
  `;
}

// change to label list item click
function createLabelElementMarkup(labelText, id, backgroundColor, visibility) {
  return `
  <div id="labelId${id}" onMouseEnter="mouseEnterLabel(${id})" onMouseLeave="mouseLeaveLabel(${id})" onClick="labelBtnClick(${id})" class="label${id} labelListItem" style="background-color: ${backgroundColor}">
    <div id="${visibility}" onMouseEnter="mouseEnterVisibilityBtn(id, this)" onMouseLeave="mouseLeaveVisibilityBtn(id, this)" onClick="visibilityBtnClick(${id}, this)" style="float:left; user-select: none; padding-right: 5px; width: 12px;">
      ${generateLabelVisibilityMarkup(visibility)}
    </div>
    <div id="editButton${id}" onMouseEnter="mouseEnterLabelEditBtn(this)" onMouseLeave="mouseLeaveLabelEditBtn(this)" onClick="labelEditBtnClick(${id}, this)" style="float:left; user-select: none; padding-right: 5px; width: 11px">
      <img class="defaultLabelEditIcon" id="editButton${id}" src="edit.svg" style="padding-left: 1px" alt="edit">
      <img class="highlightedLabelEditIcon" id="editButton${id}" src="edit-highlighted.svg" style="display: none" alt="edit">
      <img class="defaultLabelEditIcon" id="editButton${id}" src="done-tick.svg" style="display: none" alt="edit">
      <img class="highlightedLabelEditTickIcon" id="editButton${id}" src="done-tick-highlighted.svg" style="display: none" alt="edit">
  </div>
    <div id="labelText${id}" spellcheck="false" onkeydown="labelTextKeyDown(event)" ondblclick="labelDblClicked(${id})" class="labelText" contentEditable="false" style="user-select: none; padding-right: 32px; border: 1px solid transparent; display: grid;">${labelText}</div>
      <table class="dropdown-content labelDropdown${id}">
      </table>
    </div>
  </div>
  `;
}

function initialiseParentElement() {
  return document.createElement('div');
}

// test this in different browsers
function getDefaultFont() {
  const defaultSyle = window.getComputedStyle(activeLabelTextElement, null);
  const size = defaultSyle.getPropertyValue('font-size');
  const fontFamily = defaultSyle.getPropertyValue('font-family');
  return `${size} ${fontFamily}`;
}

function scrollHorizontallyToAppropriateWidth(text) {
  let myCanvas = document.createElement('canvas');
  const context = myCanvas.getContext('2d');
  context.font = getDefaultFont();
  const metrics = context.measureText(text);
  if (metrics.width > 170) {
    labelsListOverflowParentElement.scrollLeft = metrics.width - 165;
  } else {
    labelsListOverflowParentElement.scrollLeft = 0;
  }
  myCanvas = null;
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

function isHorizontalScrollPresent() {
  return labelsListOverflowParentElement.scrollWidth > labelsListOverflowParentElement.clientWidth;
}

function preprocessPastedText(text) {
  const noReturnChars = text.replace(/(\r\n|\n|\r)/gm, '');
  const spacesToHythons = noReturnChars.replace(/\s/g, '-');
  return spacesToHythons;
}

function pasteHandlerOnDiv(event) {
  event.stopPropagation();
  event.preventDefault();
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData('Text');
  const caretOnPaste = getCaretPositionOnDiv(activeLabelTextElement, true);
  const caretPositionEnd = caretOnPaste.position;
  const caretPositionStart = caretPositionEnd - caretOnPaste.highlightRangeOnPaste;
  const preprocessedPastedData = preprocessPastedText(pastedData);
  activeLabelTextElement.innerHTML = activeLabelTextElement.innerHTML.slice(0, caretPositionStart)
   + preprocessedPastedData + activeLabelTextElement.innerHTML.slice(caretPositionEnd);
  setCaretPositionOnDiv(caretPositionStart + preprocessedPastedData.length, activeLabelTextElement);
}

function addNewLabelToListFromPopUp(labelText, id, labelColor) {
  const labelElement = initialiseParentElement();
  labelElement.id = id;
  labelElement.innerHTML = createLabelElementMarkup(labelText, id, labelColor, 'default');
  const newRow = labelListElement.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.appendChild(labelElement);
  labelListElement.scrollLeft = 0;
  labelElement.childNodes[1].addEventListener('paste', pasteHandlerOnDiv);
  repopulateDropdown();
  cell.scrollIntoView();
}

function addExistingLabelToList(labelText, id, labelColor, shapeVisible) {
  const labelElement = initialiseParentElement();
  labelElement.id = id;
  let visibility = null;
  if (shapeVisible === true) {
    visibility = 'default';
  } else {
    visibility = 'highlighted';
  }
  labelElement.innerHTML = createLabelElementMarkup(labelText, id, labelColor, visibility);
  const newRow = labelListElement.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.appendChild(labelElement);
  labelElement.childNodes[1].addEventListener('paste', pasteHandlerOnDiv);
  repopulateDropdown();
  cell.scrollIntoView();
}

function removeLabelFromListOnShapeDelete(id) {
  if (id != null) {
    let index = 0;
    const tableList = labelListElement.childNodes[0].childNodes;
    while (index !== tableList.length) {
      if (parseInt(tableList[index].childNodes[0].childNodes[0].id, 10) === id) {
        tableList[index].remove();
        break;
      }
      index += 1;
    }
  }
}

function updateAssociatedLabelObjectsText(text) {
  changeLabelText(activeLabelId, text);
  changeShapeLabelText(activeLabelId, text);
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
    if (activeDropdownElements && activeDropdownElements[0]) {
      activeDropdownElements[0].style.top = `${dropDownOffset}px`;
    }
  }
}

function deleteAndAddLastRowToRefreshDropdownDiv(dropdownLabelsElement) {
  const labelOptions = getLabelOptions();
  dropdownLabelsElement.deleteRow(labelOptions.length - 1);
  if (labelOptions.length === 6) {
    popuplabelOptionsElement.style.height = '114px';
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

function changeActiveDropdownElementStyling() {
  const labelListElementScrollLeftVSDropdownMarginLeft = Math.max(-4,
    31 - labelsListOverflowParentElement.scrollLeft);
  const labelListElementScrollLeftVSDropdownWidth = Math.min(206,
    171 + labelsListOverflowParentElement.scrollLeft);
  activeDropdownElements[0].style.marginLeft = `${labelListElementScrollLeftVSDropdownMarginLeft}px`;
  activeDropdownElements[0].style.width = `${labelListElementScrollLeftVSDropdownWidth}px`;
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
  setCaretPositionOnDiv(activeLabelTextElement.innerHTML.length, activeLabelTextElement);
  activeDropdownElements = document.getElementsByClassName(`labelDropdown${id}`);
  changeActiveDropdownElementStyling();
  activeDropdownElements[0].classList.toggle('show');
  activeDropdownElements[0].scrollTop = 0;
  activeDropdownElements[0].scrollLeft = 0;
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
  return scrollWidth * 2;
}

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
    activeLabelTextElement.scrollIntoView();
  }
}

function initLabelEditing(id) {
  prepareLabelDivForEditing(id);
  deleteAndAddLastRowToRefreshDropdownDiv(activeDropdownElements[0]);
  scrollIntoViewIfNeeded(activeLabelTextElement, labelsListOverflowParentElement);
  positionDropDownCorrectlyOnScreen();
  // change this to match wider div
  // const labelDropdownOptions = getLabelOptions();
  // if (labelDropdownOptions.length > 5) {
  //   activeDropdownElements[0].style = 'width: 150px';
  // }
  originalLabelText = activeLabelTextElement.innerHTML;

  // USE THESE TO SEE IF CONTENT VISIBLE, THEN SCROLL TO APPROPRIATE HEIGHT
  // POTENTIALLY CAN CHECK SCROLL HEIGHT AGAINST OVERFLOW ELEMENT HEIGHT WITH SCROLL WIDTH
  // AND THEN SCROLL FURTHER

  availableListOptions = getLabelOptions();
  currentTableElementScrollPosition = labelsListOverflowParentElement.scrollTop;
  horizontalScrollPresentWhenEditAndScroll = isHorizontalScrollPresent();
  isEditingLabel = true;
}

function selectShape() {
  const eventShape = {};
  eventShape.target = activeShape;
  if (getRemovingPolygonPointsState()) {
    pointMouseDownEvents(eventShape);
    pointMouseUpEvents(eventShape);
  } else if (getAddingPolygonPointsState()) {
    addPointsMouseDownEvents(eventShape);
    addPointsMouseUpEvents(eventShape);
  } else {
    polygonMouseDownEvents(eventShape);
    polygonMouseUpEvents(eventShape);
  }
  if (activeShape.shapeName === 'bndBox') {
    if (!getRemovingPolygonPointsState() && !getAddingPolygonPointsState()) {
      programaticallySelectBoundingBox(activeShape);
    }
  }
}

function deselectShape() {
  removeHighlightOfListLabel();
  if (getRemovingPolygonPointsState()) {
    pointMouseDownEvents({});
    pointMouseUpEvents({});
  } else if (getAddingPolygonPointsState()) {
    addPointsMouseDownEvents({});
    addPointsMouseUpEvents({});
  } else {
    polygonMouseDownEvents({});
    polygonMouseUpEvents({});
  }
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
  activeShape = getShapeById(id);
  selectShape(id);
  initLabelEditing(id);
  labelHasBeenDeselected = false;
  activeLabelElementId = `labelId${id}`;
}

function removeLabelDropDownContent() {
  if (activeDropdownElements[0].classList.contains('show')) {
    activeDropdownElements[0].classList.remove('show');
  }
  isEditingLabel = false;
}

function resetLabelElement() {
  removeLabelDropDownContent();
  activeLabelTextElement.contentEditable = false;
  activeLabelTextElement.style.backgroundColor = null;
  activeLabelTextElement.style.borderColor = 'transparent';
  activeLabelTextElement.style.paddingLeft = '';
  activeEditLabelButton.style.paddingRight = '5px';
  labelsListOverflowParentElement.scrollLeft = 0;
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

function wasLabelListHorizontalScrollManipulated() {
  if (!horizontalScrollPresentWhenEditAndScroll && isHorizontalScrollPresent()) {
    currentTableElementScrollPosition = labelsListOverflowParentElement.scrollTop;
    horizontalScrollPresentWhenEditAndScroll = true;
    positionDropDownCorrectlyOnScreen();
    return true;
  }
  if (horizontalScrollPresentWhenEditAndScroll && !isHorizontalScrollPresent()) {
    currentTableElementScrollPosition = labelsListOverflowParentElement.scrollTop;
    horizontalScrollPresentWhenEditAndScroll = false;
    positionDropDownCorrectlyOnScreen();
    return true;
  }
  return false;
}

function removeAllLabelListItems() {
  const newtbody = document.createElement('tbody');
  if (labelListElement.childNodes[0]) {
    labelListElement.replaceChild(newtbody, labelListElement.childNodes[0]);
  }
}

function highlightLabel(currentlySelectedShapeName, idArg) {
  const id = idArg !== undefined ? idArg : activeLabelId;
  if (getRemovingPolygonPointsState() || getAddingPolygonPointsState()) {
    if (currentlySelectedShapeName !== 'bndBox') {
      highlightLabelInTheList(id);
    }
  } else {
    highlightLabelInTheList(id);
  }
}

window.labelTextKeyDown = (event) => {
  if (event.key === 'Enter') {
    deselectedEditing = true;
    const currentlySelectedShapeName = activeShape.shapeName;
    activeShape = false;
    if (mouseHoveredOnLabelEditButton) {
      switchToHighlightedDefaultIcon(activeEditLabelButton);
    } else {
      switchToDefaultIcon(activeEditLabelButton);
    }
    addNewLabelToLabelOptions(activeLabelTextElement.innerHTML);
    resetLabelElement();
    highlightLabel(currentlySelectedShapeName);
  }
  window.setTimeout(() => {
    if (event.code === 'Space') {
      const currentCaretPosition = getCaretPositionOnDiv(activeLabelTextElement).position;
      activeLabelTextElement.innerHTML = activeLabelTextElement.innerHTML.replace(/\s/g, '-');
      setCaretPositionOnDiv(currentCaretPosition, activeLabelTextElement, true);
    }
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
    changeActiveDropdownElementStyling();
    updateAssociatedLabelObjectsText(activeLabelTextElement.innerHTML);
    isLabelChanged = true;
    if (event.key === 'Enter') {
      activeLabelId = null;
    }
  }, 0);
};

window.labelBtnClick = (id) => {
  if (!getDefaultState()) {
    // window.cancel();
  }
  activeShape = getShapeById(id);
  highlightLabel(activeShape.shapeName, id);
  if (!isVisibilitySelected) {
    if (getShapeVisibilityById(id)) {
      selectShape();
    } else if (activeShape.shapeName === 'bndBox') {
      programaticallyDeselectBoundingBox();
    } else {
      removePolygonPoints();
      if (!getRemovingPointsState() && !getAddingPolygonPointsState()) {
        removeEditedPolygonId();
        setShapeToInvisible();
      }
    }
  } else {
    if (isVisibilityRestored) {
      if (getRemovingPolygonPointsState()) {
        setPolygonNotEditableOnClick();
      } else if (getAddingPolygonPointsState()) {
        addPointsPolygonNotEditable();
      }
      selectShape();
    } else {
      removePolygonPoints();
      setShapeToInvisible();
      if (activeShape.shapeName === 'bndBox') {
        programaticallyDeselectBoundingBox();
      }
    }
    isVisibilitySelected = false;
  }
};

// needs to be exported to global key events
window.onmousedown = (event) => {
  if (isEditingLabel) {
    if (event.target.matches('.labelDropdownOption')) {
      const currentlySelectedShapeName = activeShape !== null ? activeShape.shapeName : null;
      const newText = event.target.innerHTML;
      activeLabelTextElement.innerHTML = newText;
      updateAssociatedLabelObjectsText(newText);
      removeLabelDropDownContent();
      stopEditing();
      moveSelectedLabelToFrontOfLabelOptions(event.target.id.substring(11, 12), newText);
      highlightLabel(currentlySelectedShapeName, activeLabelId);
    } else if (event.target.id === `labelText${activeLabelId}` || event.target.matches('.dropdown-content')) {
      // do nothing
    } else if (event.target.id === `editButton${activeLabelId}`) {
      if (!labelHasBeenDeselected) {
        deselectedEditing = true;
        switchToHighlightedDefaultIcon(activeEditLabelButton);
        addNewLabelToLabelOptions(activeLabelTextElement.innerHTML);
        resetLabelElement();
      }
    } else if (event.target.nodeName === 'CANVAS' || event.target.className === 'tools-button-icon'
        || event.target.className === 'tools-button-text' || event.target.id === activeLabelElementId) {
      addNewLabelToLabelOptions(activeLabelTextElement.innerHTML);
      stopEditing();
    } else {
      addNewLabelToLabelOptions(activeLabelTextElement.innerHTML);
      stopEditing();
      deselectShape();
    }
  } else if (getSettingsPopUpOpenState()) {
    if (event.target.classList[0] !== 'settings-popup-item') {
      const settingsPopupElement = document.getElementById('settings-popup');
      settingsPopupElement.style.display = 'none';
      setSettingsPopUpOpenState(false);
    }
    // needs to call a function in button events in the changeGeneratedLabelsView
  } else if (getChangingMLGeneratedLabelNamesState()) {
    stopEditingMLGeneratedLabelName(event.target);
  }
};

window.labelListScroll = () => {
  if (currentTableElementScrollPosition !== labelsListOverflowParentElement.scrollTop) {
    if (!wasLabelListHorizontalScrollManipulated()) {
      if (activeDropdownElements && activeDropdownElements[0] && activeDropdownElements[0].classList.contains('show')) {
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
    if (getRemovingPolygonPointsState()) {
      setPolygonNotEditableOnClick();
    } else if (getAddingPolygonPointsState()) {
      addPointsPolygonNotEditable();
    }
    switchToHighlightedActiveIcon(element);
  } else {
    element.id = 'default';
    switchToHighlightedDefaultVisibilityIcon(element);
  }
};

window.mouseEnterLabelEditBtn = (element) => {
  mouseHoveredOnLabelEditButton = true;
  if (!isEditingLabel) {
    highlightDefaultIcon(element);
  } else if (activeEditLabelButton.id !== element.id) {
    highlightDefaultIcon(element);
  } else {
    highlightActiveIcon(element);
  }
};

window.mouseLeaveLabelEditBtn = (element) => {
  mouseHoveredOnLabelEditButton = false;
  if (!isEditingLabel) {
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

window.labelDblClicked = (id) => {
  if (!isEditingLabel) {
    initLabelEditing(id);
    const editElement = document.getElementById(`editButton${id}`);
    switchToActiveIcon(editElement);
    labelHasBeenDeselected = false;
  }
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
  addExistingLabelToList, removeAllLabelListItems,
};
