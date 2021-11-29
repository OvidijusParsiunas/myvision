// import fabric from 'fabric.js';
import polygonProperties from '../properties.js';
import labelProperties from '../../label/properties.js';
import setAddPointsMode from '../../../mouseInteractions/cursorModes/addPointsMode.js';
import { changePolygonPointsToAddImpl } from './changePointsStyle.js';
import { getLabelById } from '../../label/label.js';
import { preventOutOfBoundsPointsOnMove } from '../../sharedUtils/moveBlockers.js';
import setInitialStageOfAddPointsOnExistingPolygonMode from '../../../mouseInteractions/cursorModes/initialiseAddPointsOnExistingPolygonMode.js';

let canvas = null;
let activeLine = null;
let lineArray = [];
let tempPointIndex = 0;
let initialPoint = null;
let pointsArray = [];
let defaultPointHoverMode = true;

function drawLineImpl(pointer) {
  activeLine.set({ x2: pointer.x, y2: pointer.y });
  activeLine.setCoords();
  canvas.renderAll();
}

function isAddingPointsToPolygonImpl() {
  return activeLine;
}

function addPointsMouseOverImpl(event) {
  if (defaultPointHoverMode && event.target && event.target.shapeName === 'point') {
    event.target.stroke = 'green';
    canvas.renderAll();
  }
}

function addPointsMouseOutImpl(event) {
  if (event.target && event.target.shapeName === 'point') {
    event.target.stroke = '#333333';
    canvas.renderAll();
  }
}

function moveAddablePointImpl(event) {
  preventOutOfBoundsPointsOnMove(event.target, canvas);
  const xCenterPoint = event.target.getCenterPoint().x;
  const yCenterPoint = event.target.getCenterPoint().y;
  const { pointId } = event.target;
  lineArray[pointId].set({ x2: xCenterPoint, y2: yCenterPoint });
  if ((pointId + 1) !== tempPointIndex) {
    lineArray[pointId + 1].set({ x1: xCenterPoint, y1: yCenterPoint });
  } else {
    activeLine.set({ x1: xCenterPoint, y1: yCenterPoint });
  }
}

function createNewLine(...coordinates) {
  activeLine = new fabric.Line(coordinates, polygonProperties.newLine());
  canvas.add(activeLine);
  canvas.renderAll();
}

function initializeAddNewPointsImpl(shape, pointer, canvasObj) {
  shape.stroke = '#333333';
  canvas = canvasObj;
  setAddPointsMode(canvas, shape);
  createNewLine(shape.left, shape.top, pointer.x, pointer.y);
  initialPoint = shape;
  canvas.bringToFront(initialPoint);
  defaultPointHoverMode = false;
}

function addFirstPointImpl(event) {
  changePolygonPointsToAddImpl(canvas);
  const pointer = canvas.getPointer(event.e);
  lineArray.push(activeLine);
  createNewLine(pointer.x, pointer.y, pointer.x, pointer.y);
  const isNewPoint = true;
  const point = new fabric.Circle(polygonProperties.newPoint(tempPointIndex, pointer, isNewPoint));
  canvas.add(point);
  pointsArray.push(point);
  tempPointIndex += 1;
  canvas.bringToFront(initialPoint);
  defaultPointHoverMode = true;
}

function addPointImpl(pointer) {
  lineArray.push(activeLine);
  createNewLine(pointer.x, pointer.y, pointer.x, pointer.y);
  const isNewPoint = true;
  const point = new fabric.Circle(polygonProperties.newPoint(tempPointIndex, pointer, isNewPoint));
  canvas.add(point);
  pointsArray.push(point);
  preventOutOfBoundsPointsOnMove(point, canvas);
  tempPointIndex += 1;
}

function resetAddPointPropertiesImpl(canvasObj) {
  canvas = canvasObj;
  defaultPointHoverMode = true;
}

function removeEditingPolygonPoints() {
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName === 'point') {
      canvas.remove(iteratedObj);
    } else if (iteratedObj.shapeName === 'initialAddPoint') {
      canvas.remove(iteratedObj);
    }
  });
  canvas.renderAll();
}

function resetEditingPolygonPoints() {
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName === 'initialAddPoint') {
      iteratedObj.shapeName = 'point';
    }
  });
  canvas.renderAll();
}

function clearTempPoints() {
  canvas.remove(activeLine);
  pointsArray.forEach((point) => {
    canvas.remove(point);
  });
  pointsArray = [];
  tempPointIndex = 0;
}

function clearLines() {
  lineArray.forEach((line) => {
    canvas.remove(line);
  });
  lineArray = [];
  activeLine = null;
}

function clearAllAddPointsDataImpl() {
  if (activeLine) {
    clearTempPoints();
    clearLines();
    removeEditingPolygonPoints();
  }
}

function resetAddPointsImpl() {
  if (activeLine) {
    clearTempPoints();
    clearLines();
    resetEditingPolygonPoints();
  }
}

function calculateTotalLineDistance(pointsArr) {
  let totalDistance = 0;
  for (let i = 0; i < pointsArr.length - 1; i += 1) {
    const distance = Math.hypot(pointsArr[i + 1].x - pointsArr[i].x,
      pointsArr[i + 1].y - pointsArr[i].y);
    totalDistance += distance;
  }
  return totalDistance;
}

function addNewPointsByTheirAddDirection(newPointsArray, firstPointId, lastPointId) {
  if (firstPointId < lastPointId) {
    pointsArray.forEach((point) => {
      newPointsArray.push({ x: point.left, y: point.top });
    });
  } else {
    for (let i = pointsArray.length - 1; i > -1; i -= 1) {
      newPointsArray.push({ x: pointsArray[i].left, y: pointsArray[i].top });
    }
  }
}

function realignLabel(polygon) {
  const labelShape = getLabelById(polygon.id);
  labelShape.left = polygon.points[0].x - labelProperties.pointOffsetProperties().left;
  labelShape.top = polygon.points[0].y - labelProperties.pointOffsetProperties().top;
}

function completePolygonImpl(polygon, originalPointsArray, finalPoint) {
  const derefPointsArray = originalPointsArray.slice();
  let newPointsArray = [];
  let startingIdOfNewArray = Math.min(initialPoint.pointId, finalPoint.pointId);
  const endingIdIdOfNewArray = Math.max(initialPoint.pointId, finalPoint.pointId);

  const innerArray = [];
  for (let i = startingIdOfNewArray; i < endingIdIdOfNewArray + 1; i += 1) {
    innerArray.push(derefPointsArray[i]);
  }
  const innerArrayDistance = calculateTotalLineDistance(innerArray);

  const outerArray = [];
  for (let i = endingIdIdOfNewArray; i < derefPointsArray.length; i += 1) {
    outerArray.push(derefPointsArray[i]);
  }
  for (let i = 0; i < startingIdOfNewArray + 1; i += 1) {
    outerArray.push(derefPointsArray[i]);
  }
  const outerArrayDistance = calculateTotalLineDistance(outerArray);

  if (innerArrayDistance < outerArrayDistance) {
    startingIdOfNewArray += 1;
    newPointsArray = derefPointsArray.slice(0, startingIdOfNewArray);
    addNewPointsByTheirAddDirection(newPointsArray, initialPoint.pointId, finalPoint.pointId);
    for (let i = endingIdIdOfNewArray; i < derefPointsArray.length; i += 1) {
      newPointsArray.push(derefPointsArray[i]);
    }
  } else {
    newPointsArray = derefPointsArray.slice(startingIdOfNewArray, endingIdIdOfNewArray + 1);
    addNewPointsByTheirAddDirection(newPointsArray, finalPoint.pointId, initialPoint.pointId);
  }
  polygon.set({ points: newPointsArray });
  setInitialStageOfAddPointsOnExistingPolygonMode(canvas);
  clearAllAddPointsDataImpl();
  realignLabel(polygon);
}

export {
  initializeAddNewPointsImpl,
  addFirstPointImpl,
  addPointImpl,
  completePolygonImpl,
  drawLineImpl,
  moveAddablePointImpl,
  addPointsMouseOverImpl,
  resetAddPointPropertiesImpl,
  isAddingPointsToPolygonImpl,
  clearAllAddPointsDataImpl,
  addPointsMouseOutImpl,
  resetAddPointsImpl,
};
