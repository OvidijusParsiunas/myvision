import fabric from 'fabric';
import polygonProperties from '../properties';
import {
  prepareObjectsForEditablePolygonPoints, setObjectPropertiesToDefault,
} from '../../objectsProperties/changeProperties';

function displayPolygonPointsWithStyleImpl(canvas, polygon, polygonPoints, polygonPointsProps) {
  let pointId = 0;
  polygon.get('points').forEach((point) => {
    const pointObj = new fabric.Circle(polygonPointsProps(pointId, point));
    canvas.add(pointObj);
    polygonPoints.push(pointObj);
    pointId += 1;
  });
}

function changePolygonPointsToWaitForAddingFirstPointImpl(canvas) {
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName === 'point') {
      iteratedObj.set(polygonProperties.disabledButton);
      iteratedObj.selectable = false;
    }
  });
  canvas.renderAll();
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

function changeObjectsToPolygonPointsToDefaultImpl(canvas) {
  canvas.forEachObject((iteratedObj) => {
    setObjectPropertiesToDefault(iteratedObj);
    if (iteratedObj.shapeName === 'point') {
      iteratedObj.set(polygonProperties.defaultPoint);
    }
  });
}

function changeObjectsToPolygonPointsRemovaleImpl(canvas) {
  canvas.forEachObject((iteratedObj) => {
    prepareObjectsForEditablePolygonPoints(iteratedObj);
    if (iteratedObj.shapeName === 'point') {
      iteratedObj.set(polygonProperties.removablePoint);
    }
  });
  canvas.renderAll();
}

export {
  displayPolygonPointsWithStyleImpl,
  changePolygonPointsToWaitForAddingFirstPointImpl,
  changeDrawingPolygonPointsToRemovableImpl,
  changeObjectsToPolygonPointsToDefaultImpl,
  changeObjectsToPolygonPointsRemovaleImpl,
};
