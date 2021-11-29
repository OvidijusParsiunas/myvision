import { getSettingsPopupOpenState } from '../../../state.js';
import { displaySettingsPopup, hideSettingsPopup } from '../../../settingsPopup/style.js';

function toggleSettingsPopup() {
  if (!getSettingsPopupOpenState()) {
    displaySettingsPopup();
  } else {
    hideSettingsPopup();
  }
}

export { toggleSettingsPopup as default };
