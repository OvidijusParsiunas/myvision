function waitingForLabelCursorMode(canvas) {
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.hoverCursor = 'default';
  });
  canvas.defaultCursor = 'default';
}

export { waitingForLabelCursorMode as default };
