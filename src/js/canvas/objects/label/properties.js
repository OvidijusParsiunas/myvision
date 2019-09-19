const labelProperties = {};

let fontSize = 10;
let polygonLabelTop = 0;

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
    left: 10,
    top: 12 - polygonLabelTop,
  };
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
}());

export { labelProperties as default };
