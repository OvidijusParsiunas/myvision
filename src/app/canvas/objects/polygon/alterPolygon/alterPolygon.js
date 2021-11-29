import polygonProperties from '../properties.js';
import sendPolygonPointsToFrontImpl from './stackPoints.js';
import removePolygonPointsImpl from './removePoints.js';
import removePolygonImpl from './removePolygon.js';
import {
  initializeAddNewPointsImpl, addFirstPointImpl, resetAddPointPropertiesImpl,
  completePolygonImpl, drawLineImpl, clearAllAddPointsDataImpl,
  moveAddablePointImpl, addPointsMouseOverImpl, addPointImpl,
  resetAddPointsImpl, isAddingPointsToPolygonImpl, addPointsMouseOutImpl,
} from './addPoint.js';
import { displayPolygonPointsAfterMoveImpl, resetPolygonSelectableAreaImpl, movePolygonPointImpl } from './movePoint.js';
import { removePolygonPointImpl, getCleanPolygonPointsArrayImpl } from './removePoint.js';
import {
  displayPolygonPointsWithStyleImpl,
  changeDrawingPolygonPointsToRemovableImpl,
  changeObjectsToPolygonPointsToDefaultImpl,
  changeObjectsToPolygonPointsRemovaleImpl,
} from './changePointsStyle.js';
import {
  getEditingLabelId, getLastPolygonActionWasMoveState,
  getNewShapeSelectedViaLabelListState, setNewShapeSelectedViaLabelListState,
} from '../../../../tools/state.js';
import { highlightShapeFill, defaultShapeFill } from '../../allShapes/allShapes.js';

// this is the polygonInteractionsManager

let canvas = null;
let polygon = null;
let polygonPoints = [];
let editingPolygon = false;
let preventNewPolygonInitialisation = false;

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

function getPolygonIfEditing() {
  if (editingPolygon) {
    return polygon;
  }
  return null;
}

function sendPolygonPointsToFront(canvasArg) {
  canvas = canvas || canvasArg;
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

function getPolygonPointsArray() {
  return polygonPoints;
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

function removePolygon(lableObjectFromLabelList) {
  if (editingPolygon) {
    removePolygonImpl(canvas, polygon);
    return polygon.id;
  }
  if (lableObjectFromLabelList && lableObjectFromLabelList.shapeName === 'polygon') {
    removePolygonImpl(canvas, lableObjectFromLabelList);
    return lableObjectFromLabelList.id;
  }
  return null;
}

function removePolygonPoint(pointId, existingPolygon) {
  removePolygonPointImpl(canvas, polygon, polygonPoints, pointId, existingPolygon);
}

function initializeAddNewPoints(shape, pointer) {
  initializeAddNewPointsImpl(shape, pointer, canvas);
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

function highlightSelectedPolygonViaPoint() {
  highlightShapeFill(polygon.id);
}

function defaultFillSelectedPolygonViaPoint() {
  defaultShapeFill(polygon.id);
}

function setEditablePolygon(canvasObj, polygonObj, removablePoints, creatingPolygon, addingPoints) {
  setSelectedObjects(canvasObj, polygonObj);
  canvasObj.discardActiveObject();
  polygon.bringToFront();
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
  initializeAddNewPoints, addFirstPoint, addPoint,
  removePolygonPoints, displayPolygonPointsAfterMove,
  completePolygon, drawLineOnMouseMove, moveAddablePoint,
  resetAddPoints, isAddingPointsToPolygon, addPointsMouseOut,
  changeExistingPolygonPointsToRemovable, clearAllAddPointsData,
  changePolygonPointsPropertiesToDefault, getPolygonIdIfEditing,
  removePolygonPoint, getPolygonEditingStatus, getPolygonIfEditing,
  addPointsMouseOver, resetAddPointProperties, cleanPolygonPointsArray,
  setEditablePolygon, resetPolygonSelectableArea, getPolygonPointsArray,
  movePolygonPoint, sendPolygonPointsToFront, highlightSelectedPolygonViaPoint,
  setEditablePolygonAfterMoving, removePolygon, defaultFillSelectedPolygonViaPoint,
};
