function setDefaultCursorMode(canvas) {
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = true;
  });
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'move';
}

export { setDefaultCursorMode as default };
