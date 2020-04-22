import { getLabelsVisibilityState, setLabelsVisibilityState } from '../../stateMachine';
import { setAllLabelsVisibilityProperty } from '../../../canvas/objects/label/label';

function changeLabelsVisibilityState() {
  if (getLabelsVisibilityState()) {
    setAllLabelsVisibilityProperty(false, this.canvas);
    setLabelsVisibilityState(false);
  } else {
    setAllLabelsVisibilityProperty(true, this.canvas);
    setLabelsVisibilityState(true);
  }
}

export { changeLabelsVisibilityState as default };
