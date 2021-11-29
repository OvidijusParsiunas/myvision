import { setCrosshairColor } from '../../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode.js';
import { toggleCrosshair } from './toggleCrosshairWorker.js';

function toggleCheckbox(func, isText) {
  func();
  if (isText) { this.checked = !this.checked; }
}

function assignBoundingBoxCrosshairDropdownButtonEventHandlers() {
  window.toggleCrosshair = toggleCheckbox.bind(
    document.getElementById('settings-popup-bounding-box-crosshair-visibility-checkbox'), toggleCrosshair,
  );
  window.crosshairColorChange = setCrosshairColor;
}

export { assignBoundingBoxCrosshairDropdownButtonEventHandlers as default };
