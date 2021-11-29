import { getLabelsVisibilityState, setLabelsVisibilityState } from '../../state.js';
import { setAllLabelsVisibilityProperty } from '../../../canvas/objects/label/label.js';

function changeLabelsVisibilitySetting(canvas) {
  if (getLabelsVisibilityState()) {
    setAllLabelsVisibilityProperty(false, canvas);
    setLabelsVisibilityState(false);
  } else {
    setAllLabelsVisibilityProperty(true, canvas);
    setLabelsVisibilityState(true);
  }
}

export { changeLabelsVisibilitySetting as default };
