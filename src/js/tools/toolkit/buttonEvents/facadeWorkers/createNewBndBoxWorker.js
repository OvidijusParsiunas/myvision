import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import assignDrawBoundingBoxEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawBndBoxEventHandlers';
import { setDefaultState, setAlteringPolygonPointsState, setLastDrawingModeState } from '../facadeWorkersUtils/stateManager';

function initiateCreateNewBndBoxEvents(canvas) {
  purgeCanvasMouseEvents(canvas);
  assignDrawBoundingBoxEvents(canvas);
  setDefaultState(false);
  setAlteringPolygonPointsState(false);
  setLastDrawingModeState('boundingBox');
}

export { initiateCreateNewBndBoxEvents as default };
