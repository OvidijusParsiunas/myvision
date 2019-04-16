function removePolygonImpl(canvas, polygon) {
  if (polygon) {
    canvas.remove(polygon);
  }
}

export { removePolygonImpl as default };
