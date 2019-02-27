import fabric from 'fabric';
import polygonProperties from './polygon/polygonProperties';
import { removeActiveObjectsOnButtonClick, showLabelNamePopUp } from '../externalObjects/labelNamePopUp';
import { changeCanvasToDrawCursor, changeCanvasToDefaultCursor } from '../utils/objectMouseEvents';

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

function removeActiveLinesAndShape() {
  lineArray.forEach((line) => {
    canvas.remove(line);
  });
  canvas.remove(activeShape).remove(activeLine);
}

function generatePolygon(event) {
  const points = [];
  pointArray.forEach((point) => {
    points.push({
      x: point.left,
      y: point.top,
    });
    canvas.remove(point);
  });
  removeActiveLinesAndShape();
  const polygon = new fabric.Polygon(points, polygonProperties.newPolygon);
  canvas.add(polygon);

  activeLine = null;
  activeShape = null;
  polygonMode = false;
  const pointer = canvas.getPointer(event.e);
  showLabelNamePopUp(pointer.x, pointer.y, polygon, canvas, polygonProperties.newPolygon);
  changeCanvasToDefaultCursor(canvas);
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

function clearPolygonData() {
  pointArray.forEach((point) => {
    canvas.remove(point);
  });
  removeActiveLinesAndShape();
  pointArray = [];
  lineArray = [];
  activeShape = null;
  activeLine = null;
}

function instantiatePolygon(event) {
  if (event.target && event.target.id && event.target.id === pointArray[0].id) {
    generatePolygon(event);
  }
  if (polygonMode) {
    addPoint(event);
  }
}

function prepareCanvasForNewPolygon(canvasObj) {
  canvas = canvasObj;
  polygonMode = true;
  clearPolygonData();
  removeActiveObjectsOnButtonClick();
  canvas.discardActiveObject();
  changeCanvasToDrawCursor(canvas);
}

export {
  instantiatePolygon,
  drawPolygon,
  prepareCanvasForNewPolygon,
  clearPolygonData,
};
