const polygonProperties = {};

function generateNewPoint(pointId, pointer) {
  return {
    radius: 3.5,
    fill: '#ffffff',
    stroke: '#333333',
    strokeWidth: 0.5,
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
  };
}

function changeRemovablePointToTemp(pointId) {
  return {
    radius: 3.5,
    fill: '#ffffff',
    stroke: '#333333',
    strokeWidth: 0.5,
    selectable: true,
    shapeName: 'tempPoint',
    pointId,
    lockMovementX: false,
    lockMovementY: false,
  };
}

function generateExistingPolygonPoint(pointId, pointCoordinates) {
  return {
    radius: 3.5,
    fill: 'blue',
    stroke: '#333333',
    strokeWidth: 0.5,
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
  };
}

function generateRemovablePolygonPoint(pointId, pointCoordinates) {
  const returnObj = {
    radius: 4,
    fill: 'red',
    stroke: '#333333',
    strokeWidth: 0.5,
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

function generatestartingAddPolygonPoint(pointId, pointCoordinates) {
  const returnObj = {
    radius: 4,
    fill: 'green',
    stroke: '#333333',
    strokeWidth: 0.5,
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

(function setProperties() {
  polygonProperties.newPolygon = {
    stroke: 'rgba(255,0,0)',
    strokeWidth: 1.75,
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
  polygonProperties.newTempPolygon = {
    stroke: '#333333',
    strokeWidth: 0.8,
    fill: '#cccccc',
    opacity: 0.3,
    selectable: false,
    hasBorders: false,
    hasControls: false,
    evented: false,
    objectCaching: false,
    numberOfNullPolygonPoints: -3,
  };
  polygonProperties.newLine = {
    strokeWidth: 1.1,
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
  };
  polygonProperties.firstPoint = {
    fill: 'red',
    shapeName: 'firstPoint',
    lockMovementX: true,
    lockMovementY: true,
  };
  polygonProperties.removablePoint = {
    fill: 'red',
    radius: 4,
  };
  polygonProperties.defaultPoint = {
    fill: 'blue',
    radius: 3.5,
  };
  polygonProperties.additionalPoint = {
    fill: 'green',
    radius: 4,
  };
  polygonProperties.disabledButton = {
    fill: 'white',
    radius: 3,
  };
  polygonProperties.selectedStartingAddPoint = {
    shapeName: 'initialAddPoint',
    radius: 3.5,
  };
  polygonProperties.newPoint = generateNewPoint;
  polygonProperties.changeRemovablePointToTemp = changeRemovablePointToTemp;
  polygonProperties.existingPolygonPoint = generateExistingPolygonPoint;
  polygonProperties.removablePolygonPoint = generateRemovablePolygonPoint;
  polygonProperties.startingAddPolygonPoint = generatestartingAddPolygonPoint;
}());


export { polygonProperties as default };
