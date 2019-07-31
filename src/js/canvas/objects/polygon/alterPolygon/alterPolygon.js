import polygonProperties from '../properties';
import sendPolygonPointsToFrontImpl from './stackPoints';
import removePolygonPointsImpl from './removePoints';
import removePolygonImpl from './removePolygon';
import {
  initializeAddNewPointsImpl, addFirstPointImpl, resetAddPointPropertiesImpl,
  completePolygonImpl, drawLineImpl, clearAllAddPointsDataImpl,
  moveAddablePointImpl, addPointsMouseOverImpl, addPointImpl,
  resetAddPointsImpl, isAddingPointsToPolygonImpl, addPointsMouseOutImpl,
} from './addPoint';
import { displayPolygonPointsAfterMoveImpl, resetPolygonSelectableAreaImpl, movePolygonPointImpl } from './movePoint';
import { removePolygonPointImpl, getCleanPolygonPointsArrayImpl } from './removePoint';
import {
  displayPolygonPointsWithStyleImpl,
  changeDrawingPolygonPointsToRemovableImpl,
  changeObjectsToPolygonPointsToDefaultImpl,
  changeObjectsToPolygonPointsRemovaleImpl,
} from './changePointsStyle';
import {
  getEditingLabelId, getLastPolygonActionWasMoveState,
  getNewShapeSelectedViaLabelListState, setNewShapeSelectedViaLabelListState,
} from '../../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';

// this is the polygonInteractionsManager

let canvas = null;
let polygon = null;
let polygonPoints = [];
let editingPolygon = false;
let preventNewPolygonInitialisation = false;

// temporary
function getPolygonIfEditing() {
  return polygon;
}

function getPolygonEditingStatus() {
  return editingPolygon;
}

function setPolygonEditingStatus(status) {
  editingPolygon = status;
}

function getPolygonIdIfEditing() {
  if (editingPolygon) {
    return polygon.id;
  }
  return null;
}

function sendPolygonPointsToFront() {
  sendPolygonPointsToFrontImpl(canvas, polygonPoints);
  setPolygonEditingStatus(true);
}

function displayPolygonPoints() {
  if (!preventNewPolygonInitialisation) {
    polygonPoints = displayPolygonPointsWithStyleImpl(
      canvas, polygon, polygonProperties.existingPolygonPoint,
    );
  } else {
    preventNewPolygonInitialisation = false;
    sendPolygonPointsToFront();
  }
}

function displayRemovablePolygonPoints() {
  polygonPoints = displayPolygonPointsWithStyleImpl(
    canvas, polygon, polygonProperties.removablePolygonPoint,
  );
}

function displayStartingAddPolygonPoints() {
  polygonPoints = displayPolygonPointsWithStyleImpl(
    canvas, polygon, polygonProperties.startingAddPolygonPoint,
  );
}

function changeDrawingPolygonPointsToRemovable() {
  polygonPoints = changeDrawingPolygonPointsToRemovableImpl(canvas, polygon);
}

// change existing objects for removable points
function changeExistingPolygonPointsToRemovable(canvasObj) {
  polygonPoints = changeObjectsToPolygonPointsRemovaleImpl(canvasObj);
}

function cleanPolygonPointsArray() {
  polygonPoints = getCleanPolygonPointsArrayImpl(polygon, polygonPoints);
}

function removePolygonPoints() {
  if (getLastPolygonActionWasMoveState()) {
    if (getEditingLabelId() === null || getNewShapeSelectedViaLabelListState()) {
      polygonPoints = removePolygonPointsImpl(canvas, polygonPoints);
    } else {
      preventNewPolygonInitialisation = true;
    }
  } else {
    polygonPoints = removePolygonPointsImpl(canvas, polygonPoints);
  }
  setNewShapeSelectedViaLabelListState(false);
  setPolygonEditingStatus(false);
}

function changePolygonPointsPropertiesToDefault(canvasObj) {
  // naming convention?
  canvas = !canvasObj ? canvas : canvasObj;
  changeObjectsToPolygonPointsToDefaultImpl(canvas);
}

function displayPolygonPointsAfterMove() {
  polygon = displayPolygonPointsAfterMoveImpl(canvas, polygon, polygonPoints);
  setPolygonEditingStatus(true);
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

function movePolygonPoint(event, labelObject) {
  movePolygonPointImpl(event, polygon, labelObject);
}

function removePolygon() {
  if (editingPolygon) {
    removePolygonImpl(canvas, polygon);
  }
}

function removePolygonPoint(pointId, existingPolygon) {
  removePolygonPointImpl(canvas, polygon, polygonPoints, pointId, existingPolygon);
}

function initializeAddNewPoints(event) {
  initializeAddNewPointsImpl(event, canvas);
}

function addFirstPoint(event) {
  addFirstPointImpl(event);
}

function addPoint(pointer) {
  addPointImpl(pointer);
}

function drawLineOnMouseMove(pointer) {
  drawLineImpl(pointer);
}

function moveAddablePoint(event) {
  moveAddablePointImpl(event);
}

function addPointsMouseOver(event) {
  addPointsMouseOverImpl(event);
}

function resetAddPointProperties(canvasObj) {
  resetAddPointPropertiesImpl(canvasObj);
}

function clearAllAddPointsData() {
  clearAllAddPointsDataImpl();
}

function resetAddPoints() {
  resetAddPointsImpl();
}

function addPointsMouseOut(event) {
  addPointsMouseOutImpl(event);
}

function isAddingPointsToPolygon() {
  return isAddingPointsToPolygonImpl();
}

function completePolygon(finalPoint) {
  completePolygonImpl(polygon, polygon.points, finalPoint);
  polygonPoints = [];
  resetPolygonSelectableArea();
  setPolygonEditingStatus(false);
}

function setEditablePolygon(canvasObj, polygonObj, removablePoints, creatingPolygon, addingPoints) {
  setSelectedObjects(canvasObj, polygonObj);
  canvasObj.discardActiveObject();
  polygon.bringForward();
  // edit this
  if (addingPoints) {
    displayStartingAddPolygonPoints();
  } else if (!removablePoints) {
    displayPolygonPoints();
  } else if (!creatingPolygon) {
    displayRemovablePolygonPoints();
  } else {
    changeDrawingPolygonPointsToRemovable();
  }
  setPolygonEditingStatus(true);
}

export {
  setEditablePolygon, resetPolygonSelectableArea,
  movePolygonPoint, sendPolygonPointsToFront,
  removePolygonPoints, displayPolygonPointsAfterMove,
  setEditablePolygonAfterMoving, removePolygon,
  removePolygonPoint, getPolygonEditingStatus,
  changePolygonPointsPropertiesToDefault, getPolygonIdIfEditing,
  getPolygonIfEditing, cleanPolygonPointsArray,
  initializeAddNewPoints, addFirstPoint, addPoint,
  completePolygon, drawLineOnMouseMove, moveAddablePoint,
  addPointsMouseOver, resetAddPointProperties,
  changeExistingPolygonPointsToRemovable, clearAllAddPointsData,
  resetAddPoints, isAddingPointsToPolygon, addPointsMouseOut,
};
