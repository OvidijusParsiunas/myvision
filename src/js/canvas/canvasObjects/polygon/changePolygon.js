import fabric from 'fabric';
import polygonProperties from './polygonProperties';

let selectedPolygon;
let selectedPolygonText;
let selectedPolygonPoints;
let canvas;
let polygon;
const polygonPoints = [];

function generatePolygonPointsOnCanvas() {
  let circleId = 0;
  polygon.get('points').forEach((point) => {
    const circle = new fabric.Circle(polygonProperties.existingPolygonCircle(circleId, point));
    canvas.add(circle);
    polygonPoints.push(circle);
    circleId += 1;
  });
}

function setActiveObjects(activeCanvasObj, activePolygonObject) {
  canvas = activeCanvasObj;
  polygon = activePolygonObject;
}

function setEditablePolygon(canvasObj, polygonObject) {
  setActiveObjects(canvasObj, polygonObject);
  canvasObj.discardActiveObject();
  generatePolygonPointsOnCanvas();
}

function displayPolygonPoints() {
  generatePolygonPointsOnCanvas();
}

function removePolygonPoints() {
  polygonPoints.forEach((point) => {
    canvas.remove(point);
  });
  canvas.renderAll();
}

function hidePolygonPoints() {

}

function movePolygonPoint(event) {
  const { left } = event.target;
  const { top } = event.target;
  const polygonPoint = event.target;
  polygon.points[polygonPoint.circleId] = {
    x: left, y: top,
  };
  canvas.renderAll();
}

function finishEditingPolygon() {
  canvas.remove(selectedPolygon);
  canvas.remove(selectedPolygonText);
  selectedPolygonPoints.forEach((point) => {
    canvas.remove(point);
  });
}

export {
  setEditablePolygon, hidePolygonPoints,
  movePolygonPoint, finishEditingPolygon,
  removePolygonPoints, displayPolygonPoints,
};
