import { initialiseSettingsPopupStyling } from './style.js';
import { assignCanvasForSettingsPopupOptionsClickEvents, assignSettingsPopupButtonEventHandlers } from './buttonEvents.js';
import { initialiseBoundingBoxCrosshairDropdownStyling } from './options/boundingBoxCrosshairDropdown/style.js';
import assignBoundingBoxCrosshairDropdownButtonEventHandlers from './options/boundingBoxCrosshairDropdown/buttonEvents.js';
import { assignCanvasForCrosshairToggle } from './options/boundingBoxCrosshairDropdown/toggleCrosshairWorker.js';

function assignCanvasForSettingsPopup(canvas) {
  assignCanvasForCrosshairToggle(canvas);
  assignCanvasForSettingsPopupOptionsClickEvents(canvas);
}

function initialiseSettingsPopup() {
  initialiseSettingsPopupStyling();
  assignSettingsPopupButtonEventHandlers();
  initialiseBoundingBoxCrosshairDropdownStyling();
  assignBoundingBoxCrosshairDropdownButtonEventHandlers();
}

export { assignCanvasForSettingsPopup, initialiseSettingsPopup };
