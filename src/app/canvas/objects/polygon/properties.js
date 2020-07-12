const polygonProperties = {};

let pointStrokedWidth = 0.5;
let augmentPolygonPointRadius = 4;
let defaultPointRadius = 3.5;
let invisiblePointRadius = 3.9;
let disabledNewPointRadius = 3.7;
let disabledAddPointRadius = 3;
let disabledRemovePointRadius = 3.7;
let newPolygonStrokeWidth = 1.75;
let tempPolygonStrokeWidth = 0.8;
let newLineStrokeWidth = 1.1;
let polygonPadding = 0;

function setZoomInProperties(pointRatio, polygonRatio) {
  defaultPointRadius -= defaultPointRadius * pointRatio;
  pointStrokedWidth -= pointStrokedWidth * pointRatio;
  augmentPolygonPointRadius -= augmentPolygonPointRadius * pointRatio;
  invisiblePointRadius -= invisiblePointRadius * pointRatio;
  disabledNewPointRadius -= disabledNewPointRadius * pointRatio;
  disabledAddPointRadius -= disabledAddPointRadius * pointRatio;
  disabledRemovePointRadius -= disabledRemovePointRadius * pointRatio;
  newPolygonStrokeWidth -= newPolygonStrokeWidth * polygonRatio;
  tempPolygonStrokeWidth -= tempPolygonStrokeWidth * polygonRatio;
  newLineStrokeWidth -= newLineStrokeWidth * polygonRatio;
  polygonPadding += 0.05;
}

function setZoomOutProperties(pointRatio, polygonRatio) {
  pointStrokedWidth *= pointRatio;
  augmentPolygonPointRadius *= polygonRatio;
  defaultPointRadius *= pointRatio;
  invisiblePointRadius *= pointRatio;
  disabledNewPointRadius *= pointRatio;
  disabledAddPointRadius *= pointRatio;
  disabledRemovePointRadius *= pointRatio;
  newPolygonStrokeWidth *= polygonRatio;
  tempPolygonStrokeWidth *= polygonRatio;
  newLineStrokeWidth *= polygonRatio;
  polygonPadding -= 0.05;
}

function generateNewPoint(pointId, pointer, isNewPoint) {
  return {
    radius: defaultPointRadius,
    fill: '#ffffff',
    stroke: '#333333',
    strokeWidth: pointStrokedWidth,
    left: pointer.x,
    top: pointer.y,
    selectable: true,
    hasBorders: false,
    hasControls: false,
    originX: 'center',
    originY: 'center',
    shapeName: 'tempPoint',
    pointId,
    objectCaching: false,
    hoverCursor: isNewPoint ? 'default' : 'move',
  };
}

function generateInvisiblePoint(pointer) {
  return {
    radius: invisiblePointRadius,
    fill: 'green',
    stroke: '#333333',
    left: pointer.x,
    top: pointer.y,
    selectable: true,
    hasBorders: false,
    hasControls: false,
    originX: 'center',
    originY: 'center',
    shapeName: 'invisiblePoint',
    objectCaching: false,
    opacity: 0,
    hoverCursor: 'default',
  };
}

function changeRemovablePointToTemp(pointId) {
  return {
    radius: defaultPointRadius,
    fill: '#ffffff',
    stroke: '#333333',
    strokeWidth: pointStrokedWidth,
    selectable: true,
    shapeName: 'tempPoint',
    pointId,
    lockMovementX: false,
    lockMovementY: false,
    hoverCursor: 'move',
  };
}

function generateExistingPolygonPoint(pointId, pointCoordinates) {
  return {
    radius: defaultPointRadius,
    fill: 'blue',
    stroke: '#333333',
    strokeWidth: pointStrokedWidth,
    left: pointCoordinates.x,
    top: pointCoordinates.y,
    selectable: true,
    hasBorders: false,
    hasControls: false,
    originX: 'center',
    originY: 'center',
    shapeName: 'point',
    objectCaching: false,
    pointId,
    perPixelTargetFind: true,
    hoverCursor: 'move',
  };
}

function generateRemovablePolygonPoint(pointId, pointCoordinates, totalPointNumber) {
  const returnObj = {
    radius: augmentPolygonPointRadius,
    fill: 'red',
    stroke: '#333333',
    strokeWidth: pointStrokedWidth,
    selectable: true,
    hasBorders: false,
    hasControls: false,
    originX: 'center',
    originY: 'center',
    shapeName: 'point',
    objectCaching: false,
    pointId,
    perPixelTargetFind: true,
    lockMovementX: true,
    lockMovementY: true,
    hoverCursor: 'default',
  };
  if (pointCoordinates) {
    returnObj.left = pointCoordinates.x;
    returnObj.top = pointCoordinates.y;
    if (totalPointNumber < 4) {
      returnObj.fill = 'black';
      returnObj.radius = disabledNewPointRadius;
    }
  }
  return returnObj;
}

function generatestartingAddPolygonPoint(pointId, pointCoordinates) {
  const returnObj = {
    radius: augmentPolygonPointRadius,
    fill: 'green',
    stroke: '#333333',
    strokeWidth: pointStrokedWidth,
    selectable: true,
    hasBorders: false,
    hasControls: false,
    originX: 'center',
    originY: 'center',
    shapeName: 'point',
    objectCaching: false,
    pointId,
    perPixelTargetFind: true,
    lockMovementX: true,
    lockMovementY: true,
  };
  if (pointCoordinates) {
    returnObj.left = pointCoordinates.x;
    returnObj.top = pointCoordinates.y;
  }
  return returnObj;
}

function generateNewPolygon() {
  return {
    stroke: 'hsla(186, 8%, 50%, 1)',
    strokeWidth: newPolygonStrokeWidth,
    fill: 'rgba(237, 237, 237, 0.01)',
    perPixelTargetFind: true,
    hasBorders: false,
    hasControls: false,
    shapeName: 'polygon',
    selectable: false,
    evented: true,
    objectCaching: false,
    numberOfNullPolygonPoints: 0,
  };
}

function generateNewTempPolygon() {
  return {
    stroke: '#333333',
    strokeWidth: tempPolygonStrokeWidth,
    fill: '#cccccc',
    opacity: 0.3,
    selectable: false,
    hasBorders: false,
    hasControls: false,
    evented: false,
    objectCaching: false,
    numberOfNullPolygonPoints: 0,
    shapeName: 'tempPolygon',
  };
}

function generateNewLine() {
  return {
    strokeWidth: newLineStrokeWidth,
    fill: '#999999',
    stroke: '#999999',
    class: 'line',
    originX: 'center',
    originY: 'center',
    selectable: false,
    hasBorders: false,
    hasControls: false,
    evented: false,
    objectCaching: false,
    shapeName: 'addPointsLine',
  };
}

function generateNewFirstPoint() {
  return {
    fill: 'red',
    shapeName: 'firstPoint',
    lockMovementX: true,
    lockMovementY: true,
  };
}

function generateRemovablePoint() {
  return {
    radius: augmentPolygonPointRadius,
    fill: 'red',
    selectable: true,
  };
}

function generateDefaultPoint() {
  return {
    fill: 'blue',
    radius: defaultPointRadius,
    hoverCursor: 'move',
  };
}

function generateAdditionalPoint() {
  return {
    fill: 'green',
    radius: augmentPolygonPointRadius,
    hoverCursor: 'default',
  };
}

function generateDisabledAddPoint() {
  return {
    fill: 'white',
    radius: disabledAddPointRadius,
  };
}

function generateDisabledRemovePoint() {
  return {
    fill: 'black',
    radius: disabledRemovePointRadius,
  };
}

function generateSelectedStartingAddPoint() {
  return {
    shapeName: 'initialAddPoint',
    radius: defaultPointRadius,
  };
}

function getPolygonAlignmentAfterPointMove() {
  return polygonPadding;
}

(function setProperties() {
  polygonProperties.newPolygon = generateNewPolygon;
  polygonProperties.newTempPolygon = generateNewTempPolygon;
  polygonProperties.newLine = generateNewLine;
  polygonProperties.firstPoint = generateNewFirstPoint;
  polygonProperties.removablePoint = generateRemovablePoint;
  polygonProperties.defaultPoint = generateDefaultPoint;
  polygonProperties.additionalPoint = generateAdditionalPoint;
  polygonProperties.disabledAddPoint = generateDisabledAddPoint;
  polygonProperties.disabledRemovePoint = generateDisabledRemovePoint;
  polygonProperties.selectedStartingAddPoint = generateSelectedStartingAddPoint;
  polygonProperties.newPoint = generateNewPoint;
  polygonProperties.invisiblePoint = generateInvisiblePoint;
  polygonProperties.changeRemovablePointToTemp = changeRemovablePointToTemp;
  polygonProperties.existingPolygonPoint = generateExistingPolygonPoint;
  polygonProperties.removablePolygonPoint = generateRemovablePolygonPoint;
  polygonProperties.startingAddPolygonPoint = generatestartingAddPolygonPoint;
  polygonProperties.setZoomInProperties = setZoomInProperties;
  polygonProperties.setZoomOutProperties = setZoomOutProperties;
  polygonProperties.getPolygonAlignmentAfterPointMove = getPolygonAlignmentAfterPointMove;
}());

export { polygonProperties as default };
