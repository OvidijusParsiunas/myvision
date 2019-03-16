import { createLabelShape, removeTargetShape, labellingState } from '../canvasObjects/objectGroups/labelAndShape';
import { resetCanvasEventsToDefault } from '../../mouseEvents/canvas/facade';
import { hideLabelPopUp } from './manipulateLabelPopUp';

function labelShape() {
  createLabelShape();
  resetCanvasEventsToDefault();
}

function cancelLabellingProcess() {
  if (labellingState.inProgress) {
    hideLabelPopUp();
    removeTargetShape();
    labellingState.inProgress = false;
  }
}

export { labelShape, cancelLabellingProcess };
