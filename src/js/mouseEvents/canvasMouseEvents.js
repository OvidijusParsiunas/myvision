import {
  prepareCanvasForNewBndBox, instantiateNewBndBox, drawBndBox,
  finishDrawingBndBox, highlightBndBox, removeBndBoxHighlight,
} from '../canvas/canvasObjects/boundingBox';
import { instantiatePolygon, prepareCanvasForNewPolygon, drawPolygon } from '../canvas/canvasObjects/polygon';

let canvas = null;

function assignBoundingBoxEvents() {
  canvas.on('mouse:down', () => {
    instantiateNewBndBox();
  });

  canvas.on('mouse:over', (e) => {
    highlightBndBox(e);
  });

  canvas.on('mouse:out', (e) => {
    removeBndBoxHighlight(e);
  });

  canvas.on('mouse:move', (e) => {
    drawBndBox(e);
  });

  canvas.on('mouse:up', (e) => {
    finishDrawingBndBox(e);
  });
}

function assignPolygonEvents() {
  // if selected, stretch
  canvas.on('mouse:down', (e) => {
    instantiatePolygon(e);
  });

  canvas.on('mouse:move', (e) => {
    drawPolygon(e);
  });

  canvas.on('mouse:over', (e) => {
    if (e.target && e.target.selectable) {
      canvas.hoverCursor = 'move';
    } else {
      canvas.hoverCursor = 'crosshair';
    }
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
  prepareCanvasForNewPolygon(canvas);
  assignPolygonEvents();
}

function assignCanvasMouseEvents(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasMouseEvents, createNewBndBoxBtnClick, createNewPolygonBtnClick };
