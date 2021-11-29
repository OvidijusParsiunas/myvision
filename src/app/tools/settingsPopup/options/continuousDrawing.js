import { getContinuousDrawingState, setContinuousDrawingState } from '../../state.js';
import { setLabellerPopupDimProperties } from '../../labellerModal/style.js';
import {
  QUICK_LIGHTUP_MILLISECONDS, SLOW_LIGHTUP_MILLISECONDS,
  QUICK_DIM_SECONDS, SLOW_DIM_SECONDS, THICK_DIM, THIN_DIM,
} from '../../dimWindow/consts.js';

function changeContinuousDrawingSetting() {
  if (getContinuousDrawingState()) {
    setLabellerPopupDimProperties(SLOW_LIGHTUP_MILLISECONDS, SLOW_DIM_SECONDS, THICK_DIM);
    setContinuousDrawingState(false);
  } else {
    setLabellerPopupDimProperties(QUICK_LIGHTUP_MILLISECONDS, QUICK_DIM_SECONDS, THIN_DIM);
    setContinuousDrawingState(true);
  }
}

export { changeContinuousDrawingSetting as default };
