import {
  setEditablePolygon, removePolygonPoint,
} from '../../../objects/polygon/alterPolygon/alterPolygon';

let removingPoints = false;
let canvas = null;
let currentlyHoveredTempPoint = null;

function setRemovablePointsEventsCanvas(canvasObj, polygonObj) {
  canvas = canvasObj;
  // edit this
  if (polygonObj) {
    setEditablePolygon(canvas, polygonObj, true, true);
  }
}

function pointMouseDownEvents(event) {
  if (event.target && event.target.shapeName === 'point') {
    removePolygonPoint(event.target.pointId);
  }
}

function removeTempPointViaKeyboard() {
  if (currentlyHoveredTempPoint) removePolygonPoint(currentlyHoveredTempPoint.pointId);
}

function pointMouseOverEvents(event) {
  if (event.target && event.target.shapeName === 'point' && event.target.fill === 'red') {
    event.target.stroke = 'red';
    canvas.renderAll();
    currentlyHoveredTempPoint = event.target;
  }
}

function pointMouseUpEvents() {
  // filler function for the default parent call
}

function pointMouseOutEvents(event) {
  if (event.target && event.target.shapeName === 'point') {
    event.target.stroke = 'black';
    canvas.renderAll();
    currentlyHoveredTempPoint = false;
  }
}

function getRemovingPointsState() {
  return removingPoints;
}

function setRemovingPointsStateToFalse() {
  removingPoints = false;
}

export {
  pointMouseUpEvents, pointMouseOutEvents,
  pointMouseDownEvents, pointMouseOverEvents,
  setRemovablePointsEventsCanvas, getRemovingPointsState,
  setRemovingPointsStateToFalse, removeTempPointViaKeyboard,
};
