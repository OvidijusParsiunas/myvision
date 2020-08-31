const crosshairProps = {};

let strokeWidth = 1;
let verticalDelta = 0.7;
let horizontalDelta = 0.3;

function setZoomInProperties(crosshairRatio) {
  strokeWidth -= strokeWidth * crosshairRatio;
  verticalDelta -= verticalDelta * crosshairRatio;
  horizontalDelta -= horizontalDelta * crosshairRatio;
}

function setZoomOutProperties(crosshairRatio) {
  strokeWidth *= crosshairRatio;
  verticalDelta *= crosshairRatio;
  horizontalDelta *= crosshairRatio;
}

function getHorizontalDelta() {
  return horizontalDelta;
}

function getVerticalDelta() {
  return verticalDelta;
}

function getCrosshairProps() {
  return {
    fill: 'white',
    shapeName: 'crosshairLine',
    stroke: 'white',
    strokeWidth,
    selectable: false,
    evented: false,
  };
}

// http://fabricjs.com/controls-customization
(function setProperties() {
  crosshairProps.crosshairProps = getCrosshairProps;
  crosshairProps.verticalDelta = getVerticalDelta;
  crosshairProps.horizontalDelta = getHorizontalDelta;
  crosshairProps.setZoomInProperties = setZoomInProperties;
  crosshairProps.setZoomOutProperties = setZoomOutProperties;
}());

export { crosshairProps as default };
