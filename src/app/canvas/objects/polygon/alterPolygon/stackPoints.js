function sendPolygonPointsToFrontImpl(canvas, polygonPoints) {
  canvas.discardActiveObject();
  polygonPoints.forEach((point) => {
    if (point) {
      canvas.bringToFront(point);
    }
  });
}

export { sendPolygonPointsToFrontImpl as default };
