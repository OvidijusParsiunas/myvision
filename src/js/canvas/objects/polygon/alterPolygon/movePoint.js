import polygonProperties from '../properties';
import generatePolygonAfterMove from './resetCoordinatesAfterMove';

function displayPolygonPointsAfterMoveImpl(canvasObj, polygonObj, polygonPoints) {
  return generatePolygonAfterMove(polygonObj, polygonPoints, canvasObj, polygonProperties);
}

function resetPolygonSelectableAreaImpl(canvas, polygon) {
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

function movePolygonPointImpl(event, polygon, labelObject) {
  const { left } = event.target;
  const { top } = event.target;
  const polygonPoint = event.target;
  polygon.points[polygonPoint.pointId] = {
    x: left, y: top,
  };
  labelObject.left = left - 5;
  labelObject.top = top - 12;
}

export {
  resetPolygonSelectableAreaImpl, movePolygonPointImpl,
  displayPolygonPointsAfterMoveImpl,
};
