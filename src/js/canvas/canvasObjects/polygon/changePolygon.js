import fabric from 'fabric';
import polygonProperties from './polygonProperties';
import generatePolygonAfterMove from './movedPolygonUtils/generatePolygonAfterMove';

let canvas = null;
let polygon = null;
let polygonPoints = [];
let editingPolygon = false;

function getPolygonEditingStatus() {
  return editingPolygon;
}

function sendPolygonPointsToFront() {
  canvas.discardActiveObject();
  polygonPoints.forEach((point) => {
    if (point) {
      point.bringForward();
    }
  });
  editingPolygon = true;
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

function displayRemovablePolygonPoints() {
  let pointId = 0;
  polygon.get('points').forEach((point) => {
    const pointObj = new fabric.Circle(polygonProperties.removablePolygonPoint(pointId, point));
    canvas.add(pointObj);
    polygonPoints.push(pointObj);
    pointId += 1;
  });
}

function changePolygonPointsToRemovable() {
  let pointId = 0;
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName === 'tempPoint' || iteratedObj.shapeName === 'firstPoint') {
      iteratedObj.set(polygonProperties.removablePolygonPoint(pointId));
      polygonPoints.push(iteratedObj);
      pointId += 1;
    }
  });
}

function displayPolygonPointsAfterMove() {
  polygon = generatePolygonAfterMove(polygon, polygonPoints, canvas, polygonProperties);
  editingPolygon = true;
}

function setSelectedObjects(activeCanvasObj, activePolygonObject) {
  canvas = activeCanvasObj;
  polygon = activePolygonObject;
}

function setEditablePolygon(canvasObj, polygonObj, removablePoints, creatingPolygon) {
  setSelectedObjects(canvasObj, polygonObj);
  canvasObj.discardActiveObject();
  // edit this
  if (!removablePoints) {
    displayPolygonPoints();
  } else if (!creatingPolygon) {
    displayRemovablePolygonPoints();
  } else {
    changePolygonPointsToRemovable();
  }
  editingPolygon = true;
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
  editingPolygon = false;
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

function removePolygonPoint(pointId) {
  console.log(polygon.points);
  console.log(`point id ${pointId}`);
  if (polygon.points.length - polygon.numberOfNullPolygonPoints > 3) {
    if (Object.keys(polygon.points[pointId]).length === 0) {
      /* when the last polygons are removed, the ones before it are moved
      // to the last position - thus causing the possibility of getting nulls
       TIP - when point is null - it was already moved to the last element */
      for (let i = pointId - 1; i > -1; i -= 1) {
        if (Object.keys(polygon.points[i]).length !== 0) {
          polygon.points[polygon.points.length - 1] = polygon.points[i];
          polygon.points[i] = {};
          break;
        }
      }
    } else if ((polygon.points.length - 1) === pointId) {
      /* when last element - remove and find the next not null below it to
      to be the last element in order to enable the polygon to stay */
      for (let i = pointId - 1; i > -1; i -= 1) {
        if (Object.keys(polygon.points[i]).length !== 0) {
          polygon.points[pointId] = polygon.points[i];
          polygon.points[i] = {};
          break;
        }
      }
    } else {
      polygon.points[pointId] = {};
    }
    canvas.remove(polygonPoints[pointId]);
    polygonPoints[pointId] = null;
    polygon.numberOfNullPolygonPoints += 1;
    if (polygon.points.length - polygon.numberOfNullPolygonPoints > 3) {
      // after all polygon points are removed from new polygon, completely remove -
      // depending on how we add new points

      // attempt to remove lines when deleting/editing
      // the event files are temporarily swapped
      // change cursor modes name convention
      // make invisible circle width a little bit bigger
      // make sure to test with thresholded performance
      console.log('need to signal restrictions');
    }
    canvas.renderAll();
  }
}

export {
  setEditablePolygon, resetPolygonSelectableArea,
  movePolygonPoint, sendPolygonPointsToFront,
  removePolygonPoints, displayPolygonPointsAfterMove,
  setEditablePolygonAfterMoving, removePolygon,
  removePolygonPoint, getPolygonEditingStatus,
  displayRemovablePolygonPoints,
};
