import { displayExportDatasetsPopup, hideExportDatasetsPopup } from '../../../exportDatasetsPopup/style';
import { getExportDatasetsPopupOpenState } from '../../../stateMachine';

function toggleExportDatasetsPopup() {
  if (!getExportDatasetsPopupOpenState()) {
    displayExportDatasetsPopup();
  } else {
    hideExportDatasetsPopup();
  }
}

export { toggleExportDatasetsPopup as default };
