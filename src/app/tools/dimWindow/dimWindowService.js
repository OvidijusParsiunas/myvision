import { onMouseMoveEvent } from '../../keyEvents/mouse/mouseMove';

let windowDimElement = null;
let canvas = null;

function lightUpWindow(transitionDurationMillisonds) {
  windowDimElement.style.backgroundColor = 'rgba(0,0,0,0)';
  window.setTimeout(() => {
    windowDimElement.style.position = 'unset';
    // if the mouse is not refreshing correctly, consider setting a timeout for dispatchevent
    canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
  }, transitionDurationMillisonds);
}

function dimWindow(transitionDurationSeconds, backgroundColor) {
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
