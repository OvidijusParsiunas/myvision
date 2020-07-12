function removePolygonPointsImpl(canvas, polygonPoints) {
  if (polygonPoints.length !== 0) {
    polygonPoints.forEach((point) => {
      canvas.remove(point);
    });
    canvas.renderAll();
    return [];
  }
  return polygonPoints;
}

export { removePolygonPointsImpl as default };
