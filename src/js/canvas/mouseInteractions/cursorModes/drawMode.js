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
