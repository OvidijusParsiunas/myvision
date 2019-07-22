import { getLabelsVisibilityState, setLabelsVisibilityState } from '../facadeWorkersUtils/stateManager';
import { setLabelsVisibility } from '../../../../canvas/objects/label/label';

function toggleLabelsVisibility(canvas) {
  if (getLabelsVisibilityState()) {
    setLabelsVisibility(false, canvas);
    setLabelsVisibilityState(false);
  } else {
    setLabelsVisibility(true, canvas);
    setLabelsVisibilityState(true);
  }
}

export { toggleLabelsVisibility as default };
