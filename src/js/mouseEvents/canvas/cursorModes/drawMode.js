// lift folder out of canvas folder
// rename buttons folder to toolsPanel
// rename contents to toolsButtonEvents

function setAllObjectsUneditable(canvas) {
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = false;
  });
}

function setDrawCursorMode(canvas, afterEditingPolygon) {
  canvas.discardActiveObject();
  if (!afterEditingPolygon) {
    setAllObjectsUneditable(canvas);
  }
  canvas.defaultCursor = 'crosshair';
  canvas.hoverCursor = 'crosshair';
  canvas.renderAll();
}

export { setDrawCursorMode as default };
