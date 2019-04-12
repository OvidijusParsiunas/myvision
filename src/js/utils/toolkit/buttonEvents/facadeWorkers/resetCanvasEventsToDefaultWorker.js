import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import setDefaultCursorMode from '../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import { setDefaultState, getDefaultState, getRemovingPointsState } from '../facadeWorkersUtils/stateManager';

function initiateResetCanvasEventsToDefaultEvent(canvas) {
  if (!getDefaultState()) {
    purgeCanvasMouseEvents(canvas);
    setDefaultCursorMode(canvas, getRemovingPointsState());
    assignDefaultEvents(canvas);
    if (getRemovingPointsState()) {
      setDefaultState(false);
    }
    setDefaultState(true);
  }
}

export { initiateResetCanvasEventsToDefaultEvent as default };
