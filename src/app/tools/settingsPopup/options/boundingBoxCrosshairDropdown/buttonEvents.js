import { setCrosshairColor } from '../../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode';

function assignBoundingBoxCrosshairDropdownButtonEventHandlers() {
  window.crosshairColorChange = setCrosshairColor;
}

export { assignBoundingBoxCrosshairDropdownButtonEventHandlers as default };
