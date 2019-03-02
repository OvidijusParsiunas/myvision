function setDrawCursorMode(canvas) {
  // should be called by the calling function
  // purgeCanvasMouseEvents(canvas);
  canvas.discardActiveObject();
  canvas.renderAll();
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = false;
  });
  canvas.defaultCursor = 'crosshair';
  canvas.hoverCursor = 'crosshair';
}

export { setDrawCursorMode as default };
