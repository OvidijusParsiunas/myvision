import setDefaultCursorMode from './cursorModes/defaultMode';
import setRemovePointsMode from './cursorModes/removePointsModeManager';
import assignDrawBoundingBoxEvents from './events/drawBndBoxEvents';
import assignDrawPolygonEvents from './events/drawPolygonEvents';
import { assignRemovePointsEvents, exitRemovePointsEvents } from './events/removePointsEventsManager';
import assignDefaultEvents from './events/defaultEvents';
import purgeCanvasMouseEvents from './events/purgeEvents';
import { removePolygon } from '../../canvas/canvasObjects/polygon/changePolygon';

let canvas = null;
let defaultState = false;
let removingPoints = false;

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

function removeActiveShapeBtnClick() {
  if (canvas.getActiveObject()) {
    canvas.remove(canvas.getActiveObject());
  } else {
    removePolygon();
  }
}

function resetCanvasEventsToDefault() {
  if (!defaultState) {
    purgeCanvasMouseEvents(canvas);
    setDefaultCursorMode(canvas, removingPoints);
    assignDefaultEvents(canvas);
    if (removingPoints) {
      removingPoints = false;
    }
    defaultState = true;
  }
}

function removePolygonPointBtnClick() {
  if (!removingPoints) {
    purgeCanvasMouseEvents(canvas);
    assignRemovePointsEvents(canvas);
    setRemovePointsMode(canvas);
    defaultState = false;
    removingPoints = true;
  } else {
    purgeCanvasMouseEvents(canvas);
    defaultState = exitRemovePointsEvents(canvas);
    removingPoints = false;
  }
}

function assignCanvasMouseEvents(canvasObj) {
  canvas = canvasObj;
}

export {
  assignCanvasMouseEvents,
  createNewBndBoxBtnClick,
  createNewPolygonBtnClick,
  resetCanvasEventsToDefault,
  removeActiveShapeBtnClick,
  removePolygonPointBtnClick,
};
