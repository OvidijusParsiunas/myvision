import { getLabelsVisibilityState, setLabelsVisibilityState } from '../facadeWorkersUtils/stateManager';
import { setLabelsVisibilityProperty } from '../../../../canvas/objects/label/label';

function toggleLabelsVisibility(canvas) {
  if (getLabelsVisibilityState()) {
    setLabelsVisibilityProperty(false, canvas);
    setLabelsVisibilityState(false);
  } else {
    setLabelsVisibilityProperty(true, canvas);
    setLabelsVisibilityState(true);
  }
}

export { toggleLabelsVisibility as default };
