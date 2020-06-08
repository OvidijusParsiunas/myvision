import { initialiseExportLabelsPopupStyling } from './style';
import assignExportLabelsPopupButtonEventHandlers from './buttonClickEvents';

function initialiseSettingsPopup() {
  initialiseExportLabelsPopupStyling();
  assignExportLabelsPopupButtonEventHandlers();
}

export { initialiseSettingsPopup as default };
