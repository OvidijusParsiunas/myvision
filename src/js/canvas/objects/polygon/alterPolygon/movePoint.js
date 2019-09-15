import polygonProperties from '../properties';
import { setPolygonLabelOffsetProps } from '../../label/label';
import generatePolygonAfterMove from './resetCoordinatesAfterMove';
import labelProperies from '../../label/properties';

function displayPolygonPointsAfterMoveImpl(canvasObj, polygonObj, polygonPoints) {
  return generatePolygonAfterMove(polygonObj, polygonPoints, canvasObj, polygonProperties);
}

// removing, moving point then moving shape, problems here

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
  setPolygonLabelOffsetProps(polygon, polygon.points[0]);
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
    labelObject.left = left - labelProperies.pointOffsetProperties().left;
    labelObject.top = top - labelProperies.pointOffsetProperties().top;
  }
}

export {
  resetPolygonSelectableAreaImpl, movePolygonPointImpl,
  displayPolygonPointsAfterMoveImpl,
};
