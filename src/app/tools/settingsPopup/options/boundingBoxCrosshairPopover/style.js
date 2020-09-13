import { setBoundingBoxCrosshairPopoverOpenState } from '../../../state';
import { setStickyPopupProperties } from '../../../utils/popups/stickyPopup';

let boundingBoxCrosshairPopoverTriggerElement = null;
let boundingBoxCrosshairPopoverElement = null;
let settingsPopUpElement = null;
const stickyProperties = { isPopupSticky: false, stickCoordinates: 0 };

function setPopoverPosition() {
  boundingBoxCrosshairPopoverElement.style.right = `-${(settingsPopUpElement.getBoundingClientRect().width + 2) / 2 + 13}px`;
  boundingBoxCrosshairPopoverElement.style.top = `${document.getElementsByClassName('settings-table-row-data')[0].getBoundingClientRect().height * 3 + 3}px`;
}

function setStickyBoundingBoxCrosshairPopoverProperties() {
  setStickyPopupProperties(boundingBoxCrosshairPopoverElement,
    boundingBoxCrosshairPopoverTriggerElement, stickyProperties);
}

function setDisplayToBlock() {
  boundingBoxCrosshairPopoverElement.style.display = 'block';
}

function displayBoundingBoxCrosshairPopover() {
  setPopoverPosition();
  setDisplayToBlock();
  setStickyBoundingBoxCrosshairPopoverProperties();
  setBoundingBoxCrosshairPopoverOpenState(true);
}

function hidePopover() {
  boundingBoxCrosshairPopoverElement.style.display = 'none';
  boundingBoxCrosshairPopoverElement.style.bottom = '';
}

function hideBoundingBoxCrosshairPopover() {
  hidePopover();
  stickyProperties.isPopupSticky = false;
  setBoundingBoxCrosshairPopoverOpenState(false);
}

function setInitialCheckBoxInputValues() {
  document.getElementById('settings-popup-bounding-box-crosshair-visibility-checkbox').checked = true;
}

function assignBoundingBoxCrosshairPopoverLocalVariables(settingsPopUpElementArg) {
  boundingBoxCrosshairPopoverElement = document.getElementById('bounding-box-crosshair-popover');
  boundingBoxCrosshairPopoverTriggerElement = document.getElementById('settings-popup-bounding-box-crosshair-popover-trigger');
  settingsPopUpElement = settingsPopUpElementArg;
}

function initialiseBoundingBoxCrosshairPopoverStyling(settingsPopUpElementArg) {
  assignBoundingBoxCrosshairPopoverLocalVariables(settingsPopUpElementArg);
  setInitialCheckBoxInputValues();
}

export {
  initialiseBoundingBoxCrosshairPopoverStyling, hideBoundingBoxCrosshairPopover,
  setStickyBoundingBoxCrosshairPopoverProperties, displayBoundingBoxCrosshairPopover,
};
