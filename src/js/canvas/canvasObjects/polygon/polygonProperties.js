const polygonProperties = {};

function generateNewCircle(id, event, canvas) {
  const pointer = canvas.getPointer(event.e);
  return {
    radius: 5,
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
    id,
    objectCaching: false,
  };
}

(function setProperties() {
  polygonProperties.newPolygon = {
    stroke: '#333333',
    strokeWidth: 0.5,
    fill: 'red',
    opacity: 1,
    perPixelTargetFind: true,
    hasBorders: false,
    hasControls: false,
    lockMovementY: true,
    lockMovementX: true,
    shapeName: 'polygon',
  };
  polygonProperties.newTempPolygon = {
    stroke: '#333333',
    strokeWidth: 1,
    fill: '#cccccc',
    opacity: 0.3,
    selectable: false,
    hasBorders: false,
    hasControls: false,
    evented: false,
    objectCaching: false,
  };
  polygonProperties.newLine = {
    strokeWidth: 2,
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
  };
  polygonProperties.newCircle = generateNewCircle;
}());


export { polygonProperties as default };
