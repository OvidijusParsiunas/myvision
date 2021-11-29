import { changeMovaleObjectsSetting } from './options/movableObjects.js';
import changeContinuousDrawingSetting from './options/continuousDrawing.js';
import changeLabelsVisibilitySetting from './options/labelsVisibility.js';
import { getBoundingBoxCrosshairDropdownOpenState } from '../state.js';
import {
  hideBoundingBoxCrosshairDropdown as hideBoundingBoxCrosshairDropdownHandler,
  triggerBoundingBoxCrosshairDropdown,
} from './options/boundingBoxCrosshairDropdown/style.js';

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

function toggleCheckbox(func, isText) {
  func(canvas);
  if (isText) { this.checked = !this.checked; }
}

function assignSettingsPopupButtonClickEventHandlers() {
  window.toggleMovableObjects = toggleCheckbox.bind(
    document.getElementById('settings-popup-movable-objects-checkbox'), changeMovaleObjectsSetting,
  );
  window.toggleContinuousDrawing = toggleCheckbox.bind(
    document.getElementById('settings-popup-continuous-drawing-checkbox'), changeContinuousDrawingSetting,
  );
  window.toggleLabelsVisibility = toggleCheckbox.bind(
    document.getElementById('settings-popup-labels-visibility-checkbox'), changeLabelsVisibilitySetting,
  );
  window.toggleBoundingBoxCrosshairDropdown = triggerBoundingBoxCrosshairDropdown;
}

function assignSettingsPopupButtonEventHandlers() {
  assignSettingsPopupButtonClickEventHandlers();
  assignSettingsPopupButtonHoverEventHandlers();
}

export { assignSettingsPopupButtonEventHandlers, assignCanvasForSettingsPopupOptionsClickEvents };
