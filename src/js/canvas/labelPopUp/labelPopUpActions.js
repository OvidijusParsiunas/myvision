import { createLabelShape, removeTargetShape, getLabellingState } from './labelShape';
import { resetCanvasEventsToDefault } from '../../mouseEvents/canvas/facade';
import { hideLabelPopUp } from './manipulateLabelPopUp';

function labelShape() {
  createLabelShape();
  resetCanvasEventsToDefault();
}

function cancelLabellingProcess() {
  if (getLabellingState()) {
    hideLabelPopUp();
    removeTargetShape();
  }
}

export { labelShape, cancelLabellingProcess };
