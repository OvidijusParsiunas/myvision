import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import {
  setDefaultCursorModeAfterAlteringPolygonPoints,
  setDefaultCursorMode, setDefaultCursorModeWhenReadyToDrawShapes,
} from '../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import {
  setDefaultState, getAlteringPolygonPointsState, setAlteringPolygonPointsState,
  getDefaultState, getAddingPolygonPointsState,
} from '../facadeWorkersUtils/stateManager';

function initiateResetCanvasEventsToDefaultEvent(canvas) {
  canvas.discardActiveObject();
  if (!getDefaultState()) {
    purgeCanvasMouseEvents(canvas);
    if (getAddingPolygonPointsState()) {
      setDefaultCursorModeAfterAlteringPolygonPoints(canvas);
    } else {
      setDefaultCursorMode(canvas);
    }
    // wtf!
    setDefaultCursorMode(canvas, getAlteringPolygonPointsState());
    // anyway
    // setDefaultCursorModeWhenReadyToDrawShapes(canvas);
    assignDefaultEvents(canvas, null, getAddingPolygonPointsState());
    if (getAlteringPolygonPointsState()) {
      setAlteringPolygonPointsState(false);
    }
    setDefaultState(true);
  }
}

export { initiateResetCanvasEventsToDefaultEvent as default };
