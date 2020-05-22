import { isEditingLabelInLabelList, finishEditingLabelList } from '../labelList/labelList';
import {
  getSettingsPopUpOpenState, setSettingsPopUpOpenState,
  getExportDatasetsPopUpOpenState, setExportDatasetsPopUpOpenState,
} from '../stateMachine';

function closePopUps(event) {
  event = event || { target: { classList: [] } };
  if (isEditingLabelInLabelList()) {
    finishEditingLabelList(event);
  } else if (getSettingsPopUpOpenState()) {
    if (event.target.classList[0] !== 'settings-popup-item') {
      const settingsPopupElement = document.getElementById('settings-popup');
      settingsPopupElement.style.display = 'none';
      setSettingsPopUpOpenState(false);
    }
  } else if (getExportDatasetsPopUpOpenState()) {
    if (event.target.classList[0] !== 'export-labels-popup-item') {
      const exportPopupElement = document.getElementById('export-labels-popup-parent');
      exportPopupElement.style.display = 'none';
      setExportDatasetsPopUpOpenState(false);
    }
  }
}

export { closePopUps as default };
