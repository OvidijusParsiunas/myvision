import { initialiseSettingsPopupStyling } from './style';
import { assignCanvasForSettingsPopupOptionsClickEvents, assignSettingsPopupButtonEventHandlers } from './buttonEvents';
import { initialiseBoundingBoxCrosshairDropdownStyling } from './options/boundingBoxCrosshairDropdown/style';
import assignBoundingBoxCrosshairDropdownButtonEventHandlers from './options/boundingBoxCrosshairDropdown/buttonEvents';
import { assignCanvasForCrosshairToggle } from './options/boundingBoxCrosshairDropdown/toggleCrosshairWorker';

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
