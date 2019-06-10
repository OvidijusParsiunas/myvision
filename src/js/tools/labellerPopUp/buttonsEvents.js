import { createLabelShape, removeTargetShape, isLabelling } from './labellingProcess';
import { resetCanvasEventsToDefault } from '../toolkit/buttonEvents/facade';
import { hideLabelPopUp } from './style';
import { getContinuousDrawingState } from '../toolkit/buttonEvents/facadeWorkersUtils/stateManager';
import { isPolygonDrawingFinished, resetDrawPolygonMode } from '../../canvas/objects/polygon/polygon';

function labelShape() {
  createLabelShape();
  if (!getContinuousDrawingState()) {
    resetCanvasEventsToDefault();
  } else if (isPolygonDrawingFinished()) {
    resetDrawPolygonMode();
  }
}

function cancelLabellingProcess() {
  if (isLabelling()) {
    hideLabelPopUp();
    removeTargetShape();
  }
}

export { labelShape, cancelLabellingProcess };
