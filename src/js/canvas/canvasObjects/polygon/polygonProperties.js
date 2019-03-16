const polygonProperties = {};

function generateNewCircle(pointId, event, canvas) {
  const pointer = canvas.getPointer(event.e);
  return {
    radius: 3,
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

function generateExistingPolygonCircle(pointId, pointCoordinates) {
  return {
    radius: 3,
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
  };
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
  };
  polygonProperties.newFinalPolygon = {
    perPixelTargetFind: true,
    hasBorders: false,
    hasControls: false,
    shapeName: 'polygonGrp',
    selectable: true,
    subTargetCheck: true,
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
  polygonProperties.firstCircle = {
    fill: 'red',
    shapeName: 'firstCircle',
  };
  polygonProperties.newCircle = generateNewCircle;
  polygonProperties.existingPolygonCircle = generateExistingPolygonCircle;
}());


export { polygonProperties as default };
