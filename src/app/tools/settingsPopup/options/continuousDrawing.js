import { getContinuousDrawingState, setContinuousDrawingState } from '../../state';

function changeContinuousDrawingSetting() {
  if (getContinuousDrawingState()) {
    setContinuousDrawingState(false);
  } else {
    setContinuousDrawingState(true);
  }
}

export { changeContinuousDrawingSetting as default };
