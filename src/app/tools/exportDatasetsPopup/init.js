import { initialiseExportDatasetsPopupStyling } from './style.js';
import assignExportDatasetsPopupButtonEventHandlers from './buttonClickEvents.js';

function initialiseExportDatasetsPopup() {
  initialiseExportDatasetsPopupStyling();
  assignExportDatasetsPopupButtonEventHandlers();
}

export { initialiseExportDatasetsPopup as default };
