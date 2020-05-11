import { getLabelsVisibilityState, setLabelsVisibilityState } from '../../stateMachine';
import { setAllLabelsVisibilityProperty } from '../../../canvas/objects/label/label';

function changeLabelsVisibilitySetting() {
  if (getLabelsVisibilityState()) {
    setAllLabelsVisibilityProperty(false, this.canvas);
    setLabelsVisibilityState(false);
  } else {
    setAllLabelsVisibilityProperty(true, this.canvas);
    setLabelsVisibilityState(true);
  }
}

export { changeLabelsVisibilitySetting as default };
