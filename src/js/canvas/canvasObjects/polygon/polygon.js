import fabric from 'fabric';
import polygonProperties from './polygonProperties';
import { prepareLabelShape } from '../../labelPopUp/labelShape';
import { showLabelPopUp } from '../../labelPopUp/manipulateLabelPopUp';
import setDrawCursorMode from '../../../mouseEvents/canvas/cursorModes/drawMode';

let canvas = null;
let pointArray = [];
let polygonMode = true;
let activeShape = false;
let pointId = 0;

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
  removeActiveShape();
  const polygon = new fabric.Polygon(points, polygonProperties.newPolygon);
  canvas.add(polygon);

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

  pointArray.push(point);
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
    removeActiveShape();
    pointArray = [];
    activeShape = null;
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
};
