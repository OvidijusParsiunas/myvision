import { setCrosshairUsedOnCanvasState } from '../../../state';
import { setCrosshairButtonToActive, getCrosshairButtonState, setCrosshairButtonToDefault } from '../../styling/state';

function toggleCrosshair() {
  if (getCrosshairButtonState() === 'active') {
    setCrosshairUsedOnCanvasState(false);
    setCrosshairButtonToDefault();
  } else {
    setCrosshairUsedOnCanvasState(true);
    setCrosshairButtonToActive();
  }
}

export { toggleCrosshair as default };
