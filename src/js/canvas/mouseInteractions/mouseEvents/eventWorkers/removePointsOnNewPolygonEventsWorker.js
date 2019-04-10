import {
  setEditablePolygon, removePolygonPoint,
} from '../../../objects/polygon/alterPolygon/alterPolygon';

let removingPoints = false;
let canvas = null;

// call these event workers
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

function setRemovablePointsEventsCanvas(canvasObj, polygonObj) {
  canvas = canvasObj;
  // edit this
  setEditablePolygon(canvas, polygonObj, true, true);
}

function pointMouseDownEvents(event) {
  if (event.target && event.target.shapeName === 'point') {
    removePolygonPoint(event.target.pointId);
  }
}

function pointMouseOverEvents(event) {
  if (event.target && event.target.shapeName === 'point') {
    event.target.stroke = 'red';
    canvas.renderAll();
  }
}

function pointMouseUpEvents() {
  // filler function for the default parent call
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

export {
  pointMouseDownEvents, pointMouseOverEvents,
  pointMouseUpEvents, pointMouseOutEvents,
  setRemovablePointsEventsCanvas, undoRemovePointsEventsObjectsProperties,
  getRemovingPointsState, setRemovingPointsStateToFalse,
};
