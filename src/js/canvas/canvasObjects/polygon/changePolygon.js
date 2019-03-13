import fabric from 'fabric';
import polygonProperties from './polygonProperties';

let selectedPolygon;
let selectedPolygonText;
let selectedPolygonPoints;
let canvas;
let polygon;
let polygonPoints = [];
let alternatePolygonPoints = [];
let matrix;

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
  let polygonAreaPoints = [];
  const polygon2 = new fabric.Polygon([], polygonProperties.newPolygon);
  canvas.add(polygon2);
  canvas.discardActiveObject();

  matrix = polygon.calcTransformMatrix();
  const transformedPoints = polygon.get('points')
    .map(p => new fabric.Point(
      p.x - polygon.pathOffset.x,
      p.y - polygon.pathOffset.y,
    ))
    .map(p => fabric.util.transformPoint(p, matrix));
    let circleId = 0;
    transformedPoints.map(p => {
    const circle = new fabric.Circle(polygonProperties.existingPolygonCircle(circleId, p))
    canvas.add(circle);
    polygonPoints.push(circle);
    polygonAreaPoints.push({x: circle.left, y: circle.top-1.5});
    circleId += 1;
});
polygon2.set({'id': polygon.id, 'selectable': true});
canvas.remove(polygon);
polygon = polygon2;
polygon.set('points', polygonAreaPoints);
let newPosition = polygon._calcDimensions();
polygon.set({
  left: newPosition.left,
  top: newPosition.top,
  height: newPosition.height,
  width: newPosition.width,
  pathOffset: {
      x: newPosition.left + newPosition.width / 2,
      y: newPosition.top + newPosition.height / 2
  }
});
polygon.setCoords();
canvas.renderAll();
}

function removePolygonPoints() {
  polygonPoints.forEach((point) => {
    canvas.remove(point);
    alternatePolygonPoints.push(point);
  });
  canvas.renderAll();
  polygonPoints = [];
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
  let newPosition = polygon._calcDimensions();
  console.log(newPosition);
  polygon.set({
    left: newPosition.left,
    top: newPosition.top,
    height: newPosition.height,
    width: newPosition.width,
    pathOffset: {
        x: newPosition.left + newPosition.width / 2,
        y: newPosition.top + newPosition.height / 2
    }
});
polygon.setCoords();
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
