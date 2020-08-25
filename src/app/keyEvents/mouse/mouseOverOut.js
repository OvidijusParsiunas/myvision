let isMouseOnCanvasStatus = false;

function getIsMouseOnCanvasStatus() {
  return isMouseOnCanvasStatus;
}

function mouseOverCanvas() {
  isMouseOnCanvasStatus = true;
}

function mouseOutCanvas() {
  isMouseOnCanvasStatus = false;
}

function registerMouseOverOutEvents() {
  window.mouseOverCanvas = mouseOverCanvas;
  window.mouseOutCanvas = mouseOutCanvas;
}

export { registerMouseOverOutEvents, getIsMouseOnCanvasStatus };
