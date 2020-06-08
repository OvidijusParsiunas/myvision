import { isEditingLabelInLabelList, finishEditingLabelList } from '../../labelList/labelList';
import { getSettingsPopUpOpenState, getExportDatasetsPopUpOpenState } from '../../stateMachine';
import { hideSettingsPopup } from '../../settingsPopup/style';
import { hideExportDatasetsPopUp } from '../../exportDatasetsPopup/style';

function closePopUps(event) {
  event = event || { target: { classList: [] } };
  if (isEditingLabelInLabelList()) {
    finishEditingLabelList(event);
  } else if (getSettingsPopUpOpenState()) {
    if (event.target.classList[0] !== 'settings-popup-item') hideSettingsPopup();
  } else if (getExportDatasetsPopUpOpenState()) {
    if (event.target.classList[0] !== 'export-datasets-popup-item') hideExportDatasetsPopUp();
  }
}

export { closePopUps as default };
