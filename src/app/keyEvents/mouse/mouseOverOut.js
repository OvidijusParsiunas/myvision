let isMouseOnCanvasStatus = false;
let canvasOverCallback = null;
let canvasOutCallback = null;

function getIsMouseOnCanvasStatus() {
  return isMouseOnCanvasStatus;
}

function removeExecutedFunctionOnMouseOver() {
  canvasOverCallback = null;
}

function removeExecutedFunctionOnMouseOut() {
  canvasOverCallback = null;
}

function mouseOverCanvas() {
  isMouseOnCanvasStatus = true;
  if (canvasOverCallback) {
    canvasOverCallback();
    removeExecutedFunctionOnMouseOver();
  }
}

function mouseOutCanvas() {
  isMouseOnCanvasStatus = false;
  if (canvasOutCallback) canvasOutCallback();
}

function executeFunctionOnceOnMouseOver(func) {
  canvasOverCallback = func;
}

function executeFunctionOnceOnMouseOut(func) {
  canvasOutCallback = func;
}

function registerMouseOverOutEvents() {
  window.mouseOverCanvas = mouseOverCanvas;
  window.mouseOutCanvas = mouseOutCanvas;
}

export {
  executeFunctionOnceOnMouseOver, registerMouseOverOutEvents,
  removeExecutedFunctionOnMouseOver, getIsMouseOnCanvasStatus,
  executeFunctionOnceOnMouseOut, removeExecutedFunctionOnMouseOut,
};
