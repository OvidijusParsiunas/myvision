import purgeCanvasMouseEvents from '../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import { setDefaultCursorMode } from '../../../canvas/mouseInteractions/cursorModes/defaultMode';
import assignDefaultEvents from '../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import {
  getContinuousDrawingState, setContinuousDrawingState, getHasDrawnShapeState,
  getReadyToDrawShapeState, setDefaultState,
} from '../../stateMachine';
import { setLabellerPopupDimProperties } from '../../labellerModal/style';
import {
  QUICK_LIGHTUP_MILLISECONDS, SLOW_LIGHTUP_MILLISECONDS,
  QUICK_DIM_SECONDS, SLOW_DIM_SECONDS, THICK_DIM, THIN_DIM,
} from '../../dimWindow/consts';
import { setEditShapesButtonToActive } from '../../toolkit/styling/stateMachine';

function changeContinuousDrawingState() {
  if (getContinuousDrawingState()) {
    if (getHasDrawnShapeState() && getReadyToDrawShapeState()) {
      purgeCanvasMouseEvents(this.canvas);
      setDefaultCursorMode(this.canvas);
      assignDefaultEvents(this.canvas);
      setEditShapesButtonToActive();
      setDefaultState(true);
    }
    setLabellerPopupDimProperties(SLOW_LIGHTUP_MILLISECONDS, SLOW_DIM_SECONDS, THICK_DIM);
    setContinuousDrawingState(false);
  } else {
    setLabellerPopupDimProperties(QUICK_LIGHTUP_MILLISECONDS, QUICK_DIM_SECONDS, THIN_DIM);
    setContinuousDrawingState(true);
  }
}

export { changeContinuousDrawingState as default };
