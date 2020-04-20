import { getLabelsVisibilityState, setLabelsVisibilityState } from '../../../stateMachine';
import { setAllLabelsVisibilityProperty } from '../../../../canvas/objects/label/label';

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
