import { isEditingLabelInLabelList, finishEditingLabelList } from '../../labelList/labelList';
import { getSettingsPopupOpenState, getExportDatasetsPopupOpenState } from '../../state';
import { hideSettingsPopup } from '../../settingsPopup/style';
import { hideExportDatasetsPopup } from '../../exportDatasetsPopup/style';

function closeAllPopups(event) {
  event = event || { target: { classList: [] } };
  if (isEditingLabelInLabelList()) {
    finishEditingLabelList(event);
  } else if (getSettingsPopupOpenState()) {
    if (event.target.classList[0] !== 'settings-popup-item') hideSettingsPopup();
  } else if (getExportDatasetsPopupOpenState()) {
    if (event.target.classList[0] !== 'export-datasets-popup-item') hideExportDatasetsPopup();
  }
}

export { closeAllPopups as default };
