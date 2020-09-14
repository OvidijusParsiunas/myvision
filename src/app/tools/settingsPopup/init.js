import { initialiseSettingsPopupStyling } from './style';
import { assignSettingsPopupButtonEventHandlers } from './buttonEvents';

function initialiseSettingsPopup() {
  initialiseSettingsPopupStyling();
  assignSettingsPopupButtonEventHandlers();
}

export { initialiseSettingsPopup as default };
