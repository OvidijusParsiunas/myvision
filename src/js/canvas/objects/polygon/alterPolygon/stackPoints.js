function sendPolygonPointsToFrontImpl(canvas, polygonPoints) {
  canvas.discardActiveObject();
  console.log(polygonPoints);
  polygonPoints.forEach((point) => {
    if (point) {
      point.bringForward();
    }
  });
}

export { sendPolygonPointsToFrontImpl as default };
