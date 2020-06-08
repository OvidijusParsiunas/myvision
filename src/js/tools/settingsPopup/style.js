import { setSettingsPopUpOpenState } from '../stateMachine';
import { setStickyPopupProperties, setPopUpPosition } from '../utils/popups/stickyPopup';

let settingsPopupElement = null;
let settingsToolkitButtonElement = null;
const stickyProperties = { isPopupSticky: false, stickCoordinates: 0 };

function setStickySettingsPopupProperties() {
  setStickyPopupProperties(settingsPopupElement,
    settingsToolkitButtonElement, stickyProperties);
}

function displayPopUp() {
  settingsPopupElement.style.display = 'block';
}

function hidePopUp() {
  settingsPopupElement.style.display = 'none';
  settingsPopupElement.style.bottom = '';
}

function displaySettingsPopup() {
  setPopUpPosition(settingsPopupElement, settingsToolkitButtonElement);
  displayPopUp();
  setStickySettingsPopupProperties();
  setSettingsPopUpOpenState(true);
}

function hideSettingsPopup() {
  hidePopUp();
  stickyProperties.isPopupSticky = false;
  setSettingsPopUpOpenState(false);
}

function assignSettingsPopupElementLocalVariables() {
  settingsPopupElement = document.getElementById('settings-popup');
  settingsToolkitButtonElement = document.getElementById('settings-button');
}

function initialiseSettingsPopupStyling() {
  assignSettingsPopupElementLocalVariables();
}

export {
  initialiseSettingsPopupStyling, hideSettingsPopup,
  displaySettingsPopup, setStickySettingsPopupProperties,
};
