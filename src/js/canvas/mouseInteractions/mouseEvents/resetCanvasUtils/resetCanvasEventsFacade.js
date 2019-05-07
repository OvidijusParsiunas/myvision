import { removeEditedPolygonId } from '../eventWorkers/editPolygonEventsWorker';

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

export { setResetCanvasEventsToDefaultFunc, resetCanvasEventsToDefault };
