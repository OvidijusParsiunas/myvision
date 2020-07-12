import { initialiseSettingsPopupStyling } from './style';
import { assignSettingsPopupButtonEventHandlers } from './buttonClickEvents';

function initialiseSettingsPopup() {
  initialiseSettingsPopupStyling();
  assignSettingsPopupButtonEventHandlers();
}

export { initialiseSettingsPopup as default };
