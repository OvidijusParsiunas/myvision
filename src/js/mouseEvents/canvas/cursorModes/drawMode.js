function setAllObjectsUneditable(canvas) {
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = false;
  });
}

function setDrawCursorMode(canvas, afterEditingPolygon) {
  canvas.discardActiveObject();
  canvas.renderAll();
  if (!afterEditingPolygon) {
    setAllObjectsUneditable(canvas);
  }
  canvas.defaultCursor = 'crosshair';
  canvas.hoverCursor = 'crosshair';
}

export { setDrawCursorMode as default };
