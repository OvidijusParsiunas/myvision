import {
  setEditablePolygon,
  removePolygonPoint, removePolygonPoints,
  getPolygonEditingStatus,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { removeEditedPolygonId } from './editPolygonEventsWorker';

let selectedPolygonId = null;
let newPolygonSelected = false;
let removingPoints = false;
let canvas = null;

// move this
function undoRemovePointsEventsObjectsProperties() {
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName === 'bndBox') {
      iteratedObj.selectable = true;
    } else {
      iteratedObj.lockMovementX = false;
      iteratedObj.lockMovementY = false;
    }
    if (iteratedObj.shapeName === 'point') {
      iteratedObj.fill = 'blue';
      iteratedObj.radius = 3.5;
    }
  });
}

function setEditablePolygonOnClick(event) {
  if (getPolygonEditingStatus()) {
    // selecting another polygon without moving the first one
    removePolygonPoints();
    removingPoints = true;
  }
  // performance dropdown as we are displaying polygons twice
  setEditablePolygon(canvas, event.target, true);
  selectedPolygonId = event.target.id;
}

function setPolygonNotEditableOnClick() {
  removePolygonPoints();
  selectedPolygonId = null;
}

function setRemovablePointsEventsCanvas(canvasObj) {
  canvas = canvasObj;
}

function pointMouseDownEvents(event) {
  if (event.target) {
    if (event.target.shapeName === 'polygon' && event.target.id !== selectedPolygonId) {
      newPolygonSelected = true;
    } else if (event.target.shapeName === 'point') {
      removePolygonPoint(event.target.pointId);
    }
  }
}

function pointMouseOverEvents(event) {
  if (event.target && event.target.shapeName === 'point') {
    event.target.stroke = 'red';
    canvas.renderAll();
  }
}

function pointMouseUpEvents(event) {
  if (event.target && event.target.shapeName === 'polygon' && newPolygonSelected) {
    // subset can be reused
    removeEditedPolygonId();
    setEditablePolygonOnClick(event, canvas);
  } else if ((!event.target && getPolygonEditingStatus()) || (event.target && event.target.shapeName === 'bndBox')) {
    setPolygonNotEditableOnClick();
  }
}

function pointMouseOutEvents(event) {
  if (event.target && event.target.shapeName === 'point') {
    event.target.stroke = 'black';
    canvas.renderAll();
  }
}

function getRemovingPointsState() {
  return removingPoints;
}

function setRemovingPointsStateToFalse() {
  removingPoints = false;
}

function getSelectedPolygonIdForRemovingPoints() {
  return selectedPolygonId;
}

export {
  pointMouseDownEvents, pointMouseOverEvents,
  pointMouseUpEvents, pointMouseOutEvents,
  setRemovablePointsEventsCanvas, undoRemovePointsEventsObjectsProperties,
  getRemovingPointsState, setRemovingPointsStateToFalse,
  getSelectedPolygonIdForRemovingPoints,
};
