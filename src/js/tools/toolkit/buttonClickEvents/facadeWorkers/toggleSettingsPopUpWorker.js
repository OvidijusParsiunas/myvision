import { getSettingsPopUpOpenState } from '../../../stateMachine';
import { displaySettingsPopup, hideSettingsPopup } from '../../../settingsPopup/style';

function toggleSettingsPopUp() {
  if (!getSettingsPopUpOpenState()) {
    displaySettingsPopup();
  } else {
    hideSettingsPopup();
  }
}

export { toggleSettingsPopUp as default };
