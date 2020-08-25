let isMouseOnCanvasStatus = false;
let mouseOverCallback = null;
let mouseOutCallback = null;

function getIsMouseOnCanvasStatus() {
  return isMouseOnCanvasStatus;
}

function removeExecutedFunctionOnMouseOver() {
  mouseOverCallback = null;
}

function removeExecutedFunctionOnMouseOut() {
  mouseOutCallback = null;
}

function mouseOverCanvas() {
  isMouseOnCanvasStatus = true;
  if (mouseOverCallback) {
    mouseOverCallback();
    removeExecutedFunctionOnMouseOver();
  }
}

function mouseOutCanvas() {
  isMouseOnCanvasStatus = false;
  if (mouseOutCallback) mouseOutCallback();
}

function executeFunctionOnceOnMouseOver(func) {
  mouseOverCallback = func;
}

function executeFunctionOnMouseOut(func) {
  mouseOutCallback = func;
}

function registerMouseOverOutEvents() {
  window.mouseOverCanvas = mouseOverCanvas;
  window.mouseOutCanvas = mouseOutCanvas;
}

export {
  executeFunctionOnceOnMouseOver, registerMouseOverOutEvents,
  removeExecutedFunctionOnMouseOver, getIsMouseOnCanvasStatus,
  executeFunctionOnMouseOut, removeExecutedFunctionOnMouseOut,
};
