import {
  setEditablePolygon, removePolygonPoint,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { getCurrentlyHoveredDrawPoint } from '../../../objects/polygon/polygon';

// Flag to keep track of whether points are being removed or not
let removingPoints = false;
// The canvas object that the points belong to
let canvas = null;
// The point that is currently being hovered over
let currentlyHoveredPoint = null;
// A flag to ignore the first mouse movement event
let ignoredFirstMouseMovement = false;
// The point that was last hovered over
let lastHoveredPoint = null;
// A flag to keep track of whether the mouse has moved since the last point hover
let mouseMoved = false;

/**
 * Sets up the event listeners and initializes the state for the canvas and points
 * @param {Object} canvasObj - The canvas object that the points belong to
 * @param {Object} polygonObj - The polygon object to make editable
 */
function setRemovablePointsEventsCanvas(canvasObj, polygonObj) {
  canvas = canvasObj;
  ignoredFirstMouseMovement = false;
  currentlyHoveredPoint = null;
  lastHoveredPoint = null;
  mouseMoved = false;
  // If a polygon object is provided, make it editable
  if (polygonObj) {
    setEditablePolygon(canvas, polygonObj, true, true);
  }
}

/**
 * Removes the point that was clicked on
 * @param {Object} event - The mouse down event object
 */
function pointMouseDownEvents(event) {
  if (event.target && event.target.shapeName === 'point') {
    removePolygonPoint(event.target.pointId);
    currentlyHoveredPoint = null;
  }
}

/**
 * Removes the last hovered point via the keyboard
 */
function removeTempPointViaKeyboard() {
  if (!mouseMoved) {
    if (lastHoveredPoint) {
      removePolygonPoint(lastHoveredPoint.pointId);
    } else {
      const currentlyHoveredDrawingPoint = getCurrentlyHoveredDrawPoint();
      if (currentlyHoveredDrawingPoint) {
        removePolygonPoint(currentlyHoveredDrawingPoint.pointId);
        currentlyHoveredDrawingPoint.state = 'removed';
      }
    }
    mouseMoved = true;
  } else if (currentlyHoveredPoint) {
    removePolygonPoint(currentlyHoveredPoint.pointId);
  }
  currentlyHoveredPoint = null;
}

/**
 * Highlights the point that is being hovered over
 * @param {Object} event - The mouse over event object
 */
function pointMouseOverEvents(event) {
  if (event.target && event.target.shapeName === 'point' && event.target.fill === 'red') {
    event.target.stroke = 'red';
    canvas.renderAll();
    currentlyHoveredPoint = event.target;
  }
}

/**
 * Filler function for the default parent call
 */
function pointMouseUpEvents() {
  // Filler function for the default parent call
}

/**
 * Un-highlights the point that was previously hovered over
 * @param {Object} event - The mouse out event object
 */
function pointMouseOutEvents(event) {
  if (event.target && event.target.shapeName === 'point') {
    event.target.stroke = 'black';
    canvas.renderAll();
    currentlyHoveredPoint = null;
    // Fix for the bug where upon hovering over a point in another mode and switching it to this
    // mode - the mouse out event is triggered, highlighting the last hovered shape
    if (!mouseMoved) lastHoveredPoint = event.target;
  }
}

/**
 * Ignores the first mouse movement event and sets the mouseMoved flag to true
 */
function pointMouseMoveEvents() {
  if (ignoredFirstMouseMovement) {
    mouseMoved = true;
  } else {
    ignoredFirstMouseMovement = true;
  }
}

/**
 * Returns the removingPoints flag
 * @returns {boolean} - The removingPoints flag
 */
function getRemovingPointsState() {
  return removingPoints;
}

/**
 * Sets the removingPoints flag to false
 */
function setRemovingPointsStateToFalse() {
  removingPoints = false;
}

export {
  pointMouseDownEvents, pointMouseOverEvents,
  setRemovablePointsEventsCanvas, getRemovingPointsState,
  setRemovingPointsStateToFalse, removeTempPointViaKeyboard,
  pointMouseUpEvents, pointMouseOutEvents, pointMouseMoveEvents,
};
