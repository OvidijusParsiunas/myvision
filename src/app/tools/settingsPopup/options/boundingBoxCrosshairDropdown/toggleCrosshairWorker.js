import { getCrosshairForBoundingBoxVisibleState, setCrosshairForBoundingBoxVisibleState, setCrosshairUsedOnCanvasState } from '../../../state.js';
import { getCreateBoundingBoxButtonState } from '../../../toolkit/styling/state.js';
import { setDrawCursorMode } from '../../../../canvas/mouseInteractions/cursorModes/drawMode.js';
import { setDrawWithCrosshairMode, removeCrosshair } from '../../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode.js';

let canvas = null;

function assignCanvasForCrosshairToggle(canvasObj) {
  canvas = canvasObj;
}

function toggleCrosshair() {
  if (getCrosshairForBoundingBoxVisibleState()) {
    if (getCreateBoundingBoxButtonState() === 'active') {
      removeCrosshair(canvas);
      setDrawCursorMode(canvas);
    }
    setCrosshairUsedOnCanvasState(false);
    setCrosshairForBoundingBoxVisibleState(false);
  } else {
    if (getCreateBoundingBoxButtonState() === 'active') {
      setDrawWithCrosshairMode(canvas);
    }
    setCrosshairUsedOnCanvasState(true);
    setCrosshairForBoundingBoxVisibleState(true);
  }
}

export { assignCanvasForCrosshairToggle, toggleCrosshair };
