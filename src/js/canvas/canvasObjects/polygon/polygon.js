import fabric from 'fabric';
import polygonProperties from './polygonProperties';
import { prepareLabelShape } from '../../labelPopUp/labelShape';
import { showLabelPopUp } from '../../labelPopUp/manipulateLabelPopUp';
import setDrawCursorMode from '../../../mouseEvents/canvas/cursorModes/drawMode';

let canvas = null;
let pointArray = [];
let lineArray = [];
let polygonMode = true;
let activeLine = null;
let activeShape = false;
let pointId = 0;

function movePoints(event) {
  if (activeShape) {
    const xCenterPoint = event.target.getCenterPoint().x;
    const yCenterPoint = event.target.getCenterPoint().y;
    activeShape.points[event.target.pointId] = {
      x: xCenterPoint, y: yCenterPoint,
    };
    lineArray[event.target.pointId - 1].set({ x2: xCenterPoint, y2: yCenterPoint });
    lineArray[event.target.pointId].set({ x1: xCenterPoint, y1: yCenterPoint });
  }
}

function drawPolygon(event) {
  if (activeLine && activeLine.class === 'line') {
    const pointer = canvas.getPointer(event.e);
    activeLine.set({ x2: pointer.x, y2: pointer.y });
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

function removeActiveLinesAndShape() {
  lineArray.forEach((line) => {
    canvas.remove(line);
  });
  canvas.remove(activeShape).remove(activeLine);
}

function generatePolygon(event) {
  const points = [];
  pointArray.forEach((point) => {
    points.push({
      x: point.left,
      y: point.top,
    });
    canvas.remove(point);
  });
  removeActiveLinesAndShape();
  const polygon = new fabric.Polygon(points, polygonProperties.newPolygon);
  canvas.add(polygon);

  activeLine = null;
  activeShape = null;
  polygonMode = false;
  const pointer = canvas.getPointer(event.e);
  prepareLabelShape(polygon, canvas);
  showLabelPopUp(pointer.x, pointer.y);
}

function addPoint(event) {
  const pointer = canvas.getPointer(event.e);
  const point = new fabric.Circle(polygonProperties.newPoint(pointId, event, canvas));
  pointId += 1;
  if (pointArray.length === 0) {
    point.set(polygonProperties.firstPoint);
  }
  let points = [pointer.x, pointer.y, pointer.x, pointer.y];
  const line = new fabric.Line(points, polygonProperties.newLine);
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
  activeLine = line;

  canvas.add(activeLine);

  pointArray.push(point);
  lineArray.push(line);
  canvas.add(point);
  canvas.selection = false;
}

function getTempPolygon() {
  canvas.remove(activeLine);
  const points = activeShape.get('points');
  points.length -= 1;
  return activeShape;
}

function getLineArray() {
  return lineArray;
}

function clearPolygonData() {
  if (pointArray[0]) {
    pointArray.forEach((point) => {
      canvas.remove(point);
    });
    removeActiveLinesAndShape();
    pointArray = [];
    lineArray = [];
    activeShape = null;
    activeLine = null;
    pointId = 0;
  }
}

function instantiatePolygon(event) {
  if (event.target && event.target.shapeName && event.target.shapeName === 'firstPoint') {
    generatePolygon(event);
  }
  if (polygonMode) {
    addPoint(event);
  }
}

function prepareCanvasForNewPolygon(canvasObj) {
  canvas = canvasObj;
  polygonMode = true;
  clearPolygonData();
  canvas.discardActiveObject();
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

  activeLine.set({ x2: points[0].x, y2: points[0].y });
  points[pointArray.length] = {
    x: points[0].x,
    y: points[0].y,
  };
  activeShape.set({
    points,
  });
  canvas.renderAll();
  setDrawCursorMode(canvas, true);
  canvas.renderAll();
}

function resumeDrawCanvasPolygon() {
  cleanPolygonFromEmptyPoints();
}

export {
  instantiatePolygon,
  drawPolygon,
  prepareCanvasForNewPolygon,
  resumeDrawCanvasPolygon,
  clearPolygonData,
  movePoints,
  getTempPolygon,
  getLineArray,
};
