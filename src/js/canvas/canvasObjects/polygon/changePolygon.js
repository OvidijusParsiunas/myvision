import fabric from 'fabric';
import polygonProperties from "./polygonProperties";

let selectedPolygon;
let selectedPolygonText;
let selectedPolygonPoints;
let canvas;
let polygon;

function displayPolygonPoints(canvasObj, polygonObject) {
  canvas = canvasObj;
  polygon = polygonObject;
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
  let left = event.target.left;
  let top = event.target.top;
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
  displayPolygonPoints, hidePolygonPoints,
  movePolygonPoint, finishEditingPolygon,
};
