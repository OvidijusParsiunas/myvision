import fabric from 'fabric';
import polygonProperties from './polygonProperties';
import generatePolygonAfterMove from './movedPolygonUtils/generatePolygonAfterMove';

let canvas = null;
let polygon = null;
let polygonPoints = [];

function sendPolygonPointsToFront() {
  canvas.discardActiveObject();
  polygonPoints.forEach((point) => {
    point.bringForward();
  });
}

function displayPolygonPoints() {
  let pointId = 0;
  polygon.get('points').forEach((point) => {
    const pointObj = new fabric.Circle(polygonProperties.existingPolygonPoint(pointId, point));
    canvas.add(pointObj);
    polygonPoints.push(pointObj);
    pointId += 1;
  });
}

function displayPolygonPointsAfterMove() {
  polygon = generatePolygonAfterMove(polygon, polygonPoints, canvas, polygonProperties);
}

function setSelectedObjects(activeCanvasObj, activePolygonObject) {
  canvas = activeCanvasObj;
  polygon = activePolygonObject;
}

function setEditablePolygon(canvasObj, polygonObj) {
  setSelectedObjects(canvasObj, polygonObj);
  canvasObj.discardActiveObject();
  displayPolygonPoints();
}

function setEditablePolygonAfterMoving(canvasObj, polygonObj) {
  setSelectedObjects(canvasObj, polygonObj);
  canvasObj.discardActiveObject();
  displayPolygonPointsAfterMove();
}

function removePolygonPoints() {
  if (polygonPoints.length !== 0) {
    polygonPoints.forEach((point) => {
      canvas.remove(point);
    });
    canvas.renderAll();
    polygonPoints = [];
  }
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

function removePolygon() {
  if (polygon) {
    canvas.remove(polygon);
  }
}

export {
  setEditablePolygon, resetPolygonSelectableArea,
  movePolygonPoint, sendPolygonPointsToFront,
  removePolygonPoints, displayPolygonPointsAfterMove,
  setEditablePolygonAfterMoving, removePolygon,
};
