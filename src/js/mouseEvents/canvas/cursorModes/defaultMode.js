function setDefaultCursorMode(canvas, editingPoints) {
  if (editingPoints) {
    canvas.forEachObject((iteratedObj) => {
      iteratedObj.lockMovementX = false;
      iteratedObj.lockMovementY = false;
    });
  } else {
    canvas.forEachObject((iteratedObj) => {
      iteratedObj.selectable = true;
    });
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'move';
  }
}

export { setDefaultCursorMode as default };
