import { getScreenSizeDelta } from '../../../globalStyling/screenSizeDelta.js';
import { getBoundingBoxCrosshairDropdownOpenState, setBoundingBoxCrosshairDropdownOpenState } from '../../../state.js';
import { setStickyPopupProperties } from '../../../utils/popups/stickyPopup.js';

let boundingBoxCrosshairDropdownTriggerElement = null;
let boundingBoxCrosshairDropdownElement = null;
let settingsPopUpElement = null;
const stickyProperties = { isPopupSticky: false, stickCoordinates: 0, bottomPxOverride: '-1px' };

function setPopoverPosition() {
  boundingBoxCrosshairDropdownElement.style.right = `-${(settingsPopUpElement.getBoundingClientRect().width + 2) / 2 + (11.5 * getScreenSizeDelta())}px`;
  boundingBoxCrosshairDropdownElement.style.top = `${document.getElementsByClassName('settings-table-row-data')[0].getBoundingClientRect().height * 3 + 3}px`;
  boundingBoxCrosshairDropdownElement.style.bottom = '';
}

function setStickyBoundingBoxCrosshairDropdownProperties() {
  setStickyPopupProperties(boundingBoxCrosshairDropdownElement,
    boundingBoxCrosshairDropdownTriggerElement, stickyProperties);
}

function setDisplayToBlock() {
  boundingBoxCrosshairDropdownElement.style.display = 'block';
}

function setTriggerElementToDefault() {
  boundingBoxCrosshairDropdownTriggerElement.style.color = '#747474';
}

function setTriggerElementToActive() {
  boundingBoxCrosshairDropdownTriggerElement.style.color = '#c4c4c4';
}

function displayBoundingBoxCrosshairDropdown() {
  setPopoverPosition();
  setDisplayToBlock();
  setTriggerElementToActive();
  setStickyBoundingBoxCrosshairDropdownProperties();
  setBoundingBoxCrosshairDropdownOpenState(true);
}

function hideDropdownElement() {
  boundingBoxCrosshairDropdownElement.style.display = 'none';
  boundingBoxCrosshairDropdownElement.style.bottom = '';
}

function hideBoundingBoxCrosshairDropdown() {
  hideDropdownElement();
  setTriggerElementToDefault();
  stickyProperties.isPopupSticky = false;
  setBoundingBoxCrosshairDropdownOpenState(false);
}

function triggerBoundingBoxCrosshairDropdown() {
  if (getBoundingBoxCrosshairDropdownOpenState()) {
    hideBoundingBoxCrosshairDropdown();
  } else {
    displayBoundingBoxCrosshairDropdown();
  }
}

function setInitialCheckBoxInputValues() {
  document.getElementById('settings-popup-bounding-box-crosshair-visibility-checkbox').checked = true;
}

function assignBoundingBoxCrosshairDropdownLocalVariables() {
  settingsPopUpElement = document.getElementById('settings-popup');
  boundingBoxCrosshairDropdownElement = document.getElementById('bounding-box-crosshair-dropdown');
  boundingBoxCrosshairDropdownTriggerElement = document.getElementById('settings-popup-bounding-box-crosshair-dropdown-trigger');
}

function initialiseBoundingBoxCrosshairDropdownStyling() {
  assignBoundingBoxCrosshairDropdownLocalVariables();
  setInitialCheckBoxInputValues();
}

export {
  initialiseBoundingBoxCrosshairDropdownStyling, hideBoundingBoxCrosshairDropdown,
  setStickyBoundingBoxCrosshairDropdownProperties, triggerBoundingBoxCrosshairDropdown,
};
