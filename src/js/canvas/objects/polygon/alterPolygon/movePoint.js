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
  polygon.labelOffsetLeft = polygon.left
  - (polygon.points[polygon.labelPointId].x - 10);
  polygon.labelOffsetTop = polygon.top
  - (polygon.points[polygon.labelPointId].y - 12);
  canvas.renderAll();
}

function movePolygonPointImpl(event, polygon, labelObject) {
  const { left } = event.target;
  const { top } = event.target;
  const polygonPoint = event.target;
  polygon.points[polygonPoint.pointId] = {
    x: left, y: top,
  };
  if (labelObject) {
    labelObject.left = left - 5;
    labelObject.top = top - 12;
  }
}

export {
  resetPolygonSelectableAreaImpl, movePolygonPointImpl,
  displayPolygonPointsAfterMoveImpl,
};
