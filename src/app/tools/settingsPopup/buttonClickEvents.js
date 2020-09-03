import { changeMovaleObjectsSetting } from './options/movableObjects';
import changeContinuousDrawingSetting from './options/continuousDrawing';
import changeLabelsVisibilitySetting from './options/labelsVisibility';
import toggleCrosshair from '../toolkit/buttonClickEvents/facadeWorkers/toggleCrosshairWorker';

let canvas = null;

function assignCanvasForSettingsPopup(canvasObj) {
  canvas = canvasObj;
}

function assignSettingsPopupButtonEventHandlers() {
  window.toggleMovableObjects = changeMovaleObjectsSetting;
  window.toggleContinuousDrawing = changeContinuousDrawingSetting.bind({ canvas });
  window.toggleLabelsVisibility = changeLabelsVisibilitySetting.bind({ canvas });
  // 123
  window.toggleBoundingBoxCrosshair = toggleCrosshair.bind({ canvas });
}

export { assignSettingsPopupButtonEventHandlers, assignCanvasForSettingsPopup };
