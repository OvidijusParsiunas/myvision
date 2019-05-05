let resetCanvasEventsFunc = null;
let canvas = null;

function setResetCanvasEventsToDefaultFunc(func, canvasObj) {
  resetCanvasEventsFunc = func;
  canvas = canvasObj;
}

function resetCanvasEventsToDefault() {
  resetCanvasEventsFunc(canvas);
}

export { setResetCanvasEventsToDefaultFunc, resetCanvasEventsToDefault };
