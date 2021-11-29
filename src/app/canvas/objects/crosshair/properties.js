import { DEFAULT_STROKE_WIDTH, DEFAULT_VERTICAL_DELTA, DEFAULT_HORIZONTAL_DELTA } from './consts.js';

const crosshairProps = {};

let strokeWidth = DEFAULT_STROKE_WIDTH;
let verticalDelta = DEFAULT_VERTICAL_DELTA;
let horizontalDelta = DEFAULT_HORIZONTAL_DELTA;

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

function getStrokeWidth() {
  return strokeWidth;
}

function getHorizontalDelta() {
  return horizontalDelta;
}

function getVerticalDelta() {
  return verticalDelta;
}

function getCrosshairProps() {
  const crosshairColor = document.getElementById('settings-popup-bounding-box-crosshair-color-picker').value;
  return {
    fill: crosshairColor,
    shapeName: 'crosshairLine',
    stroke: crosshairColor,
    strokeWidth,
    selectable: false,
    evented: false,
  };
}

// http://fabricjs.com/controls-customization
(function setProperties() {
  crosshairProps.crosshairProps = getCrosshairProps;
  crosshairProps.strokeWidth = getStrokeWidth;
  crosshairProps.verticalDelta = getVerticalDelta;
  crosshairProps.horizontalDelta = getHorizontalDelta;
  crosshairProps.setZoomInProperties = setZoomInProperties;
  crosshairProps.setZoomOutProperties = setZoomOutProperties;
}());

export { crosshairProps as default };
