import {
  setEditablePolygon, removePolygonPoint, removePolygonPoints, getPolygonEditingStatus,
  getPolygonIdIfEditing, cleanPolygonPointsArray, changeExistingPolygonPointsToRemovable,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront } from '../../../utils/canvasUtils';
import { removeEditedPolygonId } from './defaultEventsWorker';
import { highlightLabelInTheList, removeHighlightOfListLabel } from '../../../../tools/labelList/labelListHighlightUtils';
import { setRemoveLabelsButtonToDefault, setRemoveLabelsButtonToDisabled } from '../../../../tools/toolkit/styling/state';
import { setSessionDirtyState } from '../../../../tools/state';

// Initialize variables
let selectedPolygonId = null; // Holds the ID of the currently selected polygon
let newPolygonSelected = false; // Flag to indicate if a new polygon has been selected
let canvas = null; // Reference to the Fabric.js canvas object
let removedPolygonPoints = false; // Flag to indicate if polygon points have been removed
let selectedNothing = false; // Flag to indicate if no shape was selected
let ignoredFirstMouseMovement = false; // Flag to ignore the first mouse movement
let currentlyHoveredPoint = null; // Reference to the point being hovered over
let lastHoveredPoint = null; // Reference to the last point that was hovered over
let mouseMoved = false; // Flag to indicate if the mouse has moved

/**
 * selectShape: Highlight a shape in the list and enable the remove button
 * @param {string} shapeId - The ID of the shape to be selected
 */
function selectShape(shapeId) {
  highlightLabelInTheList(shapeId);
  setRemoveLabelsButtonToDefault();
}

/**
 * deselectShape: Remove the highlight from the shape in the list and disable the remove button
 */
function deselectShape() {
  removeHighlightOfListLabel();
  setRemoveLabelsButtonToDisabled();
}

/**
 * setRemovablePointsEventsCanvas: Set up event listeners for removing polygon points
 * @param {object} canvasObj - The Fabric.js canvas object
 */
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

/**
 * prepareToEditPolygonPoints: Prepare the canvas for editing polygon points
 * @param {object} event - The event object containing information about the event
 */
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

/**
 * setPolygonNotEditableOnClick: Set the polygon as not editable and reset the state
 */
function setPolygonNotEditableOnClick() {
  removePolygonPoints();
  selectedPolygonId = null;
  deselectShape();
}

/**
 * pointMouseDownEvents: Handle the mouse down event on a point
 * @param {object} event - The event object containing information about the event
 */
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

/**
 * removePointViaKeyboard: Remove the last hovered point using the keyboard
 */
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

/**
 * pointMouseOverEvents: Handle the mouse over event on a point
 * @param {object} event - The event object containing information about the event
 */
function pointMouseOverEvents(event) {
  if (event.target && event.target.shapeName === 'point' && event.target.fill === 'red') {
    event.target.stroke = 'red';
    canvas.renderAll();
    currentlyHoveredPoint = event.target;
  }
}

/**
 * pointMouseUpEvents: Handle the mouse up event on a polygon or a point
 * @param {object} event - The event object containing information about the event
 */
function pointMouseUpEvents(event) {
  if (event.target && event.target.shapeName === 'polygon' && (selectedNothing || newPolygonSelected)) {
    // subset can be reused
    prepareToEditPolygonPoints(event);
  } else if ((!event.target && getPolygonEditingStatus()) || (event.target && event.target.shapeName === 'bndBox')) {
    setPolygonNotEditableOnClick();
  }
}

/**
 * pointMouseOutEvents: Handle the mouse out event on a point
 * @param {object} event - The event object containing information about the event
 */
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

/**
 * pointMouseMoveEvents: Handle the mouse move event
 */
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
