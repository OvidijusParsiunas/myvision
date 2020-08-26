import { onMouseMoveEvent } from '../../keyEvents/mouse/mouseMove';
import { QUICK_DIM_SECONDS, THIN_DIM, QUICK_LIGHTUP_MILLISECONDS } from './consts';

let windowDimElement = null;
let canvas = null;
const IS_CROSSHAIR_MODE_ON = true;

function overrideIfInspecialLightUpMode(mode) {
  switch (mode) {
    case 'CROSSHAIR_FAST':
      return true;
    default:
      return false;
  }
}

function lightUpWindow(transitionDurationMillisecondsArg) {
  const transitionDurationMilliseconds = IS_CROSSHAIR_MODE_ON
    ? QUICK_LIGHTUP_MILLISECONDS : transitionDurationMillisecondsArg;
  windowDimElement.style.backgroundColor = 'rgba(0,0,0,0)';
  window.setTimeout(() => {
    windowDimElement.style.position = 'unset';
    // if the mouse is not refreshing correctly, consider setting a timeout for dispatchevent
    canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
  }, transitionDurationMilliseconds);
}

function overrideIfInspecialDimMode() {

}

function dimWindow(transitionDurationSecondsArg, backgroundColorArg) {
  // && currently in draw bounding box events
  const transitionDurationSeconds = IS_CROSSHAIR_MODE_ON
    ? QUICK_DIM_SECONDS : transitionDurationSecondsArg;
  const backgroundColor = IS_CROSSHAIR_MODE_ON
    ? THIN_DIM : backgroundColorArg;
  windowDimElement.style.transitionDuration = `${transitionDurationSeconds}s`;
  windowDimElement.style.MozTransitionDuration = `${transitionDurationSeconds}s`;
  windowDimElement.style.position = 'absolute';
  windowDimElement.style.backgroundColor = backgroundColor;
}

function assignCanvasToDimWindowService(canvasObj) {
  canvas = canvasObj;
}

function addMouseMoveEventListener() {
  windowDimElement.addEventListener('mousemove', onMouseMoveEvent);
}

function assignLocalVariables() {
  windowDimElement = document.getElementById('window-dim');
}

function initialiseWindowDimService() {
  assignLocalVariables();
  addMouseMoveEventListener();
}

export {
  initialiseWindowDimService, assignCanvasToDimWindowService, dimWindow, lightUpWindow,
};
