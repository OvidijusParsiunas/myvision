import polygonProperties from '../properties.js';
import { setPolygonLabelOffsetProps } from '../../label/label.js';
import { generatePolygonAfterMove } from './resetCoordinatesAfterMove.js';
import labelProperies from '../../label/properties.js';

function displayPolygonPointsAfterMoveImpl(canvasObj, polygonObj, polygonPoints) {
  return generatePolygonAfterMove(polygonObj, polygonPoints, canvasObj, polygonProperties);
}

function resetPolygonSelectableAreaImpl(canvas, polygon) {
  const newPosition = polygon._calcDimensions();
  const newPolygonProperties = {
    height: newPosition.height,
    width: newPosition.width,
    pathOffset: {
      x: newPosition.left + newPosition.width / 2,
      y: newPosition.top + newPosition.height / 2,
    },
  };
  if (polygon.polygonMoved) {
    const polygonPadding = polygonProperties.getPolygonAlignmentAfterPointMove();
    newPolygonProperties.left = newPosition.left + polygonPadding;
    newPolygonProperties.top = newPosition.top + polygonPadding;
  } else {
    newPolygonProperties.left = newPosition.left;
    newPolygonProperties.top = newPosition.top;
  }
  polygon.set(
    newPolygonProperties,
  );
  polygon.setCoords();
  setPolygonLabelOffsetProps(polygon, polygon.points[0]);
  canvas.renderAll();
}

function movePolygonPointImpl(event, polygon, labelObject) {
  const { left } = event.target;
  const { top } = event.target;
  const polygonPoint = event.target;
  if (polygon.polygonMoved) {
    const polygonPadding = polygonProperties.getPolygonAlignmentAfterPointMove();
    polygon.points[polygonPoint.pointId] = {
      x: left - polygonPadding, y: top - polygonPadding,
    };
  } else {
    polygon.points[polygonPoint.pointId] = {
      x: left, y: top,
    };
  }
  if (labelObject) {
    labelObject.left = left - labelProperies.pointOffsetProperties().left;
    labelObject.top = top - labelProperies.pointOffsetProperties().top;
  }
}

export {
  resetPolygonSelectableAreaImpl, movePolygonPointImpl,
  displayPolygonPointsAfterMoveImpl,
};
