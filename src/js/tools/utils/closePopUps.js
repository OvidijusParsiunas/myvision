import { isEditingLabelInLabelList, finishEditingLabelList } from '../labelList/labelList';
import { getSettingsPopUpOpenState, getExportDatasetsPopUpOpenState } from '../stateMachine';
import { hideSettingsPopup } from '../settingsPopup/style';
import { hideExportLabelsPopUp } from '../exportDatasetsPopup/style';

function closePopUps(event) {
  event = event || { target: { classList: [] } };
  if (isEditingLabelInLabelList()) {
    finishEditingLabelList(event);
  } else if (getSettingsPopUpOpenState()) {
    if (event.target.classList[0] !== 'settings-popup-item') {
      hideSettingsPopup(false);
    }
  } else if (getExportDatasetsPopUpOpenState()) {
    if (event.target.classList[0] !== 'export-labels-popup-item') {
      hideExportLabelsPopUp();
    }
  }
}

export { closePopUps as default };
