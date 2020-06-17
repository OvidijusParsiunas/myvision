let baseDiv = null;
let canvas = null;

function lightUpWindow(transitionDurationMillisonds) {
  baseDiv = document.getElementById('window-dim');
  baseDiv.style.backgroundColor = 'rgba(0,0,0,0)';
  window.setTimeout(() => {
    baseDiv.style.position = '';
    canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
  }, transitionDurationMillisonds);
}

function dimWindow(transitionDurationSeconds, backgroundColor) {
  baseDiv = document.getElementById('window-dim');
  baseDiv.style.transitionDuration = `${transitionDurationSeconds}s`;
  baseDiv.style.MozTransitionDuration = `${transitionDurationSeconds}s`;
  baseDiv.style.position = 'absolute';
  baseDiv.style.backgroundColor = backgroundColor;
}

// refactor to use the same element here
function assignCanvasToDimWindowService(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasToDimWindowService, dimWindow, lightUpWindow };
