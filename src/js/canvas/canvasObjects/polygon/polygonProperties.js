const polygonProperties = {};

function generateNewCircle(circleId, event, canvas) {
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
    shapeName: 'tempCircle',
    circleId,
    objectCaching: false,
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
    lockMovementY: true,
    lockMovementX: true,
    shapeName: 'polygon',
    selectable: true,
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
    lockMovementY: true,
    lockMovementX: true,
    shapeName: 'polygon',
    selectable: true,
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
}());


export { polygonProperties as default };
