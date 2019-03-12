import fabric from 'fabric';
import polygonProperties from './polygonProperties';

let selectedPolygon;
let selectedPolygonText;
let selectedPolygonPoints;
let canvas;
let polygon;

function generatePolygonPointsOnCanvas() {
  let circleId = 0;
  polygon.get('points').forEach((point) => {
    const circle = new fabric.Circle(polygonProperties.existingPolygonCircle(circleId, point));
    canvas.add(circle);
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

function hidePolygonPoints() {
  if (selectedPolygonPoints) {
    selectedPolygonPoints.forEach((point) => {
      point.set('visible', false);
    });
    canvas.renderAll();
  }
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
};
