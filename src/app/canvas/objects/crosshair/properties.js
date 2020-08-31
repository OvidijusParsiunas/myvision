const crosshairProps = {};

let strokeWidth = 2;
let verticalDelta = 0.7;

function setZoomInProperties(crosshairRatio) {
  strokeWidth -= strokeWidth * crosshairRatio;
  verticalDelta -= verticalDelta * crosshairRatio;
}

function setZoomOutProperties(crosshairRatio) {
  strokeWidth *= crosshairRatio;
  verticalDelta *= verticalDelta;
}

function getVerticalDelta() {
  return verticalDelta;
}

function getCrosshairProps() {
  return {
    fill: 'white',
    shapeName: 'crosshairLine',
    stroke: 'white',
    strokeWidth: 1,
    selectable: false,
    evented: false,
  };
}

// http://fabricjs.com/controls-customization
(function setProperties() {
  crosshairProps.crosshairProps = getCrosshairProps;
  crosshairProps.verticalDelta = getVerticalDelta;
  crosshairProps.setZoomInProperties = setZoomInProperties;
  crosshairProps.setZoomOutProperties = setZoomOutProperties;
}());

export { crosshairProps as default };
