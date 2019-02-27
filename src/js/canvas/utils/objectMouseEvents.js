function changeCanvasToDrawCursor(canvas) {
  canvas.discardActiveObject();
  canvas.renderAll();
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = false;
  });
  canvas.defaultCursor = 'crosshair';
  canvas.hoverCursor = 'crosshair';
}

function changeCanvasToDefaultCursor(canvas) {
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'move';
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = true;
  });
}

export { changeCanvasToDrawCursor, changeCanvasToDefaultCursor };
