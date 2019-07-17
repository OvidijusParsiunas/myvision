import fabric from 'fabric';
import polygonProperties from './properties';
import { setDrawCursorMode, resetObjectCursors } from '../../mouseInteractions/cursorModes/drawMode';
import { showLabelPopUp } from '../../../tools/labellerPopUp/style';
import { prepareLabelShape } from '../../../tools/labellerPopUp/labellingProcess';
import {
  getMovableObjectsState, getAddingPolygonPointsState,
  setAddingPolygonPointsState, setReadyToDrawShapeState,
} from '../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';

let canvas = null;
let pointArray = [];
let polygonMode = true;
let activeShape = null;
let pointId = 0;
let coordinatesOfLastMouseHover = null;
let invisiblePoint = null;
let drawingFinished = false;
let mouseUpClick = null;

function isRightMouseButtonClicked(pointer) {
  if (activeShape && (coordinatesOfLastMouseHover.x !== pointer.x)) {
    return true;
  }
  return false;
}

function movePoints(event) {
  if (activeShape) {
    const xCenterPoint = event.target.getCenterPoint().x;
    const yCenterPoint = event.target.getCenterPoint().y;
    activeShape.points[event.target.pointId] = {
      x: xCenterPoint, y: yCenterPoint,
    };
  }
}

function drawPolygon(event) {
  if (activeShape) {
    const pointer = canvas.getPointer(event.e);
    coordinatesOfLastMouseHover = pointer;
    const points = activeShape.get('points');
    points[pointArray.length] = {
      x: pointer.x,
      y: pointer.y,
    };
    activeShape.set({
      points,
    });
  }
  canvas.renderAll();
}

function removeActiveShape() {
  canvas.remove(activeShape);
  activeShape = null;
}

function lockMovementIfAssertedByState(polygon) {
  if (!getMovableObjectsState()) {
    const immovableObjectProps = {
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: 'default',
    };
    polygon.set(immovableObjectProps);
  }
}

function generatePolygon(pointer) {
  const points = [];
  pointArray.forEach((point) => {
    points.push({
      x: point.left,
      y: point.top,
    });
    canvas.remove(point);
  });
  canvas.remove(invisiblePoint);
  invisiblePoint = null;

  removeActiveShape();
  const polygon = new fabric.Polygon(points, polygonProperties.newPolygon);

  // find out why on add new polygon points, the cursor changes immediately after adding them

  lockMovementIfAssertedByState(polygon);
  canvas.add(polygon);

  activeShape = null;
  polygonMode = false;
  drawingFinished = true;
  prepareLabelShape(polygon, canvas);
  showLabelPopUp(pointer.x, pointer.y);
}

/* initial point should begin with one color and switch when there are 3
 points to indicate that a new polygon can be created
let points = [pointer.x, pointer.y, pointer.x, pointer.y];
if (pointArray.length === 0) {
  const polygon = new fabric.Polygon(points, polygonProperties.newTempPolygon);
  canvas.add(polygon);
}
if (pointArray.length === 2) {
  pointArray[0].set(polygonProperties.firstPoint);
}
*/

function addPoint(pointer) {
  const point = new fabric.Circle(polygonProperties.newPoint(pointId, pointer));
  pointId += 1;
  let points = [pointer.x, pointer.y, pointer.x, pointer.y];
  if (activeShape) {
    points = activeShape.get('points');
    points.push({
      x: pointer.x,
      y: pointer.y,
    });
    const polygon = new fabric.Polygon(points, polygonProperties.newTempPolygon);
    canvas.remove(activeShape);
    canvas.add(polygon);
    activeShape = polygon;
    canvas.renderAll();
  } else {
    const polyPoint = [{
      x: pointer.x,
      y: pointer.y,
    }];
    const polygon = new fabric.Polygon(polyPoint, polygonProperties.newTempPolygon);
    activeShape = polygon;
    canvas.add(polygon);
  }
  canvas.add(point);
  if (pointArray.length === 0) {
    invisiblePoint = new fabric.Circle(polygonProperties.invisiblePoint(pointer));
    canvas.add(invisiblePoint);
    point.set(polygonProperties.firstPoint);
  }
  pointArray.push(point);
  activeShape.sendToBack();
  canvas.selection = false;
}

function getTempPolygon() {
  if (activeShape) {
    const points = activeShape.get('points');
    points.length -= 1;
    return activeShape;
  }
  return null;
}

function isPolygonDrawingInProgress() {
  return activeShape !== null;
}

function isPolygonDrawingFinished() {
  return drawingFinished;
}

function clearPolygonData() {
  if (pointArray[0]) {
    pointArray.forEach((point) => {
      canvas.remove(point);
    });
    canvas.remove(invisiblePoint);
    invisiblePoint = null;
    removeActiveShape();
    pointArray = [];
    activeShape = null;
    pointId = 0;
    drawingFinished = false;
  }
}

function resetNewPolygonData() {
  if (canvas) resetObjectCursors(canvas);
  clearPolygonData();
}

function changeInitialPointColour(colour) {
  if (pointArray.length > 2) {
    pointArray[0].stroke = colour;
  }
}

function instantiatePolygon(event) {
  const pointer = canvas.getPointer(event.e);
  if (!isRightMouseButtonClicked(pointer)) {
    setReadyToDrawShapeState(false);
    if (event.target && event.target.shapeName && event.target.shapeName === 'invisiblePoint') {
      if (pointArray.length > 2) {
        generatePolygon(pointer);
      }
    } else if (polygonMode) {
      addPoint(pointer);
    }
  }
}

function placeHolderFunc() {}

function assignMouseUpClickFunc() {
  mouseUpClick = placeHolderFunc;
}

function placeholderToAddMouseDownEvents() {
  mouseUpClick();
}

function skipMouseUpEvent() {
  canvas.__eventListeners['mouse:down'] = [];
  canvas.on('mouse:down', (e) => {
    if (!e.target || (e.target && e.target.shapeName !== 'tempPoint')) {
      instantiatePolygon(e);
    }
  });
  assignMouseUpClickFunc();
}

function prepareCanvasForNewPolygon(canvasObj) {
  canvas = canvasObj;
  polygonMode = true;
  drawingFinished = false;
  canvas.discardActiveObject();
  setDrawCursorMode(canvas);
  if (getAddingPolygonPointsState()) {
    setAddingPolygonPointsState(false);
    mouseUpClick = skipMouseUpEvent;
  } else {
    mouseUpClick = placeHolderFunc;
  }
}

function resetDrawPolygonMode() {
  polygonMode = true;
  setReadyToDrawShapeState(true);
  drawingFinished = false;
  clearPolygonData();
  setDrawCursorMode(canvas);
}

function cleanPolygonFromEmptyPoints() {
  const polygonPoints = activeShape.get('points');
  const points = [];
  polygonPoints.forEach((point) => {
    if (Object.keys(point).length > 0) {
      points.push({
        x: point.x,
        y: point.y,
      });
    }
  });
  activeShape.set({
    points,
  });
  canvas.renderAll();

  let currentPointId = 0;
  const tempPointArray = [];
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName === 'point') {
      iteratedObj.set(polygonProperties.changeRemovablePointToTemp(currentPointId));
      if (currentPointId === 0) {
        iteratedObj.set(polygonProperties.firstPoint);
      }
      currentPointId += 1;
      tempPointArray.push(iteratedObj);
    }
  });
  pointArray = tempPointArray;
  pointId = currentPointId;
  canvas.renderAll();

  points[pointArray.length] = {
    x: points[0].x,
    y: points[0].y,
  };
  activeShape.set({
    points,
  });
  canvas.renderAll();
}

function resumeDrawingAfterRemovePoints() {
  cleanPolygonFromEmptyPoints();
  activeShape.numberOfNullPolygonPoints = 0;
  setDrawCursorMode(canvas);
  if (pointArray.length !== 0) {
    const position = { x: pointArray[0].left, y: pointArray[0].top };
    invisiblePoint = new fabric.Circle(polygonProperties.invisiblePoint(position));
    canvas.add(invisiblePoint);
  }
}

function removeInvisiblePoint() {
  canvas.remove(invisiblePoint);
  invisiblePoint = null;
}

export {
  movePoints,
  drawPolygon,
  getTempPolygon,
  instantiatePolygon,
  resetNewPolygonData,
  removeInvisiblePoint,
  resetDrawPolygonMode,
  changeInitialPointColour,
  isPolygonDrawingFinished,
  prepareCanvasForNewPolygon,
  isPolygonDrawingInProgress,
  resumeDrawingAfterRemovePoints,
  placeholderToAddMouseDownEvents,
};
