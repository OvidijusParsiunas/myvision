let lineArray = [];

function drawPolygon(event) {
  if (activeLine && activeLine.class === 'line') {
    const pointer = canvas.getPointer(event.e);
    activeLine.set({ x2: pointer.x, y2: pointer.y });
    const points = activeShape.get('points');
    points[pointArray.length] = {
      x: pointer.x,
      y: pointer.y,
    };
    activeShape.set({
      points,
    });
  }
  canvas.renderAll();
}

function removeActiveLinesAndShape() {
  lineArray.forEach((line) => {
    canvas.remove(line);
  });
  canvas.remove(activeShape).remove(activeLine);
}

function addPoint(event) {
  const pointer = canvas.getPointer(event.e);
  const point = new fabric.Circle(polygonProperties.newPoint(pointId, event, canvas));
  pointId += 1;
  if (pointArray.length === 0) {
    point.set(polygonProperties.firstPoint);
  }
  let points = [pointer.x, pointer.y, pointer.x, pointer.y];
  const line = new fabric.Line(points, polygonProperties.newLine);
  if (activeShape) {
    points = activeShape.get('points');
    points.push({
      x: pointer.x,
      y: pointer.y,
    });
    const polygon = new fabric.Polygon(points, polygonProperties.newTempPolygon);
    canvas.remove(activeShape);
    canvas.add(polygon);
    activeShape = polygon;
    canvas.renderAll();
  } else {
    const polyPoint = [{
      x: pointer.x,
      y: pointer.y,
    }];
    const polygon = new fabric.Polygon(polyPoint, polygonProperties.newTempPolygon);
    activeShape = polygon;
    canvas.add(polygon);
  }
  activeLine = line;

  pointArray.push(point);
  lineArray.push(line);
  canvas.add(point);
  canvas.selection = false;
}

function addPoint(event) {
  const pointer = canvas.getPointer(event.e);
  const point = new fabric.Circle(polygonProperties.newPoint(pointId, event, canvas));
  pointId += 1;
  if (pointArray.length === 0) {
    point.set(polygonProperties.firstPoint);
  }
  let points = [pointer.x, pointer.y, pointer.x, pointer.y];
  const line = new fabric.Line(points, polygonProperties.newLine);
  if (activeShape) {
    points = activeShape.get('points');
    points.push({
      x: pointer.x,
      y: pointer.y,
    });
    const polygon = new fabric.Polygon(points, polygonProperties.newTempPolygon);
    canvas.remove(activeShape);
    canvas.add(polygon);
    activeShape = polygon;
    canvas.renderAll();
  } else {
    const polyPoint = [{
      x: pointer.x,
      y: pointer.y,
    }];
    const polygon = new fabric.Polygon(polyPoint, polygonProperties.newTempPolygon);
    activeShape = polygon;
    canvas.add(polygon);
  }
  activeLine = line;

  pointArray.push(point);
  lineArray.push(line);
  canvas.add(point);
  canvas.selection = false;
}
