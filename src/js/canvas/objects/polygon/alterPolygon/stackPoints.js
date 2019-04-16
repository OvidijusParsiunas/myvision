function sendPolygonPointsToFrontImpl(canvas, polygonPoints) {
  canvas.discardActiveObject();
  polygonPoints.forEach((point) => {
    if (point) {
      point.bringForward();
    }
  });
}

export { sendPolygonPointsToFrontImpl as default };
