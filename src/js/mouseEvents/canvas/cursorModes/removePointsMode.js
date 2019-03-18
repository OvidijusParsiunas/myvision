function setRemovePointsMode(canvas) {
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName === 'bndBox') {
      iteratedObj.selectable = false;
    } else {
      iteratedObj.lockMovementX = true;
      iteratedObj.lockMovementY = true;
    }
  });
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
  canvas.renderAll();
}

export { setRemovePointsMode as default };
