import { getBoundingBoxCrosshairDropdownOpenState, setBoundingBoxCrosshairDropdownOpenState } from '../../../state';
import { setStickyPopupProperties } from '../../../utils/popups/stickyPopup';

let BoundingBoxCrosshairDropdownTriggerElement = null;
let BoundingBoxCrosshairDropdownElement = null;
let settingsPopUpElement = null;
const stickyProperties = { isPopupSticky: false, stickCoordinates: 0, bottomPxOverride: '-1px' };

function setPopoverPosition() {
  BoundingBoxCrosshairDropdownElement.style.right = `-${(settingsPopUpElement.getBoundingClientRect().width + 2) / 2 + 13}px`;
  BoundingBoxCrosshairDropdownElement.style.top = `${document.getElementsByClassName('settings-table-row-data')[0].getBoundingClientRect().height * 3 + 3}px`;
  BoundingBoxCrosshairDropdownElement.style.bottom = '';
}

function setStickyBoundingBoxCrosshairDropdownProperties() {
  setStickyPopupProperties(BoundingBoxCrosshairDropdownElement,
    BoundingBoxCrosshairDropdownTriggerElement, stickyProperties);
}

function setDisplayToBlock() {
  BoundingBoxCrosshairDropdownElement.style.display = 'block';
}

function displayBoundingBoxCrosshairDropdown() {
  setPopoverPosition();
  setDisplayToBlock();
  // may not need the following line if we are hiding before displaying again
  stickyProperties.isPopupSticky = false;
  setStickyBoundingBoxCrosshairDropdownProperties();
  setBoundingBoxCrosshairDropdownOpenState(true);
}

function hidePopover() {
  BoundingBoxCrosshairDropdownElement.style.display = 'none';
  BoundingBoxCrosshairDropdownElement.style.bottom = '';
}

function hideBoundingBoxCrosshairDropdown() {
  hidePopover();
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
  BoundingBoxCrosshairDropdownElement = document.getElementById('bounding-box-crosshair-dropdown');
  BoundingBoxCrosshairDropdownTriggerElement = document.getElementById('settings-popup-bounding-box-crosshair-dropdown-trigger');
}

function initialiseBoundingBoxCrosshairDropdownStyling() {
  assignBoundingBoxCrosshairDropdownLocalVariables();
  setInitialCheckBoxInputValues();
}

export {
  initialiseBoundingBoxCrosshairDropdownStyling, hideBoundingBoxCrosshairDropdown,
  setStickyBoundingBoxCrosshairDropdownProperties, triggerBoundingBoxCrosshairDropdown,
};
