import { displayExportDatasetsPopUp, hideExportDatasetsPopUp } from '../../../exportDatasetsPopup/style';
import { getExportDatasetsPopUpOpenState } from '../../../stateMachine';

function toggleExportDatasetsPopUp() {
  if (!getExportDatasetsPopUpOpenState()) {
    displayExportDatasetsPopUp();
  } else {
    hideExportDatasetsPopUp();
  }
}

export { toggleExportDatasetsPopUp as default };
