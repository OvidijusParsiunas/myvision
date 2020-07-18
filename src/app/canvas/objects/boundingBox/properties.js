const boundingBoxProps = {};

let tempBoundingBoxStrokeWidth = 2;
let finalBoundingBoxStrokeWidth = 1.75;

function setZoomInProperties(boundingBoxRatio) {
  tempBoundingBoxStrokeWidth -= tempBoundingBoxStrokeWidth * boundingBoxRatio;
  finalBoundingBoxStrokeWidth -= finalBoundingBoxStrokeWidth * boundingBoxRatio;
}

function setZoomOutProperties(boundingBoxRatio) {
  tempBoundingBoxStrokeWidth *= boundingBoxRatio;
  finalBoundingBoxStrokeWidth *= boundingBoxRatio;
}

function getTempBoundingBoxProps(coordinates) {
  return {
    left: coordinates.origX,
    top: coordinates.origY,
    stroke: 'hsla(112, 57%, 50%, 1)',
    strokeWidth: tempBoundingBoxStrokeWidth,
    fill: 'rgba(255,0,0,0)',
    shapeName: 'bndBoxTemp',
    objectCaching: false,
  };
}

function getFinalBoundingBoxProps() {
  return {
    shapeName: 'bndBox',
    objectCaching: false,
    selectable: false,
    hasRotatingPoint: false,
    perPixelTargetFind: false,
    cornerSize: 8,
    strokeWidth: finalBoundingBoxStrokeWidth,
    lockScalingFlip: true,
  };
}

function getStandaloneBoundingBoxProperties(imageDimensions) {
  return {
    shapeName: 'bndBox',
    objectCaching: false,
    selectable: false,
    hasRotatingPoint: false,
    perPixelTargetFind: false,
    cornerSize: 8,
    strokeWidth: finalBoundingBoxStrokeWidth,
    left: imageDimensions.left * imageDimensions.scaleX,
    top: imageDimensions.top * imageDimensions.scaleY,
    width: imageDimensions.width * imageDimensions.scaleX,
    height: imageDimensions.height * imageDimensions.scaleY,
    stroke: 'hsla(112, 57%, 50%, 1)',
    fill: 'rgba(255,0,0,0)',
    lockScalingFlip: true,
  };
}

// http://fabricjs.com/controls-customization
(function setProperties() {
  boundingBoxProps.tempBoundingBoxProps = getTempBoundingBoxProps;
  boundingBoxProps.finalBoundingBoxProps = getFinalBoundingBoxProps;
  boundingBoxProps.setZoomInProperties = setZoomInProperties;
  boundingBoxProps.setZoomOutProperties = setZoomOutProperties;
  boundingBoxProps.getStandaloneBoundingBoxProperties = getStandaloneBoundingBoxProperties;
}());

export { boundingBoxProps as default };
