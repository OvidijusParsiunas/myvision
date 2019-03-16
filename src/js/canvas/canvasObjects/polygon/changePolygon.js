import fabric from 'fabric';
import polygonProperties from './polygonProperties';
import generatePolygonAfterMove from './movedPolygonUtils/generatePolygonAfterMove';

let canvas;
let polygon;
let polygonPoints = [];
const alternatePolygonPoints = [];

function generatePolygonPoints() {
  let pointId = 0;
  polygon.get('points').forEach((point) => {
    const circle = new fabric.Circle(polygonProperties.existingPolygonCircle(pointId, point));
    canvas.add(circle);
    polygonPoints.push(circle);
    pointId += 1;
  });
}

function generatePolygonPointsAfterMove() {
  polygon = generatePolygonAfterMove(polygon, polygonPoints, canvas, polygonProperties);
}

function setSelectedObjects(activeCanvasObj, activePolygonObject) {
  canvas = activeCanvasObj;
  polygon = activePolygonObject;
}

function setEditablePolygon(canvasObj, polygonObj) {
  setSelectedObjects(canvasObj, polygonObj);
  canvasObj.discardActiveObject();
  generatePolygonPoints();
}

function setEditablePolygonAfterMoving(canvasObj, polygonObj) {
  setSelectedObjects(canvasObj, polygonObj);
  canvasObj.discardActiveObject();
  generatePolygonPointsAfterMove();
}

function removePolygonPoints() {
  polygonPoints.forEach((point) => {
    canvas.remove(point);
    alternatePolygonPoints.push(point);
  });
  canvas.renderAll();
  polygonPoints = [];
}

function resetPolygonSelectableArea() {
  const newPosition = polygon._calcDimensions();
  polygon.set({
    left: newPosition.left,
    top: newPosition.top,
    height: newPosition.height,
    width: newPosition.width,
    pathOffset: {
      x: newPosition.left + newPosition.width / 2,
      y: newPosition.top + newPosition.height / 2,
    },
  });
  polygon.setCoords();
  canvas.renderAll();
}

function movePolygonPoint(event) {
  const { left } = event.target;
  const { top } = event.target;
  const polygonPoint = event.target;
  polygon.points[polygonPoint.pointId] = {
    x: left, y: top,
  };
}

function finishEditingPolygon() {
  // canvas.remove(selectedPolygon);
  // canvas.remove(selectedPolygonText);
  // selectedPolygonPoints.forEach((point) => {
  //   canvas.remove(point);
  // });
}

function hidePolygonPoints() {
  // wsadasdasd
}

export {
  setEditablePolygon, hidePolygonPoints,
  movePolygonPoint, finishEditingPolygon,
  removePolygonPoints, generatePolygonPointsAfterMove,
  setEditablePolygonAfterMoving, resetPolygonSelectableArea,
};
