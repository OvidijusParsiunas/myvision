function sendPolygonPointsToFrontImpl(canvas, polygonPoints) {
  // sometimes canvas not available
  canvas.discardActiveObject();
  polygonPoints.forEach((point) => {
    if (point) {
      canvas.bringToFront(point);
    }
  });
}

export { sendPolygonPointsToFrontImpl as default };
