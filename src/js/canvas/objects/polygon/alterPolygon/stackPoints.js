function sendPolygonPointsToFrontImpl(canvas, polygonPoints) {
  // sometimes canvas not available
  canvas.discardActiveObject();
  polygonPoints.forEach((point) => {
    if (point) {
      point.bringForward();
    }
  });
}

export { sendPolygonPointsToFrontImpl as default };
