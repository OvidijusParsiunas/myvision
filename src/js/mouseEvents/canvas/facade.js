import setDefaultCursorMode from './cursorModes/defaultMode';
import setRemovePointsMode from './cursorModes/removePointsMode';
import assignDrawBoundingBoxEvents from './events/drawBndBoxEvents';
import assignDrawPolygonEvents from './events/drawPolygonEvents';
import assignRemovePolygonEvents from './events/removePointsEvents';
import assignDefaultEvents from './events/defaultEvents';
import purgeCanvasMouseEvents from './events/purgeEvents';
import { removePolygon } from '../../canvas/canvasObjects/polygon/changePolygon';

let canvas = null;
let defaultState = false;
let editingPoints = false;

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
    setDefaultCursorMode(canvas, editingPoints);
    assignDefaultEvents(canvas);
    if (editingPoints) {
      editingPoints = false;
    }
    defaultState = true;
  }
}

function removePolygonPointBtnClick() {
  purgeCanvasMouseEvents(canvas);
  assignRemovePolygonEvents(canvas);
  setRemovePointsMode(canvas);
  defaultState = false;
  editingPoints = true;
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
