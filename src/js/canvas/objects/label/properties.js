const labelProperties = {};

let fontSize = 10;

function setZoomInProperties(fontRatio) {
  fontSize -= fontSize * fontRatio;
}

function getLabelProps(coordinates, attachedShape) {
  return {
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
}

function generatePolygonOffsetProperties() {
  return {
    left: 10,
    top: 12,
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
}());

export { labelProperties as default };
