let canvas = null;

function discardActiveObject() {
  canvas.discardActiveObject();
}

function assignCanvasForDiscardingObjects(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasForDiscardingObjects, discardActiveObject };
