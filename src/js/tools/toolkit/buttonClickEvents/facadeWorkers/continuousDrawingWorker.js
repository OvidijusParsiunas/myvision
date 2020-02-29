import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import { setDefaultCursorMode } from '../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import {
  getContinuousDrawingState, setContinuousDrawingState, getHasDrawnShapeState,
  getReadyToDrawShapeState, setDefaultState,
} from '../facadeWorkersUtils/stateMachine';

function changeContinuousDrawingState(canvas) {
  if (getContinuousDrawingState()) {
    if (getHasDrawnShapeState() && getReadyToDrawShapeState()) {
      purgeCanvasMouseEvents(canvas);
      setDefaultCursorMode(canvas);
      assignDefaultEvents(canvas);
      setDefaultState(true);
    }
    setContinuousDrawingState(false);
  } else {
    setContinuousDrawingState(true);
  }
}

export { changeContinuousDrawingState as default };
