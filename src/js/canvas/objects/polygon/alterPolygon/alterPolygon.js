import polygonProperties from '../properties';
import removePolygonPointImpl from './removePoint';
import sendPolygonPointsToFrontImpl from './stackPoints';
import removePolygonPointsImpl from './removePoints';
import removePolygonImpl from './removePolygon';
import { displayPolygonPointsAfterMoveImpl, resetPolygonSelectableAreaImpl, movePolygonPointImpl } from './movePoint';
import {
  displayPolygonPointsWithStyleImpl,
  changeDrawingPolygonPointsToRemovableImpl,
  changePolygonPointsToDefaultImpl,
} from './changePointsStyle';

let canvas = null;
let polygon = null;
let polygonPoints = [];
let editingPolygon = false;

function getPolygonEditingStatus() {
  return editingPolygon;
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

function removePolygonPoints() {
  polygonPoints = removePolygonPointsImpl(canvas, polygonPoints);
  editingPolygon = false;
}

function changePolygonPointsPropertiesToDefault() {
  changePolygonPointsToDefaultImpl(canvas);
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
  removePolygonImpl(canvas, polygon);
}

function removePolygonPoint(pointId) {
  removePolygonPointImpl(canvas, polygon, polygonPoints, pointId);
}

function enableActiveObjectsAppearInFront() {
  if (canvas) {
    canvas.preserveObjectStacking = false;
  }
}

function preventActiveObjectsAppearInFront() {
  canvas.preserveObjectStacking = true;
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
  preventActiveObjectsAppearInFront, displayRemovablePolygonPoints,
  enableActiveObjectsAppearInFront, displayInitialAddPolygonPoints,
  changePolygonPointsPropertiesToDefault,
};
