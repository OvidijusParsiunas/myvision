import { initialiseExportDatasetsPopupStyling } from './style';
import assignExportDatasetsPopupButtonEventHandlers from './buttonClickEvents';

function initialiseExportDatasetsPopup() {
  initialiseExportDatasetsPopupStyling();
  assignExportDatasetsPopupButtonEventHandlers();
}

export { initialiseExportDatasetsPopup as default };
