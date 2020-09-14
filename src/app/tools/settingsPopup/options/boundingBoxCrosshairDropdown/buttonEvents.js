import { setCrosshairColor } from '../../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode';
import { toggleCrosshair } from './toggleCrosshairWorker';

function assignBoundingBoxCrosshairDropdownButtonEventHandlers() {
  window.toggleCrosshair = toggleCrosshair;
  window.crosshairColorChange = setCrosshairColor;
}

export { assignBoundingBoxCrosshairDropdownButtonEventHandlers as default };
