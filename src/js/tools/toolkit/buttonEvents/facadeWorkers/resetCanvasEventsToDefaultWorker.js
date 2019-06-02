import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import setDefaultCursorMode from '../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import {
  setDefaultState, getAlteringPolygonPointsState, setAlteringPolygonPointsState,
  getDefaultState, getAddingPolygonPointsState,
} from '../facadeWorkersUtils/stateManager';

function initiateResetCanvasEventsToDefaultEvent(canvas) {
  canvas.discardActiveObject();
  if (!getDefaultState()) {
    purgeCanvasMouseEvents(canvas);
    setDefaultCursorMode(canvas, getAlteringPolygonPointsState());
    assignDefaultEvents(canvas, null, getAddingPolygonPointsState());
    if (getAlteringPolygonPointsState()) {
      setAlteringPolygonPointsState(false);
    }
    setDefaultState(true);
  }
}

export { initiateResetCanvasEventsToDefaultEvent as default };
