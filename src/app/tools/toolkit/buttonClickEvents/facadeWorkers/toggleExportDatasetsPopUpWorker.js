import { displayExportDatasetsPopup, hideExportDatasetsPopup } from '../../../exportDatasetsPopup/style.js';
import { getExportDatasetsPopupOpenState } from '../../../state.js';

function toggleExportDatasetsPopup() {
  if (!getExportDatasetsPopupOpenState()) {
    displayExportDatasetsPopup();
  } else {
    hideExportDatasetsPopup();
  }
}

export { toggleExportDatasetsPopup as default };
