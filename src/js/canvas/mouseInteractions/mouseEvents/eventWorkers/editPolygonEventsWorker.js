import {
  setEditablePolygon, movePolygonPoint,
  removePolygonPoints, displayPolygonPointsAfterMove,
  setEditablePolygonAfterMoving, resetPolygonSelectableArea,
  sendPolygonPointsToFront, getPolygonEditingStatus,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront } from '../../../utils/canvasUtils';

let polygonMoved = false;
let polygonPointMoved = false;
let selectedPolygonId = null;
let newPolygonSelected = false;
let canvas = null;

function setEditablePolygonOnClick(event) {
  if (getPolygonEditingStatus()) {
    // selecting another polygon without moving the first one
    removePolygonPoints();
  }
  setEditablePolygon(canvas, event.target);
  selectedPolygonId = event.target.id;
}

function setEditablePolygonWhenPolygonMoved(event) {
  if (newPolygonSelected) {
    setEditablePolygonAfterMoving(canvas, event.target);
    selectedPolygonId = event.target.id;
  } else {
    displayPolygonPointsAfterMove();
  }
  polygonMoved = false;
}

function resetPolygonSelectableAreaAfterPointMoved() {
  resetPolygonSelectableArea();
  polygonPointMoved = false;
}

function setPolygonNotEditableOnClick() {
  removePolygonPoints();
  selectedPolygonId = null;
}

function polygonMouseDownEvents(event) {
  if (event.target) {
    enableActiveObjectsAppearInFront(canvas);
    if (event.target.shapeName === 'bndBox' && getPolygonEditingStatus()) {
      setPolygonNotEditableOnClick();
      newPolygonSelected = false;
    } else {
      if (event.target.shapeName === 'polygon' && event.target.id !== selectedPolygonId) {
        newPolygonSelected = true;
      } else {
        newPolygonSelected = false;
      }
      preventActiveObjectsAppearInFront(canvas);
    }
  } else {
    newPolygonSelected = false;
  }
}

// look at this
function polygonMouseUpEvents(event) {
  if (polygonMoved) {
    setEditablePolygonWhenPolygonMoved(event);
  } else if (newPolygonSelected) {
    setEditablePolygonOnClick(event);
  } else if (polygonPointMoved) {
    resetPolygonSelectableAreaAfterPointMoved();
  } else if (event.target && event.target.shapeName === 'polygon') {
    sendPolygonPointsToFront();
  } else if (!event.target && getPolygonEditingStatus()) {
    setPolygonNotEditableOnClick();
  }
}

function polygonMoveEvents(event) {
  if (event.target) {
    if (event.target.shapeName === 'polygon') {
      if (getPolygonEditingStatus()) {
        removePolygonPoints();
      }
      polygonMoved = true;
    } else if (event.target.shapeName === 'point') {
      movePolygonPoint(event);
      polygonPointMoved = true;
    }
  }
}

// set styling
function polygonMouseOutEvents(event) {
  event.target.set('fill', 'rgba(255,0,0,0.01)');
}

function pointMouseOverEvents(event) {
  if (event.target && event.target.shapeName !== 'point') {
    event.target.set('fill', 'rgba(255,0,0,0.2)');
    canvas.renderAll();
  }
}

function removeEditedPolygonId() {
  selectedPolygonId = null;
}

function setEditPolygonEventObjects(canvasObj, polygonIdObj) {
  canvas = canvasObj;
  if (polygonIdObj) {
    selectedPolygonId = polygonIdObj;
  }
}

export {
  polygonMouseDownEvents, polygonMouseUpEvents,
  polygonMoveEvents, removeEditedPolygonId,
  polygonMouseOutEvents, pointMouseOverEvents,
  setEditPolygonEventObjects,
};
