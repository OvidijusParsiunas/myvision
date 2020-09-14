import { getCrosshairUsedOnCanvasState, setCrosshairUsedOnCanvasState } from '../../../state';
import { getCreateBoundingBoxButtonState } from '../../../toolkit/styling/state';
import { setDrawCursorMode } from '../../../../canvas/mouseInteractions/cursorModes/drawMode';
import { setDrawWithCrosshairMode, removeCrosshair } from '../../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode';

let canvas = null;

function assignCanvasForCrosshairToggle(canvasObj) {
  canvas = canvasObj;
}

function toggleCrosshair() {
  if (getCrosshairUsedOnCanvasState()) {
    if (getCreateBoundingBoxButtonState() === 'active') {
      removeCrosshair(canvas);
      setDrawCursorMode(canvas);
    }
    setCrosshairUsedOnCanvasState(false);
  } else {
    if (getCreateBoundingBoxButtonState() === 'active') {
      setDrawWithCrosshairMode(canvas);
    }
    setCrosshairUsedOnCanvasState(true);
  }
}

export { assignCanvasForCrosshairToggle, toggleCrosshair };
