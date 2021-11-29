import { changeLabelText, changeLabelVisibilityById, changeVisibilityButtonActiveFlagById } from '../../canvas/objects/label/label.js';
import {
  getShapeById, changeShapeVisibilityById, getShapeVisibilityById,
  highlightShapeFill, defaultShapeFill, changeShapeColorById, changeShapeLabelText,
} from '../../canvas/objects/allShapes/allShapes.js';
import { removePolygonPoints, isAddingPointsToPolygon } from '../../canvas/objects/polygon/alterPolygon/alterPolygon.js';
import {
  setNewShapeSelectedViaLabelListState, getAddingPolygonPointsState,
  getRemovingPolygonPointsState, setEditingLabelId, getLabelsVisibilityState,
  getPolygonDrawingInProgressState, getShapeMovingState, getBoundingBoxScalingState,
} from '../state.js';
import { setRemoveLabelsButtonToDefault, setRemoveLabelsButtonToDisabled } from '../toolkit/styling/state.js';
import {
  polygonMouseDownEvents, polygonMouseUpEvents, getLastSelectedShapeId, removeEditedPolygonId,
  programaticallySelectBoundingBox, programaticallyDeselectBoundingBox, setShapeToInvisible,
} from '../../canvas/mouseInteractions/mouseEvents/eventWorkers/defaultEventsWorker.js';
import { pointMouseDownEvents, pointMouseUpEvents, setPolygonNotEditableOnClick } from '../../canvas/mouseInteractions/mouseEvents/eventWorkers/removePointsEventsWorker.js';
import { pointMouseDownEvents as addPointsMouseDownEvents, pointMouseUpEvents as addPointsMouseUpEvents, setPolygonNotEditableOnClick as addPointsPolygonNotEditable } from '../../canvas/mouseInteractions/mouseEvents/eventWorkers/addPointsEventsWorker.js';
import {
  setLabelListElementForHighlights, getCurrentlyHighlightedElement,
  removeHighlightOfListLabel, highlightLabelInTheList, changeLabelColor,
} from './labelListHighlightUtils.js';
import {
  addToLabelOptions, sendLabelOptionToFront, getLabelOptions, getLabelColor,
} from './labelOptions.js';
import {
  dimActiveIcon, dimDefaultIcon, switchToActiveIcon, switchToDefaultIcon,
  highlightActiveIcon, highlightDefaultIcon, switchToHighlightedActiveIcon,
  switchToHighlightedDefaultIcon, switchToHighlightedDefaultVisibilityIcon,
} from './iconHighlightUtils.js';
import IS_FIREFOX from '../utils/browserType.js';
import { resetLabellerModalOptions } from '../labellerModal/style.js';
import { updateNumberOfUncheckedMLImages } from '../imageList/imageListML.js';
import { getScrollbarWidth } from '../globalStyling/style.js';
import scrollIntoViewIfNeeded from '../utils/tableUtils.js';
import {
  isVerticalScrollPresent, emptyContentEditableFirefoxBugFix,
  setCaretPositionOnDiv, getCaretPositionOnDiv, getDefaultFont,
} from '../utils/elementCaretUtils.js';
import { preprocessPastedText, preprocessLabelText } from '../utils/textProcessingUtils.js';
import { getScreenSizeDelta } from '../globalStyling/screenSizeDelta.js';
import { getKeyDownEventTimeout } from '../globalStyling/timeouts.js';
import { setDoNotDisplayButtonAfterTimeoutStateToFalse } from '../globalStyling/buttons/popovers.js';

let isEditingLabel = false;
let keyDownEventTimeOut = 0;
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
let popuplabelOptionsElement = null;
let lastSelectedLabelOption = null;
let originalLabelText = null;
let availableListOptions = [];
let dropdownElementsWidthDefault = 0;
let dropdownElementsWidthFull = 0;
let labelListOverflowParentElement = null;
let horizontalScrollPresentWhenEditAndScroll = false;
let mouseHoveredOnLabelEditButton = false;
let currentlyActiveLabelOptionIndex = 0;
let chromiumFakeDropdownRightBorderElement = null;
let chromiumFakeDrodownBottomBorderElement = null;
let chromiumFakeDropdownBorderElementTopDelta = 0;
let newFakeDropdownBottomBorderDeltaGenerated = false;
let chromiumFakeDrodownBottomBorderTopDimension = null;
let originalActiveDropdownHeight = 0;
const NEW_ITEM_ANIMATION_DURATION_MILLISECONDS = 300;
const LABEL_CONTAINER_ELEMENT_ID_PREFIX = 'label-container-';

function setDropdownElementWidthVariables() {
  if (IS_FIREFOX) {
    dropdownElementsWidthDefault = 171;
    dropdownElementsWidthFull = 206;
  } else {
    dropdownElementsWidthDefault = 170;
    dropdownElementsWidthFull = 205;
  }
}

function findLabelListElement() {
  labelListElement = document.getElementById('label-list');
  labelListOverflowParentElement = document.getElementById('label-list-overflow-parent');
}

function findPopupElement() {
  popuplabelOptionsElement = document.getElementById('labeller-modal-options');
}

function initialiseLabelList() {
  findLabelListElement();
  findPopupElement();
  setDropdownElementWidthVariables();
  setLabelListElementForHighlights(labelListElement, labelListOverflowParentElement);
  keyDownEventTimeOut = getKeyDownEventTimeout();
}

function createNewDropdown() {
  const labelDropdownOptions = getLabelOptions();
  let dropdown = '<tbody>';
  for (let i = 0; i < labelDropdownOptions.length; i += 1) {
    const dropdownElement = `<tr><td><div id="labelOption${i}" onMouseEnter="mouseEnterLabelDropdownOption(this, '${labelDropdownOptions[i].color.label}')" onMouseLeave="mouseLeaveLabelDropdownOption(this, true)" class="labelDropdownOption">${labelDropdownOptions[i].text}</div></td></tr>\n`;
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
      <img class="defaultVisibilityIcon" src="assets/svg/visibility-button.svg" alt="visibility">
      <img class="highlightedVisibilityIcon" src="assets/svg/visibility-button-highlighted.svg" style="display: none" alt="visibility">
      <img class="defaultVisibilityIcon" src="assets/svg/invisible-button.svg" style="display: none" alt="visibility">
      <img class="highlightedVisibilityIcon" src="assets/svg/invisible-button-highlighted.svg" style="display: none" alt="visibility">
    `;
  }
  return `
    <img class="defaultVisibilityIcon" src="assets/svg/visibility-button.svg" style="display: none" alt="visibility">
    <img class="highlightedVisibilityIcon" src="assets/svg/visibility-button-highlighted.svg" style="display: none" alt="visibility">
    <img class="defaultVisibilityIcon" src="assets/svg/invisible-button.svg" alt="visibility">
    <img class="highlightedVisibilityIcon" src="assets/svg/invisible-button-highlighted.svg" style="display: none" alt="visibility">
  `;
}

// change to label list item click
function createLabelElementMarkup(labelText, id, backgroundColor, visibility) {
  return `
  <div id="labelId${id}" onMouseEnter="mouseEnterLabel(${id})" onMouseLeave="mouseLeaveLabel(${id})" onClick="labelBtnClick(${id})" class="label${id} labelListItem" style="background-color: ${backgroundColor}; transition: ${NEW_ITEM_ANIMATION_DURATION_MILLISECONDS / 1000}s; transform: translateX(-100%);">
    <div id="${visibility}" onMouseEnter="mouseEnterVisibilityBtn(id, this)" onMouseLeave="mouseLeaveVisibilityBtn(id, this)" onClick="visibilityBtnClick(${id}, this)" style="float:left; user-select: none; padding-right: 5px; width: 12px; cursor: pointer; padding-top: 1px">
      ${generateLabelVisibilityMarkup(visibility)}
    </div>
    <div id="editButton${id}" onMouseEnter="mouseEnterLabelEditBtn(this)" onMouseLeave="mouseLeaveLabelEditBtn(this)" onClick="labelEditBtnClick(${id}, this)" style="float:left; user-select: none; padding-right: 5px; width: 11px; cursor: pointer; padding-top: ${getScreenSizeDelta() > 1.000001 ? 0.5 : 0}px">
      <img class="defaultLabelEditIcon" id="editButton${id}" src="assets/svg/edit.svg" style="padding-left: 1px" alt="edit">
      <img class="highlightedLabelEditIcon" id="editButton${id}" src="assets/svg/edit-highlighted.svg" style="display: none" alt="edit">
      <img class="defaultLabelEditIcon" id="editButton${id}" src="assets/svg/done-tick.svg" style="display: none" alt="edit">
      <img class="highlightedLabelEditTickIcon" id="editButton${id}" src="assets/svg/done-tick-highlighted.svg" style="display: none" alt="edit">
    </div>
    <div id="labelText${id}" spellcheck="false" onkeydown="labelTextKeyDown(event)" ondblclick="labelDblClicked(${id})" class="labelText" contentEditable="false" style="user-select: none; padding-right: 32px; border: 1px solid transparent; display: flow-root; padding-top: ${getScreenSizeDelta() > 1 ? 2 : 0}px;">${labelText}</div>
      <table class="dropdown-content labelDropdown${id}">
      </table>
      <div id="chromium-fake-dropdown-border-fix${id}">
        <div class="chromium-fake-dropdown-border-fix chromium-fake-dropdown-border-fix-width chromium-right-border-fix" style="display: none"></div>
        <div class="chromium-fake-dropdown-border-fix chromium-bottom-border-fix" style="display: none"></div>
      </div>
    </div>
  </div>
  `;
}

function initialiseParentElement() {
  return document.createElement('div');
}

function scrollHorizontallyToAppropriateWidth(text) {
  let myCanvas = document.createElement('canvas');
  const context = myCanvas.getContext('2d');
  context.font = getDefaultFont(activeLabelTextElement);
  const metrics = context.measureText(text);
  if (isVerticalScrollPresent(labelListOverflowParentElement)
      && metrics.width > 170 - getScrollbarWidth()) {
    labelListOverflowParentElement.scrollLeft = metrics.width - 165 + getScrollbarWidth() / 2;
  } else if (!isVerticalScrollPresent(labelListOverflowParentElement) && metrics.width > 170) {
    labelListOverflowParentElement.scrollLeft = metrics.width - 165;
  } else {
    labelListOverflowParentElement.scrollLeft = 0;
  }
  myCanvas = null;
}

function isHorizontalScrollPresent() {
  return labelListOverflowParentElement.scrollWidth > labelListOverflowParentElement.clientWidth;
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
  setCaretPositionOnDiv(caretPositionStart + preprocessedPastedData.length,
    activeLabelTextElement, false, scrollHorizontallyToAppropriateWidth);
}

function unsetAnimationProperties(labelInnerElement) {
  // remove animation properties to prevent dropdown aligment issues and further animations
  labelInnerElement.style.transform = '';
  labelInnerElement.style.transition = '';
}

function triggerSlideAnimation(labelId) {
  const labelInnerElement = document.getElementById(`labelId${labelId}`);
  setTimeout(() => {
    // begin animation once the element has been added
    labelInnerElement.style.transform = 'translateX(0%)';
  });
  setTimeout(() => {
    unsetAnimationProperties(labelInnerElement);
  }, NEW_ITEM_ANIMATION_DURATION_MILLISECONDS);
}

// the reason for using this is because firefox label list options overlap during bulk animation
function triggerAnimationChromeOnly(labelId) {
  if (IS_FIREFOX) {
    const labelInnerElement = document.getElementById(`labelId${labelId}`);
    unsetAnimationProperties(labelInnerElement);
  } else {
    triggerSlideAnimation(labelId);
  }
}

function addNewLabelToListFromPopup(labelText, id, labelColor) {
  const labelElement = initialiseParentElement();
  labelElement.id = `${LABEL_CONTAINER_ELEMENT_ID_PREFIX}${id}`;
  const newLabel = true;
  labelElement.innerHTML = createLabelElementMarkup(labelText, id, labelColor, 'default', newLabel);
  const newRow = labelListElement.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.appendChild(labelElement);
  labelListElement.scrollLeft = 0;
  labelElement.childNodes[1].addEventListener('paste', pasteHandlerOnDiv);
  repopulateDropdown();
  triggerSlideAnimation(id);
  cell.scrollIntoView();
}

function addExistingLabelToList(labelText, id, labelColor, shapeVisible) {
  const labelElement = initialiseParentElement();
  labelElement.id = `${LABEL_CONTAINER_ELEMENT_ID_PREFIX}${id}`;
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
  triggerAnimationChromeOnly(id);
  cell.scrollIntoView();
}

function removeLabelFromListOnShapeDelete(id) {
  if (id != null) {
    let index = 0;
    const parentElementId = `${LABEL_CONTAINER_ELEMENT_ID_PREFIX}${id}`;
    const tableList = labelListElement.childNodes[0].childNodes;
    while (index !== tableList.length) {
      if (tableList[index].childNodes[0].childNodes[0].id === parentElementId) {
        tableList[index].remove();
        break;
      }
      index += 1;
    }
    activeShape = null;
  }
}

function updateAssociatedLabelObjectsText(text) {
  changeLabelText(activeLabelId, text);
  changeShapeLabelText(activeLabelId, text);
}

function addLabelToDropdown(labelText, dropdownLabelsElem, id, color) {
  const labelElement = initialiseParentElement();
  labelElement.innerHTML = `<div class="labelDropdownOption" id="labelOption${id}" onMouseEnter="mouseEnterLabelDropdownOption(this, '${color}')" onMouseLeave="mouseLeaveLabelDropdownOption(this, true)">${labelText}</div>`;
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
    popuplabelOptionsElement.style.height = '126px';
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

function isDropdownVerticalScrollPresent() {
  return activeDropdownElements[0].scrollHeight > activeDropdownElements[0].clientHeight;
}

function isDropdownHorizontalScrollPresent() {
  return activeDropdownElements[0].scrollWidth > activeDropdownElements[0].clientWidth;
}

function addFakeRightBorder(activeDropdownElementPosition) {
  chromiumFakeDropdownRightBorderElement.style.top = `${activeDropdownElementPosition.top}px`;
  chromiumFakeDropdownRightBorderElement.style.height = `${activeDropdownElementPosition.height}px`;
  chromiumFakeDropdownRightBorderElement.style.display = '';
}

function removeFakeBottomBorderOnExistingDropdown() {
  chromiumFakeDrodownBottomBorderElement.style.display = 'none';
  activeDropdownElements[0].style.borderBottom = '';
  // the following do not need to be refreshed on removeChromiumFakeBorderFix() because
  // once the delta has been generated, it is used the same for all the dropdowns that
  // have the horizontal dropdown
  chromiumFakeDropdownBorderElementTopDelta = 0;
  newFakeDropdownBottomBorderDeltaGenerated = false;
}

function addFakeBottomBorder(activeDropdownElementPosition) {
  if (activeDropdownElements[0].style.borderBottom === 'none') {
  // the reason why we have a delta here is because activeDropdownElements remembers the height
  // before the bottom border is removed, hence when getBoundingClientRect is called
  // the next time, the height presented is smaller
    if (!newFakeDropdownBottomBorderDeltaGenerated) {
      chromiumFakeDropdownBorderElementTopDelta = originalActiveDropdownHeight
        - activeDropdownElementPosition.height;
      if (isDropdownVerticalScrollPresent() && chromiumFakeDropdownBorderElementTopDelta < 1) {
        chromiumFakeDropdownBorderElementTopDelta = 1;
      }
      newFakeDropdownBottomBorderDeltaGenerated = true;
    }
  }
  const dropdownElementWidthInt = parseInt(activeDropdownElements[0].style.width, 10);
  chromiumFakeDrodownBottomBorderElement.style.width = `${dropdownElementWidthInt}px`;
  if (!chromiumFakeDrodownBottomBorderTopDimension) {
    chromiumFakeDrodownBottomBorderTopDimension = activeDropdownElementPosition.height
    + activeDropdownElementPosition.top + chromiumFakeDropdownBorderElementTopDelta - 0.6;
  }
  chromiumFakeDrodownBottomBorderElement.style.top = `${chromiumFakeDrodownBottomBorderTopDimension}px`;
  originalActiveDropdownHeight = parseInt(activeDropdownElementPosition.height, 10);
  activeDropdownElements[0].style.borderBottom = 'none';
  chromiumFakeDrodownBottomBorderElement.style.display = '';
}

// the following is a bug fix for chromium based browsers where the scroll bars
// do not cover the edge of the table body, meaning that upon hovering on them;
// the mouse over events would be triggered on the body below it.
// In this case, it would be the table element highlighting and cursor change
function setFakeDropdownBorderFixForChromium(id) {
  if (!IS_FIREFOX) {
    const fakeBorderElements = document.getElementById(`chromium-fake-dropdown-border-fix${id}`);
    const activeDropdownElementPosition = activeDropdownElements[0].getBoundingClientRect();
    if (isDropdownVerticalScrollPresent()) {
      chromiumFakeDropdownRightBorderElement = fakeBorderElements.childNodes[1];
      addFakeRightBorder(activeDropdownElementPosition);
    }
    if (isDropdownHorizontalScrollPresent()) {
      chromiumFakeDrodownBottomBorderElement = fakeBorderElements.childNodes[3];
      addFakeBottomBorder(activeDropdownElementPosition);
    } else if (chromiumFakeDrodownBottomBorderElement) {
      removeFakeBottomBorderOnExistingDropdown();
    }
  }
}

function changeActiveDropdownElementStyling() {
  const labelListElementScrollLeftVSDropdownMarginLeft = Math.max(-4,
    31 - labelListOverflowParentElement.scrollLeft);
  const labelListElementScrollLeftVSDropdownWidth = Math.min(dropdownElementsWidthFull,
    dropdownElementsWidthDefault + labelListOverflowParentElement.scrollLeft);
  activeDropdownElements[0].style.marginLeft = `${labelListElementScrollLeftVSDropdownMarginLeft}px`;
  activeDropdownElements[0].style.width = `${labelListElementScrollLeftVSDropdownWidth}px`;
  setFakeDropdownBorderFixForChromium(activeLabelId);
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
  setCaretPositionOnDiv(activeLabelTextElement.innerHTML.length,
    activeLabelTextElement, false, scrollHorizontallyToAppropriateWidth);
  activeDropdownElements = document.getElementsByClassName(`labelDropdown${id}`);
  chromiumFakeDrodownBottomBorderTopDimension = null;
  changeActiveDropdownElementStyling();
  activeDropdownElements[0].classList.toggle('show');
  activeDropdownElements[0].scrollTop = 0;
  activeDropdownElements[0].scrollLeft = 0;
}

function initLabelEditing(id) {
  prepareLabelDivForEditing(id);
  deleteAndAddLastRowToRefreshDropdownDiv(activeDropdownElements[0]);
  scrollIntoViewIfNeeded(activeLabelTextElement, labelListOverflowParentElement);
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
  currentTableElementScrollPosition = labelListOverflowParentElement.scrollTop;
  horizontalScrollPresentWhenEditAndScroll = isHorizontalScrollPresent();
  isEditingLabel = true;
}

function setToShapeEditModeWhenDrawing() {
  if (!getAddingPolygonPointsState()) {
    if (getRemovingPolygonPointsState()) {
      if (getPolygonDrawingInProgressState()) {
        window.editShapes();
        setDoNotDisplayButtonAfterTimeoutStateToFalse();
      }
    } else {
      window.editShapes();
      setDoNotDisplayButtonAfterTimeoutStateToFalse();
    }
  }
}

function getCurrentlySelectedLabelShape() {
  return activeShape;
}

function selectShape() {
  const eventShape = {};
  eventShape.target = activeShape;
  if (getRemovingPolygonPointsState()) {
    pointMouseDownEvents(eventShape);
    pointMouseUpEvents(eventShape);
  } else if (getAddingPolygonPointsState()) {
    if (isAddingPointsToPolygon()) window.addPoints();
    addPointsMouseDownEvents(eventShape);
    addPointsMouseUpEvents(eventShape);
  } else {
    polygonMouseDownEvents(eventShape);
    polygonMouseUpEvents(eventShape);
  }
  if (activeShape && activeShape.shapeName === 'bndBox') {
    if (!getRemovingPolygonPointsState() && !getAddingPolygonPointsState()) {
      programaticallySelectBoundingBox(activeShape);
    }
  }
}

function deselectShape() {
  removeHighlightOfListLabel();
  setRemoveLabelsButtonToDisabled();
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
  if (activeShape && activeShape.shapeName === 'bndBox') {
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

function removeChromiumFakeBorderFix() {
  if (chromiumFakeDropdownRightBorderElement) {
    chromiumFakeDropdownRightBorderElement.style.display = 'none';
  }
  if (chromiumFakeDrodownBottomBorderElement) {
    chromiumFakeDrodownBottomBorderElement.style.display = 'none';
  }
}

function removeLabelDropDownContent() {
  if (activeDropdownElements[0].classList.contains('show')) {
    activeDropdownElements[0].classList.remove('show');
  }
  removeChromiumFakeBorderFix();
  isEditingLabel = false;
}

function resetLabelElement() {
  removeLabelDropDownContent();
  activeLabelTextElement.contentEditable = false;
  activeLabelTextElement.style.backgroundColor = null;
  activeLabelTextElement.style.borderColor = 'transparent';
  activeLabelTextElement.style.paddingLeft = '';
  activeEditLabelButton.style.paddingRight = '5px';
  labelListOverflowParentElement.scrollLeft = 0;
  setEditingLabelId(null);
}

function moveSelectedLabelToFrontOfLabelOptions(id, text) {
  if (id !== 0) {
    sendLabelOptionToFront(id);
    const newLabelColor = getLabelColor(text);
    changeShapeColorById(activeLabelId, newLabelColor);
    changeLabelColor(newLabelColor.label);
    repopulateDropdown();
    resetLabellerModalOptions();
  }
}

function addNewLabelToLabelOptions(text) {
  const preprocessedText = preprocessLabelText(text);
  if (activeLabelTextElement.innerHTML !== originalLabelText) {
    if (preprocessedText === '') {
      activeLabelTextElement.innerHTML = originalLabelText;
    } else {
      activeLabelTextElement.innerHTML = preprocessedText;
      addToLabelOptions(preprocessedText);
      const newLabelColor = getLabelColor(preprocessedText);
      changeShapeColorById(activeLabelId, newLabelColor);
      changeLabelColor(newLabelColor.label);
      repopulateDropdown();
      resetLabellerModalOptions();
    }
  }
}

function stopEditing() {
  activeShape = null;
  switchToDefaultIcon(activeEditLabelButton);
  resetLabelElement();
}

function highlightDropdownLabelOption(labelOptionsIndex, divIndex) {
  const [currentlyAvailableDropdownElements] = activeDropdownElements[0].childNodes;
  const labelParenElement = currentlyAvailableDropdownElements.childNodes[divIndex];
  [lastSelectedLabelOption] = labelParenElement.childNodes[0].childNodes;
  const labelColor = availableListOptions[labelOptionsIndex].color.label;
  lastSelectedLabelOption.style.backgroundColor = labelColor;
  scrollIntoViewIfNeeded(lastSelectedLabelOption, activeDropdownElements[0]);
  currentlyActiveLabelOptionIndex = labelOptionsIndex;
}

function wasLabelListHorizontalScrollManipulated() {
  if (!horizontalScrollPresentWhenEditAndScroll && isHorizontalScrollPresent()) {
    currentTableElementScrollPosition = labelListOverflowParentElement.scrollTop;
    horizontalScrollPresentWhenEditAndScroll = true;
    positionDropDownCorrectlyOnScreen();
    return true;
  }
  if (horizontalScrollPresentWhenEditAndScroll && !isHorizontalScrollPresent()) {
    currentTableElementScrollPosition = labelListOverflowParentElement.scrollTop;
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

function setMLGeneratedPalletteToOriginal(shape) {
  updateNumberOfUncheckedMLImages();
  shape.fill = shape.trueFill;
  shape.stroke = shape.trueStroke;
  shape.MLPallette = false;
}

function highlightLabel(currentlySelectedShapeName, idArg) {
  const id = idArg !== undefined ? idArg : activeLabelId;
  if (getRemovingPolygonPointsState() || getAddingPolygonPointsState()) {
    if (currentlySelectedShapeName !== 'bndBox') {
      highlightLabelInTheList(id);
      setRemoveLabelsButtonToDefault();
    }
  } else {
    highlightLabelInTheList(id);
    setRemoveLabelsButtonToDefault();
  }
}

function cancelEditingLabelInLabelList() {
  deselectedEditing = true;
  const currentlySelectedShapeName = activeShape.shapeName;
  activeShape = null;
  if (mouseHoveredOnLabelEditButton) {
    switchToHighlightedDefaultIcon(activeEditLabelButton);
  } else {
    switchToDefaultIcon(activeEditLabelButton);
  }
  addNewLabelToLabelOptions(activeLabelTextElement.innerHTML);
  resetLabelElement();
  highlightLabel(currentlySelectedShapeName);
}

function isEditingLabelInLabelList() {
  return isEditingLabel;
}

function finishEditingLabelList(event) {
  if (isEditingLabel) {
    if (event.target.matches('.labelDropdownOption')) {
      const currentlySelectedShapeName = activeShape ? activeShape.shapeName : null;
      const newText = event.target.innerHTML;
      activeLabelTextElement.innerHTML = newText;
      updateAssociatedLabelObjectsText(newText);
      removeLabelDropDownContent();
      stopEditing();
      moveSelectedLabelToFrontOfLabelOptions(event.target.id.substring(11, 12), newText);
      highlightLabel(currentlySelectedShapeName, activeLabelId);
    } else if (event.target.id === `labelText${activeLabelId}` || event.target.matches('.dropdown-content')
      || event.target.matches('.chromium-fake-dropdown-border-fix')) {
      // do nothing
    } else if (event.target.id === `editButton${activeLabelId}`) {
      if (!labelHasBeenDeselected) {
        deselectedEditing = true;
        switchToHighlightedDefaultIcon(activeEditLabelButton);
        addNewLabelToLabelOptions(activeLabelTextElement.innerHTML);
        resetLabelElement();
      }
    } else if (event.target.nodeName === 'CANVAS' || event.target.className === 'toolkit-button-icon'
        || event.target.className === 'toolkit-button-text' || event.target.id === activeLabelElementId) {
      addNewLabelToLabelOptions(activeLabelTextElement.innerHTML);
      stopEditing();
    } else {
      addNewLabelToLabelOptions(activeLabelTextElement.innerHTML);
      stopEditing();
      deselectShape();
    }
  }
}

function cancelEditingViaKeyboard() {
  activeLabelTextElement.innerHTML = originalLabelText;
  cancelEditingLabelInLabelList();
}

function arrowKeyEventsForLabelList(key) {
  const currentlyHighlightedElement = getCurrentlyHighlightedElement()
    .parentElement.parentElement.parentElement;
  if (key === 'ArrowDown') {
    if (currentlyHighlightedElement.nextSibling) {
      currentlyHighlightedElement.nextSibling.childNodes[0].childNodes[0].childNodes[1].dispatchEvent(new Event('click'));
    }
  } else if (key === 'ArrowUp') {
    if (currentlyHighlightedElement.previousSibling) {
      currentlyHighlightedElement.previousSibling.childNodes[0].childNodes[0].childNodes[1].dispatchEvent(new Event('click'));
    }
  }
}

// the labelTextKeyDown event handles the update of a new text word
function arrowKeyEventsForLabelOtionsList(key) {
  if (key === 'ArrowDown') {
    if (currentlyActiveLabelOptionIndex !== null) {
      const isBeforeLastElement = currentlyActiveLabelOptionIndex
        === availableListOptions.length - 2;
      const lastElementIndex = isBeforeLastElement ? currentlyActiveLabelOptionIndex * 2 + 1
        : currentlyActiveLabelOptionIndex * 2;
      const { nextSibling } = activeDropdownElements[0].childNodes[0]
        .childNodes[lastElementIndex].nextSibling;
      if (nextSibling) {
        const optionElement = nextSibling.childNodes[0].childNodes[0];
        const text = isBeforeLastElement ? optionElement.childNodes[0].innerHTML
          : optionElement.innerHTML;
        activeLabelTextElement.innerHTML = text;
      }
    } else {
      activeLabelTextElement.innerHTML = activeDropdownElements[0].childNodes[0]
        .childNodes[0].childNodes[0].childNodes[0].innerHTML;
    }
  } else if (key === 'ArrowUp') {
    if (currentlyActiveLabelOptionIndex !== null) {
      const { previousSibling } = activeDropdownElements[0].childNodes[0]
        .childNodes[currentlyActiveLabelOptionIndex * 2];
      if (previousSibling) {
        activeLabelTextElement.innerHTML = previousSibling.previousSibling.childNodes[0]
          .childNodes[0].innerHTML;
      }
    } else {
      activeLabelTextElement.innerHTML = activeDropdownElements[0].childNodes[0]
        .childNodes[0].childNodes[0].childNodes[0].innerHTML;
    }
  }
}

window.labelTextKeyDown = (event) => {
  if (event.key === 'Delete') return;
  if (event.key === 'Enter') {
    cancelEditingLabelInLabelList();
  } else {
    window.setTimeout(() => {
      if (event.code === 'Space') {
        const currentCaretPosition = getCaretPositionOnDiv(activeLabelTextElement).position;
        setCaretPositionOnDiv(currentCaretPosition, activeLabelTextElement,
          true, scrollHorizontallyToAppropriateWidth);
      }
      if (IS_FIREFOX && event.code === 'Backspace') emptyContentEditableFirefoxBugFix(activeLabelTextElement);
      if (lastSelectedLabelOption) {
        lastSelectedLabelOption.style.backgroundColor = '';
      }
      let found = false;
      for (let i = 0; i < availableListOptions.length - 1; i += 1) {
        if (availableListOptions[i].text === activeLabelTextElement.innerHTML) {
          highlightDropdownLabelOption(i, i * 2);
          found = true;
          break;
        }
      }
      if (!found) {
        const lastLabelOptionIndex = availableListOptions.length - 1;
        currentlyActiveLabelOptionIndex = null;
        if (availableListOptions[lastLabelOptionIndex].text === activeLabelTextElement.innerHTML) {
          highlightDropdownLabelOption(lastLabelOptionIndex, lastLabelOptionIndex * 2 + 1);
        }
      }
      changeActiveDropdownElementStyling();
      updateAssociatedLabelObjectsText(activeLabelTextElement.innerHTML);
    }, keyDownEventTimeOut);
  }
};

window.labelBtnClick = (id) => {
  setToShapeEditModeWhenDrawing();
  activeShape = getShapeById(id);
  highlightLabel(activeShape.shapeName, id);
  if (!isVisibilitySelected) {
    if (getShapeVisibilityById(id)) {
      selectShape();
    } else if (activeShape && activeShape.shapeName === 'bndBox') {
      programaticallyDeselectBoundingBox();
    } else {
      removePolygonPoints();
      if (getRemovingPolygonPointsState()) {
        setPolygonNotEditableOnClick();
      } else if (getAddingPolygonPointsState()) {
        addPointsPolygonNotEditable();
      } else {
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
      if (activeShape && activeShape.shapeName === 'bndBox') {
        programaticallyDeselectBoundingBox();
      }
    }
    isVisibilitySelected = false;
  }
};

window.labelListScroll = () => {
  if (currentTableElementScrollPosition !== labelListOverflowParentElement.scrollTop) {
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

window.mouseLeaveLabelDropdownOption = (element, labelOption) => {
  if (labelOption) {
    const idNumber = parseInt(element.id.match(/\d+$/)[0], 10);
    if (currentlyActiveLabelOptionIndex !== idNumber) {
      element.style.backgroundColor = '';
    }
  } else if (element.id !== 'used') {
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
  isVisibilityRestored = changeShapeVisibilityById(id);
  if (getLabelsVisibilityState()) changeLabelVisibilityById(id);
  changeVisibilityButtonActiveFlagById(id);
  isVisibilitySelected = true;
  if (element.id === 'default') {
    element.id = 'highlighted';
    if (getRemovingPolygonPointsState()) {
      setPolygonNotEditableOnClick();
    } else if (getAddingPolygonPointsState()) {
      if (isAddingPointsToPolygon()) window.addPoints();
      addPointsPolygonNotEditable();
    }
    switchToHighlightedActiveIcon(element);
  } else {
    element.id = 'default';
    switchToHighlightedDefaultVisibilityIcon(element);
  }
};

window.mouseEnterLabelEditBtn = (element) => {
  if (isEditingLabel) {
    mouseHoveredOnLabelEditButton = element.id === `editButton${activeLabelId}`;
  } else {
    mouseHoveredOnLabelEditButton = true;
  }
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
  if (!getBoundingBoxScalingState() && !getShapeMovingState()) {
    if (getShapeById(id).MLPallette) {
      setMLGeneratedPalletteToOriginal(getShapeById(id));
    }
    highlightShapeFill(id);
  }
};

window.mouseLeaveLabel = (id) => {
  if (!getBoundingBoxScalingState() && !getShapeMovingState()) {
    defaultShapeFill(id);
  }
};

export {
  arrowKeyEventsForLabelOtionsList, removeLabelFromListOnShapeDelete,
  finishEditingLabelList, initialiseLabelList, cancelEditingViaKeyboard,
  moveSelectedLabelToFrontOfLabelOptions, getCurrentlySelectedLabelShape,
  isEditingLabelInLabelList, removeAllLabelListItems, repopulateDropdown,
  addExistingLabelToList, arrowKeyEventsForLabelList, addNewLabelToListFromPopup,
};
