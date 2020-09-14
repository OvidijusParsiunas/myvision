import { getLabelsVisibilityState, setLabelsVisibilityState } from '../../state';
import { setAllLabelsVisibilityProperty } from '../../../canvas/objects/label/label';

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
