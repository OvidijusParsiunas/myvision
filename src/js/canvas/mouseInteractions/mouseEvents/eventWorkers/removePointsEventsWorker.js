import {
  setEditablePolygon, removePolygonPoint, removePolygonPoints, getPolygonEditingStatus,
  getPolygonIdIfEditing, cleanPolygonPointsArray, changeExistingPolygonPointsToRemovable,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront } from '../../../utils/canvasUtils';
import { removeEditedPolygonId } from './editPolygonEventsWorker';

let selectedPolygonId = null;
let newPolygonSelected = false;
let canvas = null;
let removedPolygonPoints = false;
let interruptedAddPoints = false;

function setRemovablePointsEventsCanvas(canvasObj, interruptedAddPointsArg) {
  changeExistingPolygonPointsToRemovable();
  canvas = canvasObj;
  selectedPolygonId = getPolygonIdIfEditing();
  if (interruptedAddPointsArg) {
    interruptedAddPoints = true;
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
}

function setPolygonNotEditableOnClick() {
  if (!interruptedAddPoints) {
    removePolygonPoints();
    selectedPolygonId = null;
  } else {
    interruptedAddPoints = false;
  }
}

function pointMouseDownEvents(event) {
  if (event.target) {
    enableActiveObjectsAppearInFront(canvas);
    if (event.target.shapeName === 'point') {
      removePolygonPoint(event.target.pointId);
      removedPolygonPoints = true;
    } else {
      if (event.target.shapeName === 'polygon' && event.target.id !== selectedPolygonId) {
        newPolygonSelected = true;
      }
      preventActiveObjectsAppearInFront(canvas);
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
  console.log('if selected another and up on the same one, should remain');
  // bug where creating two new polygons, selecting remove, selecting one and dragging it is allowed
  // selecting first, and up on another should bring it to another
  console.log('logic here to change if upon selecting, the same one is output')
  if (event.target && event.target.shapeName === 'polygon' && newPolygonSelected) {
    // subset can be reused
    prepareToEditPolygonPoints(event);
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

function getSelectedPolygonIdForRemovingPoints() {
  return selectedPolygonId;
}

export {
  pointMouseDownEvents, pointMouseOverEvents,
  pointMouseUpEvents, pointMouseOutEvents,
  setRemovablePointsEventsCanvas, getSelectedPolygonIdForRemovingPoints,
};
