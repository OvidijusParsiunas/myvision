import {
  setEditablePolygon, movePolygonPoint,
  removePolygonPoints, displayPolygonPointsAfterMove,
  setEditablePolygonAfterMoving, resetPolygonSelectableArea,
  sendPolygonPointsToFront,
} from '../../../../canvas/canvasObjects/polygon/changePolygon';

let editingPolygon = false;
let polygonMoved = false;
let polygonPointMoved = false;
let selectedPolygonId = null;
let newPolygonSelected = false;

function setEditablePolygonOnClick(event, canvas) {
  if (editingPolygon) {
    // selecting another polygon without moving the first one
    removePolygonPoints();
  }
  setEditablePolygon(canvas, event.target);
  selectedPolygonId = event.target.id;
  editingPolygon = true;
}

function setEditablePolygonWhenPolygonMoved(event, canvas) {
  if (newPolygonSelected) {
    setEditablePolygonAfterMoving(canvas, event.target);
    selectedPolygonId = event.target.id;
  } else {
    displayPolygonPointsAfterMove();
  }
  polygonMoved = false;
  editingPolygon = true;
}

function resetPolygonSelectableAreaAfterPointMoved() {
  resetPolygonSelectableArea();
  polygonPointMoved = false;
}

function setPolygonNotEditableOnClick() {
  removePolygonPoints();
  editingPolygon = false;
  selectedPolygonId = null;
}

function polygonMouseDownEvents(event) {
  if (event.target) {
    if (event.target.shapeName === 'bndBox' && editingPolygon) {
      setPolygonNotEditableOnClick();
      newPolygonSelected = false;
    } else if (event.target.shapeName === 'polygon' && event.target.id !== selectedPolygonId) {
      newPolygonSelected = true;
    } else {
      newPolygonSelected = false;
    }
  } else {
    newPolygonSelected = false;
  }
}

function polygonMouseUpEvents(event, canvas) {
  if (polygonMoved) {
    setEditablePolygonWhenPolygonMoved(event, canvas);
  } else if (newPolygonSelected) {
    setEditablePolygonOnClick(event, canvas);
  } else if (polygonPointMoved) {
    resetPolygonSelectableAreaAfterPointMoved();
  } else if (event.target && event.target.shapeName === 'polygon') {
    sendPolygonPointsToFront();
  } else if (!event.target && editingPolygon) {
    setPolygonNotEditableOnClick();
  }
}

function polygonMoveEvents(event) {
  if (event.target) {
    if (event.target.shapeName === 'polygon') {
      if (editingPolygon) {
        removePolygonPoints();
        editingPolygon = false;
      }
      polygonMoved = true;
    } else if (event.target.shapeName === 'point') {
      movePolygonPoint(event);
      polygonPointMoved = true;
    }
  }
}

export { polygonMouseDownEvents, polygonMouseUpEvents, polygonMoveEvents };
