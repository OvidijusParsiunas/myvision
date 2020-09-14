import { initialiseSettingsPopupStyling } from './style';
import { assignSettingsPopupButtonEventHandlers } from './buttonEvents';
import { initialiseBoundingBoxCrosshairDropdownStyling } from './options/boundingBoxCrosshairDropdown/style';
import assignBoundingBoxCrosshairDropdownButtonEventHandlers from './options/boundingBoxCrosshairDropdown/buttonEvents';

function initialiseSettingsPopup() {
  initialiseSettingsPopupStyling();
  assignSettingsPopupButtonEventHandlers();
  initialiseBoundingBoxCrosshairDropdownStyling();
  assignBoundingBoxCrosshairDropdownButtonEventHandlers();
}

export { initialiseSettingsPopup as default };
