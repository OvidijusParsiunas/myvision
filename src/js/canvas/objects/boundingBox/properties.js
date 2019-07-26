/* import { getMovableObjectsState } from
 '../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';
 should be done here */

const boundingBoxProps = {};

function getTempBoundingBoxProps(coordinates) {
  return {
    left: coordinates.origX,
    top: coordinates.origY,
    stroke: 'rgba(255,0,0)',
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
    fill: 'rgba(255,0,0,0)',
    shapeName: 'bndBox',
    objectCaching: false,
    selectable: false,
    hasRotatingPoint: false,
    perPixelTargetFind: false,
    cornerSize: 8,
  };
}());

export { boundingBoxProps as default };
