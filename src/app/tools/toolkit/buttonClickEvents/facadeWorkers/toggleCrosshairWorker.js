import { setCrosshairUsedOnCanvasState } from '../../../state';
import {
  setCrosshairButtonToActive, getCrosshairButtonState,
  setCrosshairButtonToDefault, getCreateBoundingBoxButtonState,
} from '../../styling/state';
import { setDrawCursorMode } from '../../../../canvas/mouseInteractions/cursorModes/drawMode';
import { setDrawWithCrosshairMode, removeCrosshair } from '../../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode';

// 123
function toggleCrosshair(canvasArg) {
  const canvas = canvasArg || this.canvas;
  if (getCrosshairButtonState() === 'active') {
    // set the filter to default
    if (getCreateBoundingBoxButtonState() === 'active') {
      removeCrosshair(canvas);
      setDrawCursorMode(canvas);
    }
    setCrosshairUsedOnCanvasState(false);
    setCrosshairButtonToDefault();
  } else {
    // set the filter to active
    if (getCreateBoundingBoxButtonState() === 'active') {
      setDrawWithCrosshairMode(canvas);
    }
    setCrosshairUsedOnCanvasState(true);
    setCrosshairButtonToActive();
  }
}

export { toggleCrosshair as default };
