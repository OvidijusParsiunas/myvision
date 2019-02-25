import fabric from 'fabric';
import polygonProperties from './polygon/polygonProperties';

const min = 99;
const max = 999999;

let canvas = null;
let pointArray = [];
let lineArray = [];
let polygonMode = true;
let activeLine = null;
let activeShape = false;

function drawPolygon(options) {
  if (activeLine && activeLine.class === 'line') {
    const pointer = canvas.getPointer(options.e);
    activeLine.set({ x2: pointer.x, y2: pointer.y });
    const points = activeShape.get('points');
    points[pointArray.length] = {
      x: pointer.x,
      y: pointer.y,
    };
    activeShape.set({
      points,
    });
    canvas.renderAll();
  }
  canvas.renderAll();
}

function generatePolygon() {
  const points = [];
  pointArray.forEach((point) => {
    points.push({
      x: point.left,
      y: point.top,
    });
    canvas.remove(point);
  });
  lineArray.forEach((line) => {
    canvas.remove(line);
  });
  canvas.remove(activeShape).remove(activeLine);
  const polygon = new fabric.Polygon(points, polygonProperties.newPolygon);
  canvas.add(polygon);

  activeLine = null;
  activeShape = null;
  polygonMode = false;
  canvas.selection = true;
}

function addPoint(options) {
  const random = Math.floor(Math.random() * (max - min + 1)) + min;
  const id = new Date().getTime() + random;
  const circle = new fabric.Circle(polygonProperties.newCircle(id, options, canvas));
  if (pointArray.length === 0) {
    circle.set(polygonProperties.firstCircle);
  }
  let points = [(options.e.layerX / canvas.getZoom()),
    (options.e.layerY / canvas.getZoom()),
    (options.e.layerX / canvas.getZoom()),
    (options.e.layerY / canvas.getZoom())];
  const line = new fabric.Line(points, polygonProperties.newLine);
  if (activeShape) {
    const pos = canvas.getPointer(options.e);
    points = activeShape.get('points');
    points.push({
      x: pos.x,
      y: pos.y,
    });
    const polygon = new fabric.Polygon(points, polygonProperties.newTempPolygon);
    canvas.remove(activeShape);
    canvas.add(polygon);
    activeShape = polygon;
    canvas.renderAll();
  } else {
    const polyPoint = [{
      x: (options.e.layerX / canvas.getZoom()),
      y: (options.e.layerY / canvas.getZoom()),
    }];
    const polygon = new fabric.Polygon(polyPoint, polygonProperties.newTempPolygon);
    activeShape = polygon;
    canvas.add(polygon);
  }
  activeLine = line;

  pointArray.push(circle);
  lineArray.push(line);

  canvas.add(line);
  canvas.add(circle);
  canvas.selection = false;
}

function clearData() {
  polygonMode = true;
  pointArray = [];
  lineArray = [];
  activeLine = null;
}

function instantiatePolygon(options) {
  if (options.target && options.target.id === pointArray[0].id) {
    generatePolygon(pointArray);
  }
  if (polygonMode) {
    addPoint(options);
  }
}

function setPolygonCanvas(newCanvas) {
  canvas = newCanvas;
}

export {
  instantiatePolygon,
  drawPolygon,
  setPolygonCanvas,
  clearData,
};
