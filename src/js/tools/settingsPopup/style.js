import { setSettingsPopUpOpenState } from '../stateMachine';

let settingsPopupElement = null;
let settingsToolkitButtonElement = null;
let stickCoordinates = 0;
let isPopupSticky = false;

function calculateElementOffset(element) {
  const rect = element.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

function setPopUpPosition() {
  const divOffset = calculateElementOffset(settingsToolkitButtonElement);
  settingsPopupElement.style.top = `${divOffset.top}px`;
}

function validateFullPopUpVisible() {
  const settingPopupBottom = settingsPopupElement.getBoundingClientRect().bottom;
  if (!isPopupSticky) {
    if (settingPopupBottom + 5 > document.body.scrollHeight) {
      settingsPopupElement.style.top = '';
      settingsPopupElement.style.bottom = '5px';
      stickCoordinates = settingPopupBottom + 10;
      isPopupSticky = true;
    }
  }
  if (isPopupSticky && stickCoordinates < document.body.scrollHeight) {
    setPopUpPosition();
    settingsPopupElement.style.bottom = '';
    isPopupSticky = false;
  }
}

function displayPopUp() {
  settingsPopupElement.style.display = 'block';
}

function hidePopUp() {
  settingsPopupElement.style.display = 'none';
  settingsPopupElement.style.bottom = '';
}

function displaySettingsPopup() {
  setPopUpPosition();
  displayPopUp();
  validateFullPopUpVisible();
  setSettingsPopUpOpenState(true);
}

function hideSettingsPopup() {
  hidePopUp();
  isPopupSticky = false;
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
  initialiseSettingsPopupStyling, hideSettingsPopup, displaySettingsPopup, validateFullPopUpVisible,
};
