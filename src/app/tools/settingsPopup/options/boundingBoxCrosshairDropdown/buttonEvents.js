import { setCrosshairColor } from '../../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode';
import { toggleCrosshair as toggleCrosshairWorker } from './toggleCrosshairWorker';

interface ToggleCheckboxParams {
  func: () => void;
  isText?: boolean;
}

function toggleCheckbox({ func, isText = false }: ToggleCheckboxParams) {
  func();
  if (isText) {
    this.checked = !this.checked;
  }
}

const assignBoundingBoxCrosshairDropdownButtonEventHandlers = () => {
  const checkbox = document.getElementById('settings-popup-bounding-box-crosshair-visibility-checkbox');
  if (checkbox) {
    window.toggleCrosshair = toggleCheckbox.bind(checkbox, { func: toggleCrosshairWorker });
    window.crosshairColorChange = setCrosshairColor;
  }
};

export default assignBoundingBoxCrosshairDropdownButtonEventHandlers;

