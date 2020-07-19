import setDrawingMode from './setDrawingMode';
import { removeEditedPolygonId } from '../eventWorkers/defaultEventsWorker';
import { getLastDrawingModeState } from '../../../../tools/state';

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
