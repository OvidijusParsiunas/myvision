import {
  setEditablePolygon, removePolygonPoint, removePolygonPoints, getPolygonEditingStatus,
  getPolygonIdIfEditing, cleanPolygonPointsArray, changeExistingPolygonPointsToRemovable,
} from '../../../objects/polygon/alterPolygon/alterPolygon.js';
import { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront } from '../../../utils/canvasUtils.js';
import { removeEditedPolygonId } from './defaultEventsWorker.js';
import { highlightLabelInTheList, removeHighlightOfListLabel } from '../../../../tools/labelList/labelListHighlightUtils.js';
import { setRemoveLabelsButtonToDefault, setRemoveLabelsButtonToDisabled } from '../../../../tools/toolkit/styling/state.js';
import { setSessionDirtyState } from '../../../../tools/state.js';

let selectedPolygonId = null;
let newPolygonSelected = false;
let canvas = null;
let removedPolygonPoints = false;
let selectedNothing = false;
let ignoredFirstMouseMovement = false;
let currentlyHoveredPoint = null;
let lastHoveredPoint = null;
let mouseMoved = false;

function selectShape(shapeId) {
  highlightLabelInTheList(shapeId);
  setRemoveLabelsButtonToDefault();
}

function deselectShape() {
  removeHighlightOfListLabel();
  setRemoveLabelsButtonToDisabled();
}

function setRemovablePointsEventsCanvas(canvasObj) {
  changeExistingPolygonPointsToRemovable(canvasObj);
  canvas = canvasObj;
  selectedPolygonId = getPolygonIdIfEditing();
  ignoredFirstMouseMovement = false;
  currentlyHoveredPoint = null;
  lastHoveredPoint = null;
  mouseMoved = false;
  if (selectedPolygonId !== null && selectedPolygonId !== undefined) {
    selectShape(selectedPolygonId);
  }
}

function prepareToEditPolygonPoints(event) {
  if (removedPolygonPoints) {
    cleanPolygonPointsArray();
    removedPolygonPoints = false;
  }
  removePolygonPoints();
  removeEditedPolygonId();
  setEditablePolygon(canvas, event.target, true);
  selectedPolygonId = event.target.id;
  selectShape(selectedPolygonId);
  ignoredFirstMouseMovement = false;
  currentlyHoveredPoint = null;
  lastHoveredPoint = null;
  mouseMoved = false;
}

function setPolygonNotEditableOnClick() {
  removePolygonPoints();
  selectedPolygonId = null;
  deselectShape();
}

function pointMouseDownEvents(event) {
  if (event.target) {
    enableActiveObjectsAppearInFront(canvas);
    if (event.target.shapeName === 'point') {
      removePolygonPoint(event.target.pointId, true);
      removedPolygonPoints = true;
      currentlyHoveredPoint = null;
      setSessionDirtyState(true);
    } else {
      if (event.target.shapeName === 'polygon') {
        newPolygonSelected = (event.target.id !== selectedPolygonId);
      }
      preventActiveObjectsAppearInFront(canvas);
    }
    selectedNothing = false;
  } else {
    selectedNothing = true;
  }
}

function removePointViaKeyboard() {
  if (!mouseMoved) {
    if (lastHoveredPoint) {
      removePolygonPoint(lastHoveredPoint.pointId);
      setSessionDirtyState(true);
    }
    mouseMoved = true;
  } else if (currentlyHoveredPoint) {
    removePolygonPoint(currentlyHoveredPoint.pointId, true);
    setSessionDirtyState(true);
  }
  currentlyHoveredPoint = null;
}

function pointMouseOverEvents(event) {
  if (event.target && event.target.shapeName === 'point' && event.target.fill === 'red') {
    event.target.stroke = 'red';
    canvas.renderAll();
    currentlyHoveredPoint = event.target;
  }
}

function pointMouseUpEvents(event) {
  if (event.target && event.target.shapeName === 'polygon' && (selectedNothing || newPolygonSelected)) {
    // subset can be reused
    prepareToEditPolygonPoints(event);
  } else if ((!event.target && getPolygonEditingStatus()) || (event.target && event.target.shapeName === 'bndBox')) {
    setPolygonNotEditableOnClick();
  }
}

function pointMouseOutEvents(event) {
  if (event.target && event.target.shapeName === 'point' && event.target.fill === 'red') {
    event.target.stroke = 'black';
    canvas.renderAll();
    currentlyHoveredPoint = null;
    // fix for the bug where upon hovering over a point in another mode and switching it to this
    // mode - the mouse out event is triggered, highlighting the last hovered shape
    if (!mouseMoved) lastHoveredPoint = event.target;
  }
}

function pointMouseMoveEvents() {
  if (ignoredFirstMouseMovement) {
    mouseMoved = true;
  } else {
    ignoredFirstMouseMovement = true;
  }
}

export {
  pointMouseUpEvents, pointMouseOutEvents, setPolygonNotEditableOnClick, removePointViaKeyboard,
  setRemovablePointsEventsCanvas, pointMouseOverEvents, pointMouseDownEvents, pointMouseMoveEvents,
};
