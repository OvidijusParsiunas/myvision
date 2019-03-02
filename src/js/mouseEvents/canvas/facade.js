import setDefaultCursorMode from './cursorModes/defaultMode';
import assignDrawBoundingBoxEvents from './events/drawBndBoxEvents';
import assignDrawPolygonEvents from './events/drawPolygonEvents';
import assignDefaultEvents from './events/defaultEvents';
import purgeCanvasMouseEvents from './events/purgeEvents';

let canvas = null;
let defaultState = false;

function createNewBndBoxBtnClick() {
  purgeCanvasMouseEvents(canvas);
  assignDrawBoundingBoxEvents(canvas);
  defaultState = false;
}

function createNewPolygonBtnClick() {
  purgeCanvasMouseEvents(canvas);
  assignDrawPolygonEvents(canvas);
  defaultState = false;
}

function resetCanvasEventsToDefault() {
  if (!defaultState) {
    purgeCanvasMouseEvents(canvas);
    setDefaultCursorMode(canvas);
    assignDefaultEvents(canvas);
    defaultState = true;
  }
}

function assignCanvasMouseEvents(canvasObj) {
  canvas = canvasObj;
}

export {
  assignCanvasMouseEvents, createNewBndBoxBtnClick,
  createNewPolygonBtnClick, resetCanvasEventsToDefault,
};
