let windowDimElement = null;
let canvas = null;

function lightUpWindow(transitionDurationMillisonds) {
  windowDimElement.style.backgroundColor = 'rgba(0,0,0,0)';
  window.setTimeout(() => {
    windowDimElement.style.position = 'unset';
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

function initialiseWindowDimService() {
  windowDimElement = document.getElementById('window-dim');
}

export {
  initialiseWindowDimService, assignCanvasToDimWindowService, dimWindow, lightUpWindow,
};
