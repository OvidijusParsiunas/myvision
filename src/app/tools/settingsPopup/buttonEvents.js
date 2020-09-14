import { changeMovaleObjectsSetting } from './options/movableObjects';
import changeContinuousDrawingSetting from './options/continuousDrawing';
import changeLabelsVisibilitySetting from './options/labelsVisibility';
import { getBoundingBoxCrosshairDropdownOpenState } from '../state';
import {
  hideBoundingBoxCrosshairDropdown as hideBoundingBoxCrosshairDropdownHandler,
  triggerBoundingBoxCrosshairDropdown,
} from './options/boundingBoxCrosshairDropdown/style';

let canvas = null;

function assignCanvasForSettingsPopupOptionsClickEvents(canvasObj) {
  canvas = canvasObj;
}

function hideBoundingBoxCrosshairDropdown() {
  if (getBoundingBoxCrosshairDropdownOpenState()) {
    hideBoundingBoxCrosshairDropdownHandler();
  }
}

function assignSettingsPopupButtonHoverEventHandlers() {
  window.hideBoundingBoxCrosshairDropdown = hideBoundingBoxCrosshairDropdown;
}

function assignSettingsPopupButtonClickEventHandlers() {
  window.toggleMovableObjects = changeMovaleObjectsSetting;
  window.toggleContinuousDrawing = changeContinuousDrawingSetting.bind({ canvas });
  window.toggleLabelsVisibility = changeLabelsVisibilitySetting.bind({ canvas });
  window.toggleBoundingBoxCrosshairDropdown = triggerBoundingBoxCrosshairDropdown;
}

function assignSettingsPopupButtonEventHandlers() {
  assignSettingsPopupButtonClickEventHandlers();
  assignSettingsPopupButtonHoverEventHandlers();
}

export { assignSettingsPopupButtonEventHandlers, assignCanvasForSettingsPopupOptionsClickEvents };
