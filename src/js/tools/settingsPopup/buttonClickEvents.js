import changeMovaleObjectsState from './options/movableObjects';
import changeContinuousDrawingState from './options/continuousDrawing';
import changeLabelsVisibilityState from './options/labelsVisibility';

let canvas = null;

function assignCanvasForSettingsPopup(canvasObj) {
  canvas = canvasObj;
}

function initialiseSettingsPopup() {
  window.toggleMovableObjects = changeMovaleObjectsState.bind({ canvas });
  window.toggleContinuousDrawing = changeContinuousDrawingState.bind({ canvas });
  window.toggleLabelsVisibility = changeLabelsVisibilityState.bind({ canvas });
}

export { initialiseSettingsPopup, assignCanvasForSettingsPopup };
