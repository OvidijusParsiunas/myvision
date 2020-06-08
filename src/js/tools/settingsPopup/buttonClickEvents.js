import { changeMovaleObjectsSetting } from './options/movableObjects';
import changeContinuousDrawingSetting from './options/continuousDrawing';
import changeLabelsVisibilitySetting from './options/labelsVisibility';

let canvas = null;

function assignCanvasForSettingsPopup(canvasObj) {
  canvas = canvasObj;
}

function assignSettingsPopupButtonEventHandlers() {
  window.toggleMovableObjects = changeMovaleObjectsSetting;
  window.toggleContinuousDrawing = changeContinuousDrawingSetting.bind({ canvas });
  window.toggleLabelsVisibility = changeLabelsVisibilitySetting.bind({ canvas });
}

export { assignSettingsPopupButtonEventHandlers, assignCanvasForSettingsPopup };
