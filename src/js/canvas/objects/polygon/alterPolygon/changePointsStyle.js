import fabric from 'fabric';
import polygonProperties from '../properties';

function displayPolygonPointsWithStyleImpl(canvas, polygon, polygonPoints, polygonPointsProps) {
  let pointId = 0;
  polygon.get('points').forEach((point) => {
    const pointObj = new fabric.Circle(polygonPointsProps(pointId, point));
    canvas.add(pointObj);
    polygonPoints.push(pointObj);
    pointId += 1;
  });
}

function changeDrawingPolygonPointsToRemovableImpl(canvas) {
  let pointId = 0;
  const polygonPoints = [];
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName === 'tempPoint' || iteratedObj.shapeName === 'firstPoint') {
      iteratedObj.set(polygonProperties.removablePolygonPoint(pointId));
      polygonPoints.push(iteratedObj);
      pointId += 1;
    }
  });
  return polygonPoints;
}

function changePolygonPointsPropertiesToDefaultImpl(canvas) {
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName === 'bndBox') {
      iteratedObj.selectable = true;
    } else {
      iteratedObj.lockMovementX = false;
      iteratedObj.lockMovementY = false;
    }
    if (iteratedObj.shapeName === 'point') {
      iteratedObj.set(polygonProperties.defaultPoint);
    }
  });
}

export {
  displayPolygonPointsWithStyleImpl,
  changeDrawingPolygonPointsToRemovableImpl,
  changePolygonPointsPropertiesToDefaultImpl,
};
