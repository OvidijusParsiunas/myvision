import fabric from 'fabric';
import polygonProperties from "./polygonProperties";

let selectedPolygon;
let selectedPolygonText;
let selectedPolygonPoints;
let canvas;
let polygon;
let currentPoints;

function displayPolygonPoints(canvasObj, polygonObject) {
  canvas = canvasObj;
  polygon = polygonObject;
  canvasObj.renderAll();
}

function hidePolygonPoints() {
  if (selectedPolygonPoints) {
    selectedPolygonPoints.forEach((point) => {
      point.set('visible', false);
    });
    canvas.renderAll();
  }
}

function movePolygonPoint(event) {
  const pointer = canvas.getPointer(event.e);
  const polygonPoint = event.target;
  polygon.points[polygonPoint.circleId] = {
    x: pointer.x, y: pointer.y,
  };
  polygon = polygon.points;
  currentPoints = pointer.x;
  currentPoints = pointer.x;
}

function finishEditingPolygon() {
  canvas.remove(selectedPolygon);
  canvas.remove(selectedPolygonText);
  selectedPolygonPoints.forEach((point) => {
    canvas.remove(point);
  });
}

export {
  displayPolygonPoints, hidePolygonPoints,
  movePolygonPoint, finishEditingPolygon,
};
