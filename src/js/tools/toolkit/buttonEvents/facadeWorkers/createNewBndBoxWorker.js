import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import assignDrawBoundingBoxEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawBndBoxEventHandlers';
import {
  setDefaultState, setAlteringPolygonPointsState,
  setLastDrawingModeState, setHasDrawnShapeState,
} from '../facadeWorkersUtils/stateManager';

function initiateCreateNewBndBoxEvents(canvas) {
  if (canvas.backgroundImage) {
    purgeCanvasMouseEvents(canvas);
    assignDrawBoundingBoxEvents(canvas);
    setDefaultState(false);
    setAlteringPolygonPointsState(false);
    setLastDrawingModeState('boundingBox');
    setHasDrawnShapeState(false);
  }
}

export { initiateCreateNewBndBoxEvents as default };
