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
    activeShape.points[event.target.pointId] = {
      x: event.target.getCenterPoint().x, y: event.target.getCenterPoint().y,
    };
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

  pointArray.push(point);
  lineArray.push(line);
  canvas.add(point);
  canvas.selection = false;
}

function getTempPolygon() {
  const points = activeShape.get('points');
  points.length -= 1;
  return activeShape;
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
  const tempPointArray = [];
  polygonPoints.forEach((point) => {
    if (Object.keys(point).length > 0) {
      points.push({
        x: point.x,
        y: point.y,
      });
      tempPointArray.push({
        left: point.x,
        top: point.y,
      });
    }
  });
  activeShape.set({
    points,
  });
  pointArray = tempPointArray;
  canvas.renderAll();

  const tempPointX = points[0].x - points[points.length - 1].x;
  const tempPointY = points[0].y - points[points.length - 1].y;
  activeLine.set({ x2: Math.abs(tempPointX), y2: Math.abs(tempPointY) });
  points[pointArray.length] = {
    x: tempPointX,
    y: tempPointY,
  };
  activeShape.set({
    points,
  });
  canvas.renderAll();
}

function resumeDrawCanvasPolygon() {
  cleanPolygonFromEmptyPoints();
  let currentPointId = 0;
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName === 'point') {
      iteratedObj.set(polygonProperties.changeRemovablePointToTemp(currentPointId));
      if (currentPointId === 0) {
        iteratedObj.set(polygonProperties.firstPoint);
      }
      currentPointId += 1;
    }
  });
  canvas.renderAll();
}

export {
  instantiatePolygon,
  drawPolygon,
  prepareCanvasForNewPolygon,
  resumeDrawCanvasPolygon,
  clearPolygonData,
  movePoints,
  getTempPolygon,
};
