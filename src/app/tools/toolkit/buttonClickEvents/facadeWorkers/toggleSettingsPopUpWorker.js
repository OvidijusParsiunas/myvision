import { getSettingsPopupOpenState } from '../../../state';
import { displaySettingsPopup, hideSettingsPopup } from '../../../settingsPopup/style';

function toggleSettingsPopup() {
  if (!getSettingsPopupOpenState()) {
    displaySettingsPopup();
  } else {
    hideSettingsPopup();
  }
}

export { toggleSettingsPopup as default };
