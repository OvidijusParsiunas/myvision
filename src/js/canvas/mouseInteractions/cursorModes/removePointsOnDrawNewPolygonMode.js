function setRemovePointsOnDrawNewPolygonMode(canvas) {
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
  canvas.renderAll();
}

export { setRemovePointsOnDrawNewPolygonMode as default };
