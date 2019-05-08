import polygonProperties from '../properties';
import sendPolygonPointsToFrontImpl from './stackPoints';
import removePolygonPointsImpl from './removePoints';
import removePolygonImpl from './removePolygon';
import { displayPolygonPointsAfterMoveImpl, resetPolygonSelectableAreaImpl, movePolygonPointImpl } from './movePoint';
import { removePolygonPointImpl, cleanPolygonPointsArrayImpl } from './removePoint';
import {
  displayPolygonPointsWithStyleImpl,
  changeDrawingPolygonPointsToRemovableImpl,
  changeObjectsToPolygonPointsToDefaultImpl,
} from './changePointsStyle';

let canvas = null;
let polygon = null;
let polygonPoints = [];
let editingPolygon = false;

// temporary
function getPolygonIfEditing() {
  return polygon;
}

function getPolygonEditingStatus() {
  return editingPolygon;
}

function getPolygonIdIfEditing() {
  if (editingPolygon) {
    return polygon.id;
  }
  return null;
}

function sendPolygonPointsToFront() {
  sendPolygonPointsToFrontImpl(canvas, polygonPoints);
  editingPolygon = true;
}

function displayPolygonPoints() {
  displayPolygonPointsWithStyleImpl(
    canvas, polygon, polygonPoints, polygonProperties.existingPolygonPoint,
  );
}

function displayRemovablePolygonPoints() {
  displayPolygonPointsWithStyleImpl(
    canvas, polygon, polygonPoints, polygonProperties.removablePolygonPoint,
  );
}

function displayInitialAddPolygonPoints() {
  displayPolygonPointsWithStyleImpl(
    canvas, polygon, polygonPoints, polygonProperties.initialAddPolygonPoint,
  );
}

function changePolygonPointsToRemovable() {
  polygonPoints = changeDrawingPolygonPointsToRemovableImpl(canvas);
}

function cleanPolygonPointsArray() {
  cleanPolygonPointsArrayImpl(polygon);
}

function removePolygonPoints() {
  polygonPoints = removePolygonPointsImpl(canvas, polygonPoints);
  editingPolygon = false;
}

function changePolygonPointsPropertiesToDefault() {
  changeObjectsToPolygonPointsToDefaultImpl(canvas);
}

function displayPolygonPointsAfterMove() {
  polygon = displayPolygonPointsAfterMoveImpl(canvas, polygon, polygonPoints);
  editingPolygon = true;
}

function setSelectedObjects(activeCanvasObj, activePolygonObject) {
  canvas = activeCanvasObj;
  polygon = activePolygonObject;
}

function setEditablePolygonAfterMoving(canvasObj, polygonObj) {
  setSelectedObjects(canvasObj, polygonObj);
  canvasObj.discardActiveObject();
  displayPolygonPointsAfterMove();
}

function resetPolygonSelectableArea() {
  resetPolygonSelectableAreaImpl(canvas, polygon);
}

function movePolygonPoint(event) {
  movePolygonPointImpl(event, polygon);
}

function removePolygon() {
  if (editingPolygon) {
    removePolygonImpl(canvas, polygon);
  }
}

function removePolygonPoint(pointId) {
  removePolygonPointImpl(canvas, polygon, polygonPoints, pointId);
}

function setEditablePolygon(canvasObj, polygonObj, removablePoints, creatingPolygon, addingPoints) {
  setSelectedObjects(canvasObj, polygonObj);
  canvasObj.discardActiveObject();
  polygon.bringForward();
  // edit this
  if (addingPoints) {
    displayInitialAddPolygonPoints();
  } else if (!removablePoints) {
    displayPolygonPoints();
  } else if (!creatingPolygon) {
    displayRemovablePolygonPoints();
  } else {
    changePolygonPointsToRemovable();
  }
  editingPolygon = true;
}

export {
  setEditablePolygon, resetPolygonSelectableArea,
  movePolygonPoint, sendPolygonPointsToFront,
  removePolygonPoints, displayPolygonPointsAfterMove,
  setEditablePolygonAfterMoving, removePolygon,
  removePolygonPoint, getPolygonEditingStatus,
  displayRemovablePolygonPoints, displayInitialAddPolygonPoints,
  changePolygonPointsPropertiesToDefault, getPolygonIdIfEditing,
  getPolygonIfEditing, cleanPolygonPointsArray,
};
