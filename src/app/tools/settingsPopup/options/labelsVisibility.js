// Import the functions to get and set the visibility state of labels
import { getLabelsVisibilityState, setLabelsVisibilityState } from '../../state';

// Import the function to set the visibility property of all labels on the canvas
import { setAllLabelsVisibilityProperty } from '../../../canvas/objects/label/label';

// This function changes the visibility setting of labels on the canvas
function changeLabelsVisibilitySetting(canvas) {
  // Check if labels are currently visible
  if (getLabelsVisibilityState()) {
    // If labels are visible, set their visibility property to false and update the visibility state
    setAllLabelsVisibilityProperty(false, canvas);
    setLabelsVisibilityState(false);
   } else {
    // If labels are not visible, set their visibility property to true and update the visibility state
    setAllLabelsVisibilityProperty(true, canvas);
    setLabelsVisibilityState(true);
  }
}

// Export the changeLabelsVisibilitySetting function as the default export
export { changeLabelsVisibilitySetting as default };
