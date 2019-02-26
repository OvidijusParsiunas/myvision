import fabric from 'fabric';
import polygonProperties from './polygon/polygonProperties';
import { removeBndBoxIfLabelNamePending } from '../externalObjects/labelNamePopUp';

const min = 99;
const max = 999999;

let canvas = null;
let pointArray = [];
let lineArray = [];
let polygonMode = true;
let activeLine = null;
let activeShape = false;

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
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'move';
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = true;
  });
}

function addPoint(event) {
  const random = Math.floor(Math.random() * (max - min + 1)) + min;
  const id = new Date().getTime() + random;
  const pointer = canvas.getPointer(event.e);
  const circle = new fabric.Circle(polygonProperties.newCircle(id, event, canvas));
  if (pointArray.length === 0) {
    circle.set(polygonProperties.firstCircle);
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

function instantiatePolygon(event) {
  if (event.target && event.target.id && event.target.id === pointArray[0].id) {
    generatePolygon(pointArray);
  }
  if (polygonMode) {
    addPoint(event);
  }
}

function prepareCanvasForNewPolygon(canvasObj) {
  canvas = canvasObj;
  clearData();
  removeBndBoxIfLabelNamePending();
  canvas.discardActiveObject();
  canvas.renderAll();
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = false;
  });
  canvas.defaultCursor = 'crosshair';
  canvas.hoverCursor = 'crosshair';
}

export {
  instantiatePolygon,
  drawPolygon,
  prepareCanvasForNewPolygon,
  clearData,
};
