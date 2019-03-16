import {
  setEditablePolygon, movePolygonPoint,
  removePolygonPoints, generatePolygonPointsAfterMove,
  setEditablePolygonAfterMoving, resetPolygonSelectableArea,
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
    generatePolygonPointsAfterMove();
  }
  polygonMoved = false;
  editingPolygon = true;
}

function resetPolygonSelectableAreaAfterPointMoved() {
  resetPolygonSelectableArea();
  polygonPointMoved = false;
}

function removePolygonPointsOnCanvasClick() {
  removePolygonPoints();
  editingPolygon = false;
  selectedPolygonId = null;
}

function polygonMouseDownEvents(event) {
  if (event.target && event.target.shapeName === 'polygon' && event.target.id !== selectedPolygonId) {
    newPolygonSelected = true;
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
  } else if (!event.target && editingPolygon) {
    removePolygonPointsOnCanvasClick();
  }
}

function polygonMoveEvents(event) {
  if (event.target && event.target.shapeName === 'polygon') {
    if (editingPolygon) {
      removePolygonPoints();
      editingPolygon = false;
    }
    polygonMoved = true;
  }
  if (event.target && event.target.shapeName === 'point') {
    movePolygonPoint(event);
    polygonPointMoved = true;
  }
}

export { polygonMouseDownEvents, polygonMouseUpEvents, polygonMoveEvents };
