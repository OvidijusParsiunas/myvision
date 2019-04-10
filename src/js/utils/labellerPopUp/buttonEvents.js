import { createLabelShape, removeTargetShape, isLabelling } from './labellingProcess';
import { resetCanvasEventsToDefault } from '../toolkit/buttonEvents/facade';
import { hideLabelPopUp } from './style';

function labelShape() {
  createLabelShape();
  resetCanvasEventsToDefault();
}

function cancelLabellingProcess() {
  if (isLabelling()) {
    hideLabelPopUp();
    removeTargetShape();
  }
}

export { labelShape, cancelLabellingProcess };
