import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import { setDefaultCursorModeAfterAlteringPolygonPoints, setDefaultCursorMode } from '../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import {
  setDefaultState, getAlteringPolygonPointsState, setAlteringPolygonPointsState,
  getDefaultState, getAddingPolygonPointsState, getLastDrawingModeState, getContinuousDrawingState,
} from '../facadeWorkersUtils/stateManager';
import assignDrawBoundingBoxEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawBndBoxEventHandlers';
import assignDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers';

function initiateResetCanvasEventsToDefaultEvent(canvas) {
  canvas.discardActiveObject();
  if (!getDefaultState()) {
    purgeCanvasMouseEvents(canvas);
    if (getAddingPolygonPointsState()) {
      setDefaultCursorModeAfterAlteringPolygonPoints(canvas);
    } else {
      setDefaultCursorMode(canvas);
    }
    assignDefaultEvents(canvas, null, getAddingPolygonPointsState());
    if (getAlteringPolygonPointsState()) {
      setAlteringPolygonPointsState(false);
    }
    setDefaultState(true);
  }
  if (getContinuousDrawingState()) {
    purgeCanvasMouseEvents(canvas);
    if (getLastDrawingModeState() === 'polygon') {
      // switch to start
      assignDrawPolygonEvents(canvas);
    } else if (getLastDrawingModeState() === 'boundingBox') {
      // switch to start
      assignDrawBoundingBoxEvents(canvas);
    }
    setDefaultState(true);
  }
}

export { initiateResetCanvasEventsToDefaultEvent as default };
