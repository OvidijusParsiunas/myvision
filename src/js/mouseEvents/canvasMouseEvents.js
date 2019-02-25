import {
  prepareCanvasForNewBndBox, instantiateNewBndBox, drawBndBox,
  finishDrawingBndBox, highlightBndBox, removeBndBoxHighlight,
} from '../canvas/canvasObjects/boundingBox';
import {
  instantiatePolygon, setPolygonCanvas,
  drawPolygon, clearData,
} from '../canvas/canvasObjects/polygon';

let canvas = null;

function assignBoundingBoxEvents() {
  canvas.on('mouse:down', () => {
    instantiateNewBndBox();
  });

  canvas.on('mouse:over', (o) => {
    highlightBndBox(o);
  });

  canvas.on('mouse:out', (o) => {
    removeBndBoxHighlight(o);
  });

  canvas.on('mouse:move', (o) => {
    drawBndBox(o);
  });

  canvas.on('mouse:up', (o) => {
    finishDrawingBndBox(o);
  });
}

function assignPolygonEvents() {
  setPolygonCanvas(canvas);
  clearData();

  canvas.on('mouse:down', (o) => {
    instantiatePolygon(o);
  });

  canvas.on('mouse:move', (o) => {
    drawPolygon(o);
  });
}

function purgeCanvasMouseEvents() {
  if (canvas.__eventListeners) {
    canvas.__eventListeners['mouse:down'] = [];
    canvas.__eventListeners['mouse:over'] = [];
    canvas.__eventListeners['mouse:out'] = [];
    canvas.__eventListeners['mouse:move'] = [];
    canvas.__eventListeners['mouse:up'] = [];
  }
}

function createNewBndBoxBtnClick() {
  purgeCanvasMouseEvents();
  prepareCanvasForNewBndBox(canvas);
  assignBoundingBoxEvents();
}

function createNewPolygonBtnClick() {
  purgeCanvasMouseEvents();
  assignPolygonEvents();
}

function assignCanvasMouseEvents(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasMouseEvents, createNewBndBoxBtnClick, createNewPolygonBtnClick };
