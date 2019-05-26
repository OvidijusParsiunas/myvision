import { removeEditedPolygonId } from './editPolygonEventsWorker';
import {
  removePolygonPoints, getPolygonEditingStatus, setEditablePolygon,
  getPolygonIdIfEditing, initializeAddNewPoints, addFirstPoint,
  addPoint, completePolygon, drawLineOnMouseMove, moveAddablePoint,
  addPointsMouseHover, resetAddPointProperties,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront } from '../../../utils/canvasUtils';
import { resetCanvasEventsToDefault } from '../resetCanvasUtils/resetCanvasEventsFacade';
import { setHoverCursorOnMouseOut } from '../../cursorModes/addPointsMode';

let selectedPolygonId = null;
let newPolygonSelected = false;
let canvas = null;
let addingPoints = false;
let selectedNothing = false;
let addFirstPointMode = false;
let coordinatesOfLastMouseHover = null;

function isRightMouseButtonClicked(pointer) {
  if (coordinatesOfLastMouseHover.x !== pointer.x) {
    return true;
  }
  return false;
}

// a nice to have - when nothing selected and selecting remove or add points
// make sure that everything that uses change returns polygon points and see
// if they can be changed directly instead of searching the canvas
// highlight all of them differently to indicate that
// they can all be potentially edited (when none are selected)
// highlight point when hovering to complete polygon after adding
// when creating new polygon, do not have crosshair movable cursor on hovering initial point

// creating new polygon, then remove certain points and hit create new again

// disallow the creation of a new polygon with 1 point
// when clicking on rectangle, doesn't stay on top of other polygons
// when selecting add points mode, and selecting a polygon then another,
//  the add points doesn't work properly when overlapping
// when clicking add points multiple times after adding points, can't select polygon

function mouseOverEvents(events) {
  addPointsMouseHover(events);
}

function setAddPointsEventsCanvas(canvasObj) {
  canvas = canvasObj;
  selectedPolygonId = getPolygonIdIfEditing();
  addingPoints = false;
  addFirstPointMode = false;
  resetAddPointProperties();
}

function prepareToAddPolygonPoints(event) {
  removePolygonPoints();
  removeEditedPolygonId();
  setEditablePolygon(canvas, event.target, false, false, true);
  selectedPolygonId = event.target.id;
  // should not be managed here
}

function moveAddPoints(event) {
  if (addingPoints) {
    moveAddablePoint(event);
  }
}

function mouseMove(event) {
  if (addingPoints) {
    const pointer = canvas.getPointer(event.e);
    coordinatesOfLastMouseHover = pointer;
    drawLineOnMouseMove(pointer);
  }
}

function pointMouseDownEvents(event) {
  if (!addingPoints) {
    if (event.target) {
      enableActiveObjectsAppearInFront(canvas);
      if (event.target.shapeName === 'point') {
        initializeAddNewPoints(event);
        addingPoints = true;
        addFirstPointMode = true;
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
  } else if (addFirstPointMode) {
    if (!event.target || (event.target && (event.target.shapeName !== 'point' && event.target.shapeName !== 'initialAddPoint'))) {
      const pointer = canvas.getPointer(event.e);
      if (!isRightMouseButtonClicked(pointer)) {
        addFirstPoint(event);
        addFirstPointMode = false;
      }
    }
  } else if (event.target && event.target.shapeName === 'point') {
    addingPoints = false;
    completePolygon(event.target);
    resetCanvasEventsToDefault();
  } else if (!event.target
      || (event.target && (event.target.shapeName !== 'initialAddPoint' && event.target.shapeName !== 'tempPoint'))) {
    const pointer = canvas.getPointer(event.e);
    if (!isRightMouseButtonClicked(pointer)) {
      addPoint(pointer);
    }
  }
}

function pointMouseUpEvents(event) {
  if (event.target && event.target.shapeName === 'polygon' && (newPolygonSelected || selectedNothing)) {
    prepareToAddPolygonPoints(event);
    selectedNothing = false;
    newPolygonSelected = false;
  } else if ((!event.target && getPolygonEditingStatus()) || (event.target && event.target.shapeName === 'bndBox')) {
    if (!addingPoints) {
      removePolygonPoints();
      selectedPolygonId = null;
    }
  }
}

function mouseOutEvents(event) {
  if (event.target && event.target.shapeName === 'tempPoint') {
    setHoverCursorOnMouseOut(canvas, 'crosshair');
  }
}

function getSelectedPolygonIdForAddPoints() {
  return selectedPolygonId;
}

export {
  mouseMove,
  moveAddPoints,
  mouseOutEvents,
  mouseOverEvents,
  pointMouseUpEvents,
  pointMouseDownEvents,
  setAddPointsEventsCanvas,
  getSelectedPolygonIdForAddPoints,
};
