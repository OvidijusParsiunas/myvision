import {
  getContinuousDrawingState, setContinuousDrawingState,
} from '../facadeWorkersUtils/stateManager';

function changeContinuousDrawingState() {
  const continuousDrawingState = getContinuousDrawingState();
  if (continuousDrawingState) {
    setContinuousDrawingState(false);
  } else {
    setContinuousDrawingState(true);
  }
}

export { changeContinuousDrawingState as default };
