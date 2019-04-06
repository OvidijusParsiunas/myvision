import { createLabelShape, removeTargetShape, isLabelling } from './labelShape';
import { resetCanvasEventsToDefault } from '../../mouseEvents/canvas/facade';
import { hideLabelPopUp } from './manipulateLabelPopUp';

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
