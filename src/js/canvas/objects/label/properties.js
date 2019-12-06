const labelProperties = {};

let fontSize = 10;
let polygonLabelTop = 0;
let polygonOffsetLeft = 10;
let polygonOffsetTop = 12;

function setZoomInProperties(fontRatio) {
  fontSize -= fontSize * fontRatio;
  polygonLabelTop += 0.5;
}

function setZoomOutProperties(fontRatio) {
  fontSize *= fontRatio;
  polygonLabelTop -= 0.5;
}

function getLabelProps(coordinates, attachedShape) {
  const returnObj = {
    fontSize,
    fill: 'yellow',
    left: coordinates.left,
    top: coordinates.top,
    shapeName: 'label',
    attachedShape,
    hasControls: false,
    selectable: false,
    hasBorders: false,
    objectCaching: false,
    evented: false,
  };
  return returnObj;
}

function generatePolygonOffsetProperties() {
  return {
    left: polygonOffsetLeft,
    top: polygonOffsetTop - polygonLabelTop,
  };
}

function updatePolygonOffsetProperties(newOffsetRatio) {
  polygonOffsetLeft *= newOffsetRatio.width;
  polygonOffsetTop *= newOffsetRatio.height;
}

function setPolygonOffsetProperties(newOffsetData) {
  polygonOffsetLeft = newOffsetData.width;
  polygonOffsetTop = newOffsetData.height;
}

function generateBoundingBoxOffsetProperties() {
  return {
    left: 2,
  };
}

(function setProperties() {
  labelProperties.pointOffsetProperties = generatePolygonOffsetProperties;
  labelProperties.boundingBoxOffsetProperties = generateBoundingBoxOffsetProperties;
  labelProperties.getLabelProps = getLabelProps;
  labelProperties.setZoomInProperties = setZoomInProperties;
  labelProperties.setZoomOutProperties = setZoomOutProperties;
  labelProperties.updatePolygonOffsetProperties = updatePolygonOffsetProperties;
  labelProperties.setPolygonOffsetProperties = setPolygonOffsetProperties;
}());

export { labelProperties as default };
