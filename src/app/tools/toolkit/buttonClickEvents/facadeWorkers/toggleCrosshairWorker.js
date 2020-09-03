import { setCrosshairUsedOnCanvasState } from '../../../state';
import { setCrosshairButtonToActive, getCrosshairButtonState, setCrosshairButtonToDefault } from '../../styling/state';
import { setDrawCursorMode } from '../../../../canvas/mouseInteractions/cursorModes/drawMode';
import { setDrawWithCrosshairMode, removeCrosshair } from '../../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode';

// 123
function toggleCrosshair(canvas) {
  if (getCrosshairButtonState() === 'active') {
    // set the filter to default
    removeCrosshair(canvas);
    setDrawCursorMode(canvas);
    setCrosshairUsedOnCanvasState(false);
    setCrosshairButtonToDefault();
  } else {
    // set the filter to active
    setDrawWithCrosshairMode(canvas);
    setCrosshairUsedOnCanvasState(true);
    setCrosshairButtonToActive();
  }
}

export { toggleCrosshair as default };
