import setDrawingMode from './setDrawingMode';
import { removeEditedPolygonId } from '../eventWorkers/editPolygonEventsWorker';
import { getLastDrawingModeState } from '../../../../tools/toolkit/buttonClickEvents/facadeWorkersUtils/stateManager';

let resetCanvasEventsFunc = null;
let canvas = null;

function setResetCanvasEventsToDefaultFunc(func, canvasObj) {
  resetCanvasEventsFunc = func;
  canvas = canvasObj;
}

function resetCanvasEventsToDefault() {
  removeEditedPolygonId();
  resetCanvasEventsFunc(canvas);
}

function setContinuousDrawingModeToLast() {
  setDrawingMode(getLastDrawingModeState(), canvas);
}

export {
  setResetCanvasEventsToDefaultFunc,
  resetCanvasEventsToDefault,
  setContinuousDrawingModeToLast,
};
