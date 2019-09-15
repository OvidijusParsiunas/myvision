/* import { getMovableObjectsState } from
 '../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';
 should be done here */

const boundingBoxProps = {};

let tempBoundingBoxStrokeWidth = 2;
let finalBoundingBoxStrokeWidth = 1.75;

function setZoomInProperties(boundingBoxRatio) {
  tempBoundingBoxStrokeWidth -= tempBoundingBoxStrokeWidth * boundingBoxRatio;
  finalBoundingBoxStrokeWidth -= finalBoundingBoxStrokeWidth * boundingBoxRatio;
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
  };
}

// http://fabricjs.com/controls-customization
(function setProperties() {
  boundingBoxProps.tempBoundingBoxProps = getTempBoundingBoxProps;
  boundingBoxProps.finalBoundingBoxProps = getFinalBoundingBoxProps;
  boundingBoxProps.setZoomInProperties = setZoomInProperties;
}());

export { boundingBoxProps as default };
