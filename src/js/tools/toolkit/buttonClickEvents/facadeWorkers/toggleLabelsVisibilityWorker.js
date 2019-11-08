import { getLabelsVisibilityState, setLabelsVisibilityState } from '../facadeWorkersUtils/stateManager';
import { setAllLabelsVisibilityProperty } from '../../../../canvas/objects/label/label';

// toggle all shapes visibility
function toggleLabelsVisibility(canvas) {
  if (getLabelsVisibilityState()) {
    setAllLabelsVisibilityProperty(false, canvas);
    setLabelsVisibilityState(false);
  } else {
    setAllLabelsVisibilityProperty(true, canvas);
    setLabelsVisibilityState(true);
  }
}

export { toggleLabelsVisibility as default };
