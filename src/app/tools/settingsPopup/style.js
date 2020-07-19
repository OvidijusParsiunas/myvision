import { setSettingsPopupOpenState } from '../state';
import { setStickyPopupProperties, setPopupPosition } from '../utils/popups/stickyPopup';

let settingsPopupElement = null;
let settingsToolkitButtonElement = null;
const stickyProperties = { isPopupSticky: false, stickCoordinates: 0 };

function setStickySettingsPopupProperties() {
  setStickyPopupProperties(settingsPopupElement,
    settingsToolkitButtonElement, stickyProperties);
}

function displayPopup() {
  settingsPopupElement.style.display = 'block';
}

function hidePopup() {
  settingsPopupElement.style.display = 'none';
  settingsPopupElement.style.bottom = '';
}

function displaySettingsPopup() {
  setPopupPosition(settingsPopupElement, settingsToolkitButtonElement);
  displayPopup();
  setStickySettingsPopupProperties();
  setSettingsPopupOpenState(true);
}

function hideSettingsPopup() {
  hidePopup();
  stickyProperties.isPopupSticky = false;
  setSettingsPopupOpenState(false);
}

function setInitialCheckBoxInputValues() {
  document.getElementById('settings-popup-movable-objects-checkbox').checked = true;
  document.getElementById('settings-popup-continuous-drawing-checkbox').checked = true;
  document.getElementById('settings-popup-labels-visibility-checkbox').checked = true;
}

function assignSettingsPopupElementLocalVariables() {
  settingsPopupElement = document.getElementById('settings-popup');
  settingsToolkitButtonElement = document.getElementById('settings-button');
}

function initialiseSettingsPopupStyling() {
  assignSettingsPopupElementLocalVariables();
  setInitialCheckBoxInputValues();
}

export {
  initialiseSettingsPopupStyling, hideSettingsPopup,
  displaySettingsPopup, setStickySettingsPopupProperties,
};
