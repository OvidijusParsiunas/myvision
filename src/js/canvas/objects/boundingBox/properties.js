/* import { getMovableObjectsState } from
 '../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';
 should be done here */

const boundingBoxProps = {};

function getTempBoundingBoxProps(coordinates) {
  return {
    left: coordinates.origX,
    top: coordinates.origY,
    stroke: 'hsla(112, 57%, 50%, 1)',
    strokeWidth: 2,
    fill: 'rgba(255,0,0,0)',
    shapeName: 'bndBoxTemp',
    objectCaching: false,
  };
}

// http://fabricjs.com/controls-customization
(function setProperties() {
  boundingBoxProps.tempBoundingBoxProps = getTempBoundingBoxProps;
  boundingBoxProps.finalBoundingBoxProps = {
    shapeName: 'bndBox',
    objectCaching: false,
    selectable: false,
    hasRotatingPoint: false,
    perPixelTargetFind: false,
    cornerSize: 8,
    strokeWidth: 1.75,
  };
}());

export { boundingBoxProps as default };
