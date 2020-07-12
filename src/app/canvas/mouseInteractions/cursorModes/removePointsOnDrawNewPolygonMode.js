function setRemovePointsOnDrawNewPolygonMode(canvas) {
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
  canvas.renderAll();
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName === 'polygon' || iteratedObj.shapeName === 'bndBox') {
      iteratedObj.hoverCursor = 'default';
    }
  });
}

export { setRemovePointsOnDrawNewPolygonMode as default };
