import { getLabelsVisibilityState, setLabelsVisibilityState } from '../facadeWorkersUtils/stateManager';
import { setAllLabelsVisibilityProperty } from '../../../../canvas/objects/label/label';

// toggle all shapes visibility
function toggleMachineLearning(canvas) {
    console.log('machine learning start');
    //   if (getLabelsVisibilityState()) {
//     setAllLabelsVisibilityProperty(false, canvas);
//     setLabelsVisibilityState(false);
//   } else {
//     setAllLabelsVisibilityProperty(true, canvas);
//     setLabelsVisibilityState(true);
//   }
}

export { toggleMachineLearning as default };
