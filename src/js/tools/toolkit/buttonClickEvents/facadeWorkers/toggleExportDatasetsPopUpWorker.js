import { displayExportLabelsPopUp, hideExportLabelsPopUp } from '../../../exportDatasetsPopup/style';
import { getExportDatasetsPopUpOpenState } from '../../../stateMachine';

function toggleExportDatasetsPopUp() {
  if (!getExportDatasetsPopUpOpenState()) {
    displayExportLabelsPopUp();
  } else {
    hideExportLabelsPopUp();
  }
}

export { toggleExportDatasetsPopUp as default };
